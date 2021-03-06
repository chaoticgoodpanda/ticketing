import request from 'supertest';
import {Ticket} from "../../models/ticket";
import {app} from "../../app";
import {Order, OrderStatus} from "../../models/order";
import {natsWrapper} from "../../nats-wrapper";
import mongoose from "mongoose";

it('marks an order as canceled', async () => {
    // create a ticket with TicketModel
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'billyjean',
        price: 25
    });
    await ticket.save();

    const user = global.signin();
    // make a request to create an order
    const {body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    // make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);
    // expectation to ensure the order is canceled
    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
});

it('emits a order canceled event', async () => {
    // create a ticket with TicketModel
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'billyjean',
        price: 25
    });
    await ticket.save();

    const user = global.signin();
    // make a request to create an order
    const {body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    // make a request to cancel the order
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});