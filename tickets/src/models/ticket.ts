 import mongoose from "mongoose";
import {updateIfCurrentPlugin} from "mongoose-update-if-current";


interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
    
}

interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

// need to use uppercase String for global string type for Mongoose
// TypeScript only (see above), use lowercase string
const ticketSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    // not marked as required b/c when ticket is first created there is no order associated with it
    orderId: {
        type: String,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

// update the version number when a data entry is changed
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };