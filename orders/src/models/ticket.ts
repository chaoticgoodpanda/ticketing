import mongoose from "mongoose";
import {Order, OrderStatus} from "./order";
import {updateIfCurrentPlugin} from "mongoose-update-if-current";


interface TicketAttrs {
    id: string;
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: { id: string, version: number}): Promise<TicketDoc | null>;
    
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
});

ticketSchema.set('versionKey','version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = (event: { id: string, version: number}) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version -1
    });
};

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
};

// use function() keyword because mongoose not as compatible with TypeScript
// Run query to look at all orders and find order where the ticket is the
// ticket we just found *and* the order's status is *not* canceled.
// If we find an order that means the ticket is reserved.
ticketSchema.methods.isReserved = async function() {
    // this === the ticket document we just called isReserved on
    const existingOrder = await Order.findOne({
        ticket: this as any,
        status: {
            $in: [
                // if a ticket doesn't have any of these properties,
                // it's not isReserved and thus it's open again for buying
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete,

            ],
        },
    });
    
    // flips whatever current status is of existingOrder from true to false
    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export {Ticket};