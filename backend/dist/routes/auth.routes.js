"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const authService = __importStar(require("../services/auth.service"));
const auth_1 = require("../middleware/auth");
const error_1 = require("../middleware/error");
exports.authRouter = (0, express_1.Router)();
// Request OTP
exports.authRouter.post("/request-otp", (0, error_1.asyncHandler)(async (req, res) => {
    const schema = zod_1.z.object({
        phoneNumber: zod_1.z.string().min(1, "Phone number is required"),
    });
    const { phoneNumber } = schema.parse(req.body);
    const result = await authService.requestOtp(phoneNumber);
    res.status(200).json({
        message: "OTP sent successfully",
        // code: result.code (Available in dev payload, but let's hide here to be safe)
        ...(process.env.NODE_ENV !== 'production' ? { code: result.code } : {})
    });
}));
// Verify OTP
exports.authRouter.post("/verify-otp", (0, error_1.asyncHandler)(async (req, res) => {
    const schema = zod_1.z.object({
        phoneNumber: zod_1.z.string().min(1),
        code: zod_1.z.string().length(6),
    });
    const { phoneNumber, code } = schema.parse(req.body);
    const result = await authService.verifyOtp(phoneNumber, code);
    res.status(200).json(result);
}));
// Refresh token
exports.authRouter.post("/refresh-token", (0, error_1.asyncHandler)(async (req, res) => {
    const schema = zod_1.z.object({
        refreshToken: zod_1.z.string().min(1),
    });
    const { refreshToken } = schema.parse(req.body);
    // Verify refresh token and extract payload
    const { verifyToken } = await Promise.resolve().then(() => __importStar(require("../utils/jwt")));
    const payload = verifyToken(refreshToken);
    const result = await authService.refreshAccessToken(payload.userId, payload.phoneNumber);
    res.status(200).json(result);
}));
// Get current user (protected)
exports.authRouter.get("/me", auth_1.authMiddleware, (0, error_1.asyncHandler)(async (req, res) => {
    const user = await authService.getCurrentUser(req.user.userId);
    res.status(200).json(user);
}));
// Update profile (protected)
exports.authRouter.put("/profile", auth_1.authMiddleware, (0, error_1.asyncHandler)(async (req, res) => {
    const schema = zod_1.z.object({
        fullName: zod_1.z.string().optional(),
        nationalId: zod_1.z.string().optional(),
        profilePhotoUrl: zod_1.z.string().url().optional(),
    });
    const data = schema.parse(req.body);
    const user = await authService.updateUserProfile(req.user.userId, data);
    res.status(200).json(user);
}));
