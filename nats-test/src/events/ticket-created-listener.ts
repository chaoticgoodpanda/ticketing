import {Message} from "node-nats-streaming";
import {Listener} from "./base-listener";
import {TicketCreatedEvent} from "./ticket-created-event";
import {Subjects} from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    // setting type and initial value to Subjects.TicketCreated ensures that type can never be changed, which is what we want
    readonly subject = Subjects.TicketCreated;
    queueGroupName = 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('Event data!', data);
        
        console.log(data.id);
        console.log(data.title);
        console.log(data.price);

        // send ack if message transmission is successful
        msg.ack();
    }
}