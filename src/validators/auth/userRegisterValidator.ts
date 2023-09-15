import { body } from "express-validator";
import IUserRepository from "../../interfaces/IUserRepository";

const userRegisterValidator = (userRepository: IUserRepository) => {
  return [
    body('email')
      .notEmpty({
        ignore_whitespace: true
      }).withMessage('Email is required')
      .isEmail().withMessage('Invalid email')
      .custom(async (email) => {
        if(email !== null && email.length > 0) {
          const user = await userRepository.findByEmail(email);
          if(user) {
            throw new Error('Email is already been used');
          }
        }
      }),
    body('password')
      .notEmpty({ ignore_whitespace: false }).withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must have at least 4 characteres'),
    body('confirmPassword')
      .custom((confirmPassword, { req }) => {
        const password = req.body.password;
        return password === confirmPassword;
      }).withMessage('Confirm password must match')
  ]
}

export default userRegisterValidator;
