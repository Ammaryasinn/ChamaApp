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
    const normalized = (0, phone_1.normalizePhoneNumber)(phoneNumber);
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
    // Send via Africa's Talking API
    const message = `Your Pamoja App verification code is ${otpCode}. It will expire in 5 minutes.`;
    await sms_service_1.SmsService.sendSms(normalized, message);
    // In development, return the code for testing; in production, we still log for debug but don't return.
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEV] OTP for ${normalized}: ${otpCode}`);
        return { code: otpCode };
    }
    // Hide the code in production
    return { code: "sent" };
}
/**
 * Verify OTP and return JWT tokens.
 * Creates user if they don't exist.
 */
async function verifyOtp(phoneNumber, code) {
    const normalized = (0, phone_1.normalizePhoneNumber)(phoneNumber);
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
