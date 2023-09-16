import ApiError from "./ApiError";

class UnauthorizedError extends ApiError {

  statusCode(): number {
    return 401;
  }
}

export default UnauthorizedError;
