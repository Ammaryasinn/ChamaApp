import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/error";

function isPrismaError(err: Error): boolean {
  return err.name === "PrismaClientKnownRequestError" ||
    err.name === "PrismaClientValidationError" ||
    err.name === "PrismaClientInitializationError";
}

/**
 * Global error handler middleware.
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  // Zod validation errors (e.g. invalid request body)
  if (err instanceof ZodError) {
    const zodErr = err as any;
    const first = zodErr.errors[0];
    const message = first ? `${first.path.join(".")}: ${first.message}` : "Validation failed";
    return res.status(400).json({
      error: message,
      code: "VALIDATION_ERROR",
    });
  }

  // Prisma / database errors (e.g. connection failed, table missing)
  if (isPrismaError(err)) {
    const isConnection = err.message.includes("connect") || err.message.includes("Connection");
    return res.status(isConnection ? 503 : 400).json({
      error: isConnection
        ? "Database unavailable. Is it running? Check DATABASE_URL and try again."
        : err.message,
      code: "DATABASE_ERROR",
    });
  }

  // Unexpected error
  res.status(500).json({
    error: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
  });
}

/**
 * Async route wrapper to catch errors.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
