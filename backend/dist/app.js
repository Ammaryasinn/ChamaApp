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
const env_1 = require("./config/env");
const routes_1 = require("./routes");
const error_1 = require("./middleware/error");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({
    origin: env_1.env.FRONTEND_URL,
    credentials: true,
}));
exports.app.use((0, helmet_1.default)());
exports.app.use((0, morgan_1.default)("dev"));
exports.app.use(express_1.default.json({ limit: "1mb" }));
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.get("/", (_req, res) => {
    res.status(200).json({
        name: "Pamoja API",
        description: "Financial infrastructure for Kenyan chamas.",
    });
});
exports.app.use("/api", routes_1.apiRouter);
// Error handler must be last
exports.app.use(error_1.errorHandler);
