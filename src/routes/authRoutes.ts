import { Router } from 'express';
import userRegisterValidator from '../validators/auth/userRegisterValidator';
import checkValidationErrors from '../middlewares/checkValidationErrors';

const authRoutes = Router();

authRoutes.post('/register',
  userRegisterValidator,
  checkValidationErrors
);

export default authRoutes;
