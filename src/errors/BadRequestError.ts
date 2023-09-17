import ApiError from "./ApiError";

class BadRequestError extends ApiError {

  statusCode(): number {
    return 400;
  }
}

export default BadRequestError;
