import express, {Request, Response} from "express";
import {NotAuthorizedError, NotFoundError, requireAuth} from "@mikeytickets/common";
import {Order, OrderStatus} from "../models/order";


const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Canceled;
    await order.save();

    // publishing an event saying this order was canceled so the user knows about it


    // 204 is status code for confirmed deletion
    res.status(204).send(order);
});

export {router as deleteOrderRouter};