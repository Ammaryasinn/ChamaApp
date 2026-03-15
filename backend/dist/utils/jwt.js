"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function generateAccessToken(payload) {
    const signOptions = {
        expiresIn: "7d",
        algorithm: "HS256",
    };
    return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, signOptions);
}
function generateRefreshToken(payload) {
    const signOptions = {
        expiresIn: "30d",
        algorithm: "HS256",
    };
    return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_SECRET, signOptions);
}
function verifyToken(token) {
    const verifyOptions = {
        algorithms: ["HS256"],
    };
    return jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET, verifyOptions);
}
