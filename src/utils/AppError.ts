// App Error class
class AppError extends Error {
  constructor(public readonly message: string, public readonly statusCode: number) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
  }

  static getStatus(statusCode: number): string {
    return statusCode >= 400 && statusCode < 500 ? "fail" : "error";
  }
}

const createError = (statusCode: number) => (message: string) => new AppError(message, statusCode);

type CreateErrorReturnType = ReturnType<typeof createError>;

export const DEFAULT_ERR_MESSAGE: string = "Uhhh!!! Something went wrong on the server.";

export const createBadRequestError: CreateErrorReturnType = createError(400);
export const createUnauthorizedError: CreateErrorReturnType = createError(401);
export const createForbiddenError: CreateErrorReturnType = createError(403);
export const createNotFoundError: CreateErrorReturnType = createError(404);
export const InternalServerError: AppError = createError(500)(DEFAULT_ERR_MESSAGE);

export default AppError;
