import {Listener, OrderCreatedEvent, Subjects} from "@mikeytickets/common";
import { queueGroupName } from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {expirationQueue} from "../../queues/expiration-queue";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // returns time in milliseconds
        // returns difference between expiresAt time and time right now
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log('Waiting this many milliseconds to process the order: ', delay);

        await expirationQueue.add({
            orderId: data.id
        }, {
            // put in delay that is added in before we receive this job back
            // from the expiration queue to be processed
            // 10000 = 10 seconds in milliseconds
            delay: 10000
        });

        msg.ack();
    }
}