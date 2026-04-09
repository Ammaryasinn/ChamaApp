"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestOtp = requestOtp;
exports.verifyOtp = verifyOtp;
exports.refreshAccessToken = refreshAccessToken;
exports.getCurrentUser = getCurrentUser;
exports.updateUserProfile = updateUserProfile;
const prisma_1 = require("../lib/prisma");
const phone_1 = require("../utils/phone");
const otp_1 = require("../utils/otp");
const jwt_1 = require("../utils/jwt");
const error_1 = require("../utils/error");
const sms_service_1 = require("./sms.service");
/**
 * Request OTP for a phone number.
 * In production, this would call Africa's Talking API.
 * For testing, OTP is returned in the response (never do this in production).
 */
async function requestOtp(phoneNumber) {
    let normalized;
    try {
        normalized = (0, phone_1.normalizePhoneNumber)(phoneNumber);
    }
    catch {
        throw error_1.Errors.INVALID_PHONE();
    }
    const otpCode = (0, otp_1.generateOtpCode)();
    const expiresAt = (0, otp_1.getOtpExpiry)();
    await prisma_1.prisma.otpCode.create({
        data: {
            phoneNumber: normalized,
            code: otpCode,
            expiresAt,
            used: false,
        },
    });
    // Always log in dev BEFORE sending SMS so it's visible even if AT fails
    if (process.env.NODE_ENV !== "production") {
        console.log(`\n========================================`);
        console.log(`[DEV] OTP for ${normalized}: ${otpCode}`);
        console.log(`========================================\n`);
    }
    // Send via Africa's Talking (best-effort — don't fail the request if SMS fails)
    try {
        const message = `Your Hazina verification code is ${otpCode}. It will expire in 5 minutes.`;
        await sms_service_1.SmsService.sendSms(normalized, message);
    }
    catch (smsErr) {
        console.warn(`[SMS] Failed to send OTP SMS: ${smsErr?.message ?? smsErr}`);
    }
    if (process.env.NODE_ENV !== "production") {
        return { code: otpCode };
    }
    return { code: "sent" };
}
/**
 * Verify OTP and return JWT tokens.
 * Creates user if they don't exist.
 */
async function verifyOtp(phoneNumber, code) {
    let normalized;
    try {
        normalized = (0, phone_1.normalizePhoneNumber)(phoneNumber);
    }
    catch {
        throw error_1.Errors.INVALID_PHONE();
    }
    // Find valid OTP
    const otpRecord = await prisma_1.prisma.otpCode.findFirst({
        where: {
            phoneNumber: normalized,
            code,
            used: false,
            expiresAt: { gt: new Date() },
        },
    });
    if (!otpRecord) {
        throw error_1.Errors.INVALID_OTP();
    }
    // Mark OTP as used
    await prisma_1.prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: { used: true },
    });
    // Find or create user
    let user = await prisma_1.prisma.user.findUnique({
        where: { phoneNumber: normalized },
    });
    if (!user) {
        // New user: create with placeholder name
        user = await prisma_1.prisma.user.create({
            data: {
                phoneNumber: normalized,
                fullName: "User", // Will be updated in profile endpoint
                isVerified: false,
            },
        });
    }
    // Generate tokens
    const accessToken = (0, jwt_1.generateAccessToken)({
        userId: user.id,
        phoneNumber: user.phoneNumber,
    });
    const refreshToken = (0, jwt_1.generateRefreshToken)({
        userId: user.id,
        phoneNumber: user.phoneNumber,
    });
    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            phoneNumber: user.phoneNumber,
            fullName: user.fullName,
            isVerified: user.isVerified,
        },
    };
}
/**
 * Refresh access token using refresh token.
 */
async function refreshAccessToken(userId, phoneNumber) {
    const accessToken = (0, jwt_1.generateAccessToken)({
        userId,
        phoneNumber,
    });
    return { accessToken };
}
/**
 * Get current user profile.
 */
async function getCurrentUser(userId) {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw error_1.Errors.USER_NOT_FOUND();
    }
    return {
        id: user.id,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        nationalId: user.nationalId,
        profilePhotoUrl: user.profilePhotoUrl,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
    };
}
/**
 * Update user profile.
 */
async function updateUserProfile(userId, data) {
    const user = await prisma_1.prisma.user.update({
        where: { id: userId },
        data,
    });
    return {
        id: user.id,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        nationalId: user.nationalId,
        profilePhotoUrl: user.profilePhotoUrl,
        isVerified: user.isVerified,
    };
}
