export const BadRequestError = (message: string) => ({
  statusCode: 400,
  message: message,
});

export const UnauthorizedError = (message: string) => ({
  statusCode: 401,
  message: message,
});

export const ForbiddenError = (message: string) => ({
  statusCode: 403,
  message: message,
});

export const NotFoundError = (message: string) => ({
  statusCode: 404,
  message: message,
});

export const ConflictError = (message: string) => ({
  statusCode: 409,
  message: message,
});

export const InternalServerError = (message: string) => ({
  statusCode: 500,
  message: message,
});

export const NotImplementedError = (message: string) => ({
  statusCode: 501,
  message: message,
});
