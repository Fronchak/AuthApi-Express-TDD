import { body } from "express-validator";

const categoryInputValidator = () => {
  return [
    body('name')
      .notEmpty({ ignore_whitespace: true }).withMessage('Name is required')
      .isLength({ min: 2 }).withMessage('Name must have at least 2 characteres')
  ]
}

export default categoryInputValidator;
