import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from "cookie-session";
import {currentUser, errorHandler, NotFoundError} from '@mikeytickets/common';
import {createChargeRouter} from "./routes/new";


const app = express();
//so our ngninx setup doesn't need HTTPS for development mode testing
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        //requires user to be on HTTPS connection
        //change to 'false' IF we are in a test environment (and reset later for prod)
        // secure: process.env.NODE_ENV !== 'test'
        secure: false
    })
);
// when currentUser is authenticated, sets the req.session property
app.use(currentUser);

app.use(createChargeRouter);

app.all('*', async(req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);


export { app };