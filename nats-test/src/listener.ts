import nats, {Message} from 'node-nats-streaming';

console.clear();

const stan = nats.connect('ticketing', '123', {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected to NATS.');
    
    // object that we're going to listen to and receive data through this subscription
    const subscription = stan.subscribe('ticket:created');
    
    // NATS refers to events as "messages" instead
    subscription.on('message', (msg: Message) => {
        const data = msg.getData();
        
        if(typeof data === 'string') {
            console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
        }
    });
});