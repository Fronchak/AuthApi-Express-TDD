import { body } from "express-validator";

const loginValidator = () => {
  return [
    body('email')
      .notEmpty({ ignore_whitespace: true }).withMessage('Email is required'),
    body('password')
      .notEmpty({ ignore_whitespace: false }).withMessage('Password is required')
  ]
}

export default loginValidator;
