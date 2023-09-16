import { NextFunction, Request, Response } from "express";
import ITokenValidator from "../interfaces/ITokenValidator";
import UnauthorizedError from "../errors/UnauthorizedError";
import CustomRequest from "../interfaces/CustomRequest";

const checkToken = (tokenValidator: ITokenValidator) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const user = await tokenValidator.validateToken(authHeader);
    if(!user) {
      return next(new UnauthorizedError('Invalid token'));
    }
    else {
      (req as CustomRequest).id = user.id!;
      (req as CustomRequest).user = user;
      return next();
    }
  }
}

export default checkToken;
