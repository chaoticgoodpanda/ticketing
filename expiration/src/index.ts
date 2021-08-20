import {natsWrapper} from "./nats-wrapper";
import {OrderCreatedListener} from "./events/listeners/order-created-listener";

const start = async () => {
    console.log('Starting...');
    if(!process.env.NATS_CLIENT_ID) {
        throw new Error('MONGO_URI is undefined.');
    }
    if(!process.env.NATS_URL) {
        throw new Error('MONGO_URI is undefined.');
    }
    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error('MONGO_URI is undefined.');
    }
    
    try {
        // clusterId is defined as 'ticketing' under '-cid' in nats-depl.yaml
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );

        // close connection immediately when we initiate a close
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit();
        });

        // process watching for interrupt signals
        process.on('SIGINT', () => natsWrapper.client.close());
        // process watching for terminate signals
        process.on('SIGTERM', () => natsWrapper.client.close());

        new OrderCreatedListener(natsWrapper.client).listen();

    } catch (err) {
        console.log(err);
    }
};

start();


