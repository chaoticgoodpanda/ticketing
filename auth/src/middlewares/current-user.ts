import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from "express";

interface UserPayload {
    id: string,
    email: string
}

//this is how you modify the existing interface of Request to add in additional property "currentUser" to it
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}


export const currentUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.session?.jwt) {
        //continues on to the next middleware
        return next();
    }
    
    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
        req.currentUser = payload;
    } catch (err) {}

    next();
};