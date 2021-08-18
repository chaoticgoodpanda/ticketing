import {Listener, OrderCanceledEvent, OrderStatus, Subjects} from "@mikeytickets/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {Order} from "../../models/order";


export class OrderCanceledListener extends Listener<OrderCanceledEvent> {
    readonly subject = Subjects.OrderCanceled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCanceledEvent['data'], msg: Message) {
        // don't use findById because only trying to cancel one specific entry, not change a bunch of entries
        const order = await Order.findOne({
            _id: data.id,
            version: data.version -1,
        });

        if (!order) {
            throw new Error('Order not found.');
        }

        order.set({ status: OrderStatus.Canceled});
        await order.save();

        msg.ack();
    }
}