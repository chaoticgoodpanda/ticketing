import {Subjects} from "./subjects";
import {OrderStatus} from "./types/order-status";


export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated;
    data: {
        id: string;
        status: OrderStatus;
        userId: string;
        // save as string instead of a Date because we're going to convert it into JSON
        expiresAt: string
        ticket: {
            id: string;
            price: number;
        };
    };
}