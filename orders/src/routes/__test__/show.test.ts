import request from 'supertest';
import {Ticket} from "../../models/ticket";
import {app} from "../../app";

it('fetches the order', async () => {
    // Create a ticket
    const ticket = Ticket.build({
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

