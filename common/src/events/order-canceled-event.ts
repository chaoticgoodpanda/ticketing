import {Subjects} from "./subjects";


export interface OrderCanceledEvent {
    subject: Subjects.OrderCreated;
    data: {
        id: string;
        version: number;
        ticket: {
            id: string;
        };
    };
}