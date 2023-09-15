import { NextFunction, Request, Response } from "express";

const checkIdParam = (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if(Number.isNaN(parseInt(id))) {
        return next(new Error('Id must be a number'));
    }
    next();
}

export default checkIdParam;
