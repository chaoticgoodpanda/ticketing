import Queue from "bull";
import {ExpirationCompletePublisher} from "../events/publishers/expiration-complete-publisher";
import {natsWrapper} from "../nats-wrapper";

interface Payload {
    orderId: string;
}

// told typescript we're going to have a payload containing orderId flowing to and from the queue
const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
});

expirationQueue.process(async (job) => {
    await new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId
    });
});

export { expirationQueue };