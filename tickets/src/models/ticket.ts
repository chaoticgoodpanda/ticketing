import mongoose from "mongoose";


interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
    
}

interface TicketDoc extends mongoose.Document {
    title: number;
    price: number;
    userId: string;
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
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
}); 

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };