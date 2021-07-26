export abstract class CustomError extends Error {
    abstract statusCode: number;
 
    constructor(message: string) {
        //when calling super() almost equivalent to calling Error()
        //message just for logging purposes, user never sees it
        super(message);
        
        Object.setPrototypeOf(this, CustomError.prototype);
    }
    
    //must return an array of objects
    abstract serializeErrors(): { message: string, field?: string }[];
}