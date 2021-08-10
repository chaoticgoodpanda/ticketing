import nats from 'node-nats-streaming';
import {TicketCreatedPublisher} from "./events/ticket-created-publisher";

console.clear();

// naming convention for "client" in NATS is stan (NATS backwards)
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Publisher connected to NATS.');
    
    const publisher = new TicketCreatedPublisher(stan);
    try {
        publisher.publish({
            id: '123',
            title: 'concert',
            price: 20
        });
    } catch (err) {
        console.log(err);
    }

    
    // one hitch with NATS is that we cannot share an Object (like the below) directly to NATS
    // need to convert it to JSON first
    // const data = JSON.stringify({
    //     id: '123',
    //     title: 'concert',
    //     price: 20
    // });
    //
    // stan.publish('ticket:created', data, () => {
    //     console.log('Event published');
    // })
})