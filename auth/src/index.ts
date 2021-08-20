//connect to mongoose, creating a new mongo DB called 'auth'
import mongoose from "mongoose";
import {app} from "./app";

const start = async () => {
    console.log('Starting up......');
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is undefined.');
    }
    if(!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is undefined.');
    }
    
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Connected to MongoDB yessir');
    } catch (err) {
        console.log(err);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000!!!!!!!!');
    });
};

start();


