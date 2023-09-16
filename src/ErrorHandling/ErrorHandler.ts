import { NextFunction, Request, Response } from "express";
import ErrorResponse from "./ErrorResponse";
import ValidationError from "../errors/ValidationError";
import ValidationErrorResponse from "./ValidationErrorResponse";
import ApiError from "../errors/ApiError";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof ApiError) {
      if(err instanceof ValidationError) {
        const response: ValidationErrorResponse = {
          message: err.message,
          errors: err.getErrors()
        }
        return res.status(err.statusCode()).json(response);
      }
      else {
        const response: ErrorResponse = {
          message: err.message
        }
        return res.status(err.statusCode()).json(response);
      }
    }
    else {
      const response: ErrorResponse = {
          message: 'Something go wrong'
      };
      return res.status(500).json(response);
    }
}

export default errorHandler;
