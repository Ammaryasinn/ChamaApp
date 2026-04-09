"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.asyncHandler = asyncHandler;
const zod_1 = require("zod");
const error_1 = require("../utils/error");
function isPrismaError(err) {
    return err.name === "PrismaClientKnownRequestError" ||
        err.name === "PrismaClientValidationError" ||
        err.name === "PrismaClientInitializationError";
}
/**
 * Global error handler middleware.
 */
function errorHandler(err, req, res, next) {
    console.error(err);
    if (err instanceof error_1.AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
            code: err.code,
        });
    }
    // Zod validation errors (e.g. invalid request body)
    if (err instanceof zod_1.ZodError) {
        const zodErr = err;
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
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
