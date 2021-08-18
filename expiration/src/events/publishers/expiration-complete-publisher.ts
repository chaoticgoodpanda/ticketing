import {ExpirationCompleteEvent, Publisher, Subjects} from "@mikeytickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}