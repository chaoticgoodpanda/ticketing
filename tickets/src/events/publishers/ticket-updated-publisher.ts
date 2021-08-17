import {Publisher, Subjects, TicketUpdatedEvent} from "@mikeytickets/common";


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    
}

