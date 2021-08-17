import {Subjects} from "./subjects";


export interface ExpirationCompleteEvent {
    subject: Subjects.ExpirationComplete;
    data: {
        // all we need is orderId since we have set it to undefined, i.e. canceled
        orderId: string;
    };
}