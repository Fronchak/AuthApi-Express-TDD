import ApiError from "./ApiError";

class EntityNotFoundError extends ApiError {

  statusCode(): number {
    return 404;
  }
}

export default EntityNotFoundError;
