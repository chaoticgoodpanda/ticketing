import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from './routes/signin';
import {signoutRouter } from './routes/signout';
import {signupRouter} from "./routes/signup";
import {errorHandler} from "./middlewares/error-handler";
import {NotFoundError} from "./errors/not-found-error";
import cookieSession from "cookie-session";


const app = express();
//so our ngninx setup doesn't need HTTPS for development mode testing
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        //requires user to be on HTTPS connection
        //change to 'false' IF we are in a test environment (and reset later for prod)
        secure: process.env.NODE_ENV !== 'test'
    })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);


app.all('*', async(req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };