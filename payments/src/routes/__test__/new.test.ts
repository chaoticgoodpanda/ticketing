import request from 'supertest';
import {app} from "../../app";
import mongoose from "mongoose";
import {Order} from "../../models/order";
import {OrderStatus} from "@mikeytickets/common";
import {stripe} from "../../stripe";
import {Payment} from "../../models/payment";

// // ensures uses __mock__ stripe.ts.old file, not the real one
// jest.mock('../../stripe');

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

it('returns a 201 with valid inputs', async () => {
    // create custom userId
    const userId = mongoose.Types.ObjectId().toHexString();

    // randomly generate a price that's unlikely to be duplicated in last 10 orders for test
    // can also use this function to generate random ticket numbers
    const price = Math.floor(Math.random() * 100000);

    // building an order with the custom userId
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price,
        status: OrderStatus.Created
    });
    await order.save();

    // this actually calls the real Stripe API
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            // Stripe test mode test token
            token: 'tok_visa',
            orderId: order.id
        })
        .expect(201);

    // 50 reduces chances we'll miss the charge we're looking for
    const stripeCharges = await stripe.charges.list({limit: 50});
    const stripeCharge = stripeCharges.data.find(charge => {
        return charge.amount === price * 100;
    });

    // whether something is null or undefined is two different things
    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual('usd');

    // ensure payment was actually created with Stripe
    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id
    });
    expect(payment).not.toBeNull();


    // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    // expect(chargeOptions.source).toEqual('tok_visa');
    // expect(chargeOptions.amount).toEqual(order.price * 100);
    // expect(chargeOptions.currency).toEqual('usd');
});