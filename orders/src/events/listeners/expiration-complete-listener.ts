import {ExpirationCompleteEvent, Listener, OrderStatus, Subjects} from "@mikeytickets/common";
import {Message} from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import {Order} from "../../models/order";
import {OrderCanceledPublisher} from "../publishers/order-canceled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    queueGroupName = queueGroupName;
    readonly subject = Subjects.ExpirationComplete;

    // incoming data attempting to say that an order should be canceled
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');

        // check if order is defined
        if (!order) {
            throw new Error('Order not found');
        }

        // make sure we don't cancel a paid-for order!
        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        order.set({
            // we don't need to clear out ticket as ticket: null due to the isReserved property we created in ticket.ts
            // this code line should only run when the order has NOT been paid for
            status: OrderStatus.Canceled,
        });
        await order.save();

        // create new order canceled publisher, pass in this listener's NATS client
        // publish function and reference to ticket this order was associated with
        // to let other services know we have canceled the order b/c it expired
        await new OrderCanceledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });

        msg.ack();
    }
}