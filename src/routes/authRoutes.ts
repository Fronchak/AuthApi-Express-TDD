import { Router } from 'express';
import userRegisterValidator from '../validators/auth/userRegisterValidator';
import checkValidationErrors from '../middlewares/checkValidationErrors';
import IUserRepository from '../interfaces/IUserRepository';
import AuthController from '../controllers/AuthController';
import loginValidator from '../validators/auth/loginValidator';
import resolver from './resolver';

const authRoutes = (userRepository: IUserRepository, authController: AuthController): Router => {
  const routes = Router();

  routes.post('/register',
    userRegisterValidator(userRepository),
    checkValidationErrors,
    resolver(authController.register)
  );

  routes.post('/login',
    loginValidator(),
    checkValidationErrors,
    resolver(authController.login)
  );

  return routes;
}

export default authRoutes;
