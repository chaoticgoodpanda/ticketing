import {Subjects} from "./subjects";
import {Stan} from "node-nats-streaming";

// defining Event interface
interface Event {
    subject: Subjects;
    data: any;
}


export abstract class Publisher<T extends Event> {
    abstract subject: T['subject'];
    protected client: Stan;
    
    constructor(client: Stan) {
        this.client = client;
    }
    
    // Promise resolves with nothing at all, so it's of <void> type
    publish(data: T['data']): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.publish(this.subject, JSON.stringify(data), (err) => {
                if (err) {
                    return reject(err);
                }
                console.log('Event published to subject', this.subject);
                resolve();
            });
        })
        

    }
}