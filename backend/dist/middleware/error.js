"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.asyncHandler = asyncHandler;
const error_1 = require("../utils/error");
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
