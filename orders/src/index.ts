//connect to mongoose, creating a new mongo DB called 'auth'
import mongoose from "mongoose";
import {app} from "./app";
import {natsWrapper} from "./nats-wrapper";
import { TicketCreatedListener} from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener} from "./events/listeners/ticket-updated-listener";
import {ExpirationCompleteListener} from "./events/listeners/expiration-complete-listener";
import {PaymentCreatedListener} from "./events/listeners/payment-created-listener";

const start = async () => {
    console.log('Starting once more....');
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

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();
        
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


