"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const health_routes_1 = require("./health.routes");
const auth_routes_1 = require("./auth.routes");
const chama_routes_1 = require("./chama.routes");
const mpesa_routes_1 = __importDefault(require("./mpesa.routes"));
const credit_score_routes_1 = __importDefault(require("./credit-score.routes"));
exports.apiRouter = (0, express_1.Router)();
exports.apiRouter.use("/health", health_routes_1.healthRouter);
exports.apiRouter.use("/auth", auth_routes_1.authRouter);
exports.apiRouter.use("/chamas", chama_routes_1.chamaRouter);
exports.apiRouter.use("/mpesa", mpesa_routes_1.default);
exports.apiRouter.use("/credit-scores", credit_score_routes_1.default);
