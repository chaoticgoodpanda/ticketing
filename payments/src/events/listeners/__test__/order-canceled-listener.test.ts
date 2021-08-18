import {OrderCanceledListener} from "../order-canceled-listener";
import {OrderCanceledEvent, OrderStatus} from "@mikeytickets/common";
import mongoose from "mongoose";
import {Order} from "../../../models/order";
import {natsWrapper} from "../../../nats-wrapper";
import {Message} from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCanceledListener(natsWrapper.client);

  //create an Order Object
  const order = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      price: 10,
      userId: 'adfkajldfwe',
      version: 0
  });
  await order.save();

  // create an Order object that marks this order as being canceled
  const data: OrderCanceledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'dafkldjkle'
    }
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order};
};

it('updates the status of the order', async () => {
  const {listener, data, msg, order} = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
});

it('acks the message', async () => {
  const {listener, data, msg, order} = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});