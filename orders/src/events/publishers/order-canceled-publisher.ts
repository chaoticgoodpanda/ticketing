import {OrderCanceledEvent, Publisher, Subjects} from "@mikeytickets/common";


export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
    subject: Subjects.OrderCanceled = Subjects.OrderCanceled;
}