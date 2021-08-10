import nats from 'node-nats-streaming';
import { randomBytes } from "crypto";
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected to NATS.');
    
    // close connection immediately when we initiate a close
    stan.on('close', () => {
        console.log('NATS connection closed');
        process.exit();
    });
    
    new TicketCreatedListener(stan).listen();
});

// process watching for interrupt signals
process.on('SIGINT', () => stan.close());
// process watching for terminate signals
process.on('SIGTERM', () => stan.close());



