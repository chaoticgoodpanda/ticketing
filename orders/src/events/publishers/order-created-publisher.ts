import {OrderCreatedEvent, Publisher, Subjects} from "@mikeytickets/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
