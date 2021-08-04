import {CustomError} from "./custom-error";

export class NotAuthorizedError extends CustomError {
    statusCode = 401;

    constructor() {
        super('Not authorized');

        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    //returns a common error structure that can be applied to infinite error types
    serializeErrors() {
        return [
            { message: 'Not authorized' }
        ];
    }
}