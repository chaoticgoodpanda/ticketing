import express, {Request, Response} from "express";
import {Ticket} from "../models/ticket";
import {BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest} from "@mikeytickets/common";
import {body} from "express-validator";
import {TicketUpdatedPublisher} from "../events/publishers/ticket-updated-publisher";
import {natsWrapper} from "../nats-wrapper";


const router = express.Router();

router.put(
    '/api/tickets/:id', 
    requireAuth, 
    [
        body('title')
            .not()
            .isEmpty()
            .withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be provided & greater than 0')
        ],
    validateRequest,
    async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    // sees if a ticket is actually there
    if(!ticket) {
        throw new NotFoundError();
    }

    // if ticket is already reserved, prevent edits/updating of ticket
    if (ticket.orderId) {
        throw new BadRequestError('Sorry, ticket has already been reserved. Cannot edit a reserved ticket.');
    }
    
    if(ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    
    // if user actually owns ticket, apply update
    ticket.set({
        title: req.body.title,
        price: req.body.price
    });
    
    await ticket.save();
    
    // no 'await' here because decision to save latency is more important since updating event is not seen as relevant to notify user
    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    });
    
    res.send(ticket);
});

export { router as updateTicketRouter};

