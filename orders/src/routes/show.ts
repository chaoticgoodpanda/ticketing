import express, {Request, Response} from "express";
import {NotAuthorizedError, NotFoundError, requireAuth} from "@mikeytickets/common";
import {Order} from "../models/order";


const router = express.Router();

// assumes order provides an accurate id for /:orderId
router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');
    
    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    res.send(order);
});

export {router as showOrderRouter};