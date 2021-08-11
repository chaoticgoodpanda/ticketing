import {Publisher, Subjects, TicketCreatedEvent} from "@mikeytickets/common";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    
}