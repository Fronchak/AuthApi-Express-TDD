abstract class ApiError extends Error {

  abstract statusCode(): number;
}

export default ApiError;
