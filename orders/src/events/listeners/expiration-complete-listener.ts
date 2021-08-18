import {ExpirationCompleteEvent, Listener, Subjects} from "@mikeytickets/common";
import {Message} from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    queueGroupName = queueGroupName;
    readonly subject = Subjects.ExpirationComplete;

    // incoming data attemping to say that an order should be canceled
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {

    }
}