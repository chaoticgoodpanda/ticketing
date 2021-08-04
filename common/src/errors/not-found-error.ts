import {CustomError} from "./custom-error";

export class NotFoundError extends CustomError {
    statusCode = 404;

    constructor() {
        super('Error -- Invalid route');

        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    //returns a common error structure that can be applied to infinite error types
    serializeErrors() {
        return [
            { message: 'Not Found' }
        ];
    }
}