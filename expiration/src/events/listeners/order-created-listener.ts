import {Listener, OrderCreatedEvent, Subjects} from "@mikeytickets/common";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}