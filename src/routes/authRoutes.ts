import { Router } from 'express';
import userRegisterValidator from '../validators/auth/userRegisterValidator';
import checkValidationErrors from '../middlewares/checkValidationErrors';
import IUserRepository from '../interfaces/IUserRepository';
import AuthController from '../controllers/AuthController';

const authRoutes = (userRepository: IUserRepository, authController: AuthController): Router => {
  const routes = Router();

  routes.post('/register',
    userRegisterValidator(userRepository),
    checkValidationErrors,
    authController.register
  );

  return routes;
}

export default authRoutes;
