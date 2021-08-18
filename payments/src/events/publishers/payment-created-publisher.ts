import {PaymentCreatedEvent, Publisher, Subjects} from "@mikeytickets/common";


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}