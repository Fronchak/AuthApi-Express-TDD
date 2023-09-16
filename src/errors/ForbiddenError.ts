import ApiError from "./ApiError";

class ForbiddenError extends ApiError {

  statusCode(): number {
    return 403;
  }
}

export default ForbiddenError;
