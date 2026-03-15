"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jwt_1 = require("../utils/jwt");
/**
 * Middleware to verify JWT and attach user to request.
 */
function authMiddleware(req, res, next) {
    const token = extractToken(req);
    if (!token) {
        return res.status(401).json({
            error: "Missing authorization token",
            code: "MISSING_TOKEN",
        });
    }
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({
            error: "Invalid or expired token",
            code: "INVALID_TOKEN",
        });
    }
}
/**
 * Extract token from Authorization header.
 */
function extractToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    return authHeader.slice(7);
}
