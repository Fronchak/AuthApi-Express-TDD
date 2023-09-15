import { body } from "express-validator";

const userRegisterValidator = [
    body('email')
      .notEmpty({
        ignore_whitespace: true
      }).withMessage('Email is required')
      .isEmail().withMessage('Invalid email'),
    body('password')
      .notEmpty({ ignore_whitespace: false }).withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must have at least 4 characteres'),
    body('confirmPassword')
      .custom((confirmPassword, { req }) => {
        const email = req.body.email;
        return email === confirmPassword;
      }).withMessage('Confirm password must match')
];

export default userRegisterValidator;
