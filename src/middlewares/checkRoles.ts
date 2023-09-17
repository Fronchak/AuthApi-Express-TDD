import { NextFunction, Request, Response } from "express"
import CustomRequest from "../interfaces/CustomRequest"
import ForbiddenError from "../errors/ForbiddenError";

const checkRoles = (...necessaryRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authenticatedUser = (req as CustomRequest).user;
    const userRoles = authenticatedUser.roles;
    const hasAnyNecessaryRole = userRoles.some((userRole) => necessaryRoles.includes(userRole.name));
    if(hasAnyNecessaryRole) {
      return next();
    }
    else {
      return next(new ForbiddenError(`You don't have permission to access this content`));
    }
  }
}

export default checkRoles;
