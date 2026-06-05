export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly isOperational = true,
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(404, message);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(400, message);
    this.name = "ValidationError";
  }
}

export class LlmServiceError extends AppError {
  constructor(
    message = "We're having trouble generating a response. Please try again shortly.",
  ) {
    super(503, message);
    this.name = "LlmServiceError";
  }
}
