import { NextFunction, Request, Response } from "express";
import ErrorResponse from "./ErrorResponse";
import ValidationError from "../errors/ValidationError";
import ValidationErrorResponse from "./ValidationErrorResponse";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    //console.log(err);
    /*
    if(err instanceof EntityNotFoundError) {
        const response = buildResponse(err);
        return res.status(404).json(response);
    }
    if(err instanceof BadRequestError) {
        const response = buildResponse(err);
        return res.status(400).json(response);
    }
    */
    if(err instanceof ValidationError) {
        const response: ValidationErrorResponse = {
          message: err.message,
          errors: err.getErrors()
        }
        return res.status(422).json(response);
    }
    else {
        const response: ErrorResponse = {
            message: 'Something go wrong'
        };
        return res.status(500).json(response);
    }
}

export default errorHandler;
