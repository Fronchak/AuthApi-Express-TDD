import { Router } from "express";
import ITokenValidator from "../interfaces/ITokenValidator";
import checkToken from "../middlewares/checkToken";
import checkRoles from "../middlewares/checkRoles";


const categoryRoutes = (tokenValidator: ITokenValidator): Router => {
  const routes = Router();

  routes.post('',
    checkToken(tokenValidator),
    checkRoles('worker', 'admin'),
    (req, res) => {
      res.status(200).json({});
    });

  return routes;
}

export default categoryRoutes;
