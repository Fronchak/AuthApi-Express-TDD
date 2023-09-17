import { NextFunction, Request, Response } from "express";
import BadRequestError from "../errors/BadRequestError";

const checkIdParam = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if(Number.isNaN(parseInt(id))) {
        return next(new BadRequestError('Id must be a number'));
    }
    next();
}

export default checkIdParam;
