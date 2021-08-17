import {BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest} from "@mikeytickets/common";
import express, {Request, Response} from "express";
import {body} from "express-validator";
import mongoose from "mongoose";
import {Ticket} from "../models/ticket";
import {Order} from "../models/order";
import {OrderCreatedPublisher} from "../events/publishers/order-created-publisher";
import {natsWrapper} from "../nats-wrapper";


const router = express.Router();

// seconds window before order expires
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/api/orders', requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        //ensures user is providing a valid mongo ID
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('Ticket ID must be provided.')
    ], 
    validateRequest, 
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;
        // Find the ticket the user is trying to order in the database
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new NotFoundError();
        }
        
        // Make sure that the ticket is not already reserved
       const isReserved = await ticket.isReserved();
        
        if (isReserved) {
            throw new BadRequestError('Ticket is already reserved.');
        }
        
        // Calculate an expiration date for this order
        const expiration = new Date();
        // Set expiration for ticket order to expire 
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
        
        // Build the order and save it to the database
        const order = Order.build({
           userId: req.currentUser!.id,
           status: OrderStatus.Created,
           expiresAt: expiration,
           ticket 
        });
        
        // persist the order
        await order.save();
        
        // Publish an event saying that an order was created
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            status: order.status,
            userId: order.userId,
            // this is when the order expires, when it expires we issue the expiry event
            // from the Expiration service
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price
            }
        });

        res.status(201).send(order);
});

export {router as newOrderRouter};