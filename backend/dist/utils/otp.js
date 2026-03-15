"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtpCode = generateOtpCode;
exports.getOtpExpiry = getOtpExpiry;
/**
 * Generate a random 6-digit OTP code.
 */
function generateOtpCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
/**
 * Calculate OTP expiry (5 minutes from now).
 */
function getOtpExpiry() {
    return new Date(Date.now() + 5 * 60 * 1000);
}
