import ApiError from "./ApiError";
import FieldError from "./FieldError";

class ValidationError extends ApiError {
  private errors: Array<FieldError>;

  constructor(msg: string, errors: Array<FieldError>) {
      super(msg);
      this.errors = errors;
  }

  public getErrors = (): Array<FieldError> => {
    return [ ...this.errors ];
  }

  statusCode(): number {
    return 422;
  }
}

export default ValidationError;
