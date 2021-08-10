import {Publisher} from "./base-publisher";
import {TicketCreatedEvent} from "./ticket-created-event";
import {Subjects} from "./subjects";


// don't need much more than this, already defined Publisher in base-publisher class
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}