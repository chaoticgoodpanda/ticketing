"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
var custom_error_1 = require("../errors/custom-error");
var errorHandler = function (err, req, res, next) {
    //now if we throw any error from handler that invokes CustomError, serialize the appropriate error
    if (err instanceof custom_error_1.CustomError) {
        //throw the map of message+field into the res.status object to have it conform to the errors-> message:field: format
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    console.error(err);
    res.status(400).send({
        errors: [{ message: "Something went wrong" }],
    });
};
exports.errorHandler = errorHandler;
