import FieldError from "./FieldError";

class ValidationError extends Error {
  private errors: Array<FieldError>;

  constructor(msg: string, errors: Array<FieldError>) {
      super(msg);
      this.errors = errors;
  }

  public getErrors = (): Array<FieldError> => {
    return [ ...this.errors ];
  }
}

export default ValidationError;
