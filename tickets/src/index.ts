//connect to mongoose, creating a new mongo DB called 'auth'
import mongoose from "mongoose";
import {app} from "./app";
import {natsWrapper} from "./nats-wrapper";
import {OrderCanceledListener} from "./events/listeners/order-canceled-listener";
import {OrderCreatedListener} from "./events/listeners/order-created-listener";

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is undefined.');
    }
    if(!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is undefined.');
    }
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

        new OrderCanceledListener(natsWrapper.client).listen();
        new OrderCreatedListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Connected to MongoDB yessir');
    } catch (err) {
        console.log(err);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000!!!!!!!!');
    });
};

start();


