import request from 'supertest';
import {app} from "../../app";
import mongoose from "mongoose";
import {Order} from "../../models/order";
import {OrderStatus} from "@mikeytickets/common";

it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'adkjadl;k',
            orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'adkjadl;k',
            orderId: order.id
        })
        .expect(401);
});

it('returns a 400 when purchasing a canceled order', async () => {
    // create custom userId
    const userId = mongoose.Types.ObjectId().toHexString();

    // building an order with the custom userId
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Canceled
    });
    await order.save();

    // request an order that has already been canceled
    // as the optional string to the global.signin we add our custom userId
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'adkjadl;k',
            orderId: order.id
        })
        .expect(400);
});