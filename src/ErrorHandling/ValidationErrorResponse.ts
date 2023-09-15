import FieldError from "../errors/FieldError";

type ValidationErrorResponse = {
  message: string,
  errors: Array<FieldError>
}

export default ValidationErrorResponse;
