import {NextFunction, Request, Response} from "express";
import {CustomError} from "../errors/custom-error";


export const errorHandler = (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction 

) => {
    //now if we throw any error from handler that invokes CustomError, serialize the appropriate error
  if (err instanceof CustomError) {
      //throw the map of message+field into the res.status object to have it conform to the errors-> message:field: format
      return res.status(err.statusCode).send({ errors: err.serializeErrors()});
  }
  
  console.error(err);
  res.status(400).send({
      errors: [{ message: "Something went wrong" }],
    });
};