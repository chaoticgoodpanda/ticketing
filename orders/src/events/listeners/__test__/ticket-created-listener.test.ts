import { TicketCreatedEvent} from "@mikeytickets/common";
import {TicketCreatedListener} from "../ticket-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import mongoose from "mongoose";

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // call the onMessage function with the data object + message object
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString()
    };

    // write assertions to make sure a ticket was created
};

it('creates and saves a ticket', async () => {

});

it('ack the message', async () => {

    // call the onMessage function with the data object + message object

    // write assertions to make ack function is called
});