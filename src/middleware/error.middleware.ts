import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/errors";

interface ErrorResponse {
  error: string;
  details?: unknown;
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    const body: ErrorResponse = { error: err.message };
    res.status(err.statusCode).json(body);
    return;
  }

  if (err instanceof ZodError) {
    const body: ErrorResponse = {
      error: "Validation failed",
      details: err.flatten().fieldErrors,
    };
    res.status(400).json(body);
    return;
  }

  console.error("Unhandled error:", err);

  const body: ErrorResponse = {
    error: "An unexpected error occurred. Please try again later.",
  };
  res.status(500).json(body);
}
