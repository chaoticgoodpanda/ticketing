import request from 'supertest';
import {Ticket} from "../../models/ticket";
import {app} from "../../app";
import mongoose from "mongoose";

it('fetches the order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 40
    });
    await ticket.save();
    
    const user = global.signin();
    
    // make a request to build order with this ticket
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);
    
    // fetch order
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);
    
    expect(fetchedOrder.id).toEqual(order.id); 
    
});

it('returns an error if one user tries to fetch another users order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 40
    });
    await ticket.save();

    const user = global.signin();

    // make a request to build order with this ticket
    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201);

    // fetch order
    await request(app)
        .get(`/api/orders/${order.id}`)
        // instead of using the same user, create a new user using global.signin()
        .set('Cookie', global.signin())
        .send()
        .expect(401);


});

