import express, {Request, Response} from "express";
import {
    BadRequestError,
    NotAuthorizedError,
    NotFoundError,
    OrderStatus,
    requireAuth,
    validateRequest
} from "@mikeytickets/common";
import {body} from "express-validator";
import {Order} from "../models/order";
import {stripe} from "../stripe";
import {Payment} from "../models/payment";
import {PaymentCreatedPublisher} from "../events/publishers/payment-created-publisher";
import {natsWrapper} from "../nats-wrapper";



const router = express.Router();

// requires authentication for post router creation for Stripe
router.post('/api/payments',
    requireAuth,
    [
        body('token')
            .not()
            .isEmpty(),
        body('orderId')
            .not()
            .isEmpty()
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {token, orderId} = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFoundError();
        }

        if(order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        if (order.status === OrderStatus.Canceled) {
            throw new BadRequestError('Cannot pay for a canceled order.');
        }

        // engage with Stripe
        const charge = await stripe.charges.create({
            currency: 'usd',
            // dollar value we convert into cents by multiplying by 100 as required by Stripe docs
            amount: order.price * 100,
            source: token,
        });
        const payment = Payment.build({
            orderId,
            stripeId: charge.id,
            version: 0
        });
        await payment.save();
        
        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId,
            version: payment.version
        });

        res.status(201).send({ id: payment.id });
});



export { router as createChargeRouter };





