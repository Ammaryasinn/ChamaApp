"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("./config/env");
const routes_1 = require("./routes");
const error_1 = require("./middleware/error");
exports.app = (0, express_1.default)();
// General rate limit: 200 requests per 15 minutes per IP
const generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many requests, please try again later.",
        code: "RATE_LIMIT",
    },
});
// Strict limit for auth endpoints: 10 requests per 15 minutes per IP
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many auth attempts, please try again later.",
        code: "RATE_LIMIT",
    },
});
exports.app.use(generalLimiter);
const allowedOrigins = [
    env_1.env.FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:8082",
    "http://localhost:4001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8082",
    "http://127.0.0.1:4001",
];
exports.app.use((0, cors_1.default)({
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin))
            cb(null, true);
        else
            cb(null, false);
    },
    credentials: true,
}));
exports.app.use((0, helmet_1.default)());
exports.app.use((0, morgan_1.default)("dev"));
exports.app.use(express_1.default.json({ limit: "1mb" }));
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.get("/", (_req, res) => {
    res.status(200).json({
        name: "Hazina API",
        description: "Financial infrastructure for Kenyan chamas.",
    });
});
exports.app.use("/api/auth/request-otp", authLimiter);
exports.app.use("/api/auth/verify-otp", authLimiter);
exports.app.use("/api", routes_1.apiRouter);
// Error handler must be last
exports.app.use(error_1.errorHandler);
