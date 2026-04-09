import { prisma } from "../lib/prisma";
import { normalizePhoneNumber } from "../utils/phone";
import { generateOtpCode, getOtpExpiry } from "../utils/otp";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { Errors } from "../utils/error";
import { SmsService } from "./sms.service";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    phoneNumber: string;
    fullName: string;
    isVerified: boolean;
  };
}

/**
 * Request OTP for a phone number.
 * In production, this would call Africa's Talking API.
 * For testing, OTP is returned in the response (never do this in production).
 */
export async function requestOtp(
  phoneNumber: string,
): Promise<{ code: string }> {
  let normalized: string;
  try {
    normalized = normalizePhoneNumber(phoneNumber);
  } catch {
    throw Errors.INVALID_PHONE();
  }

  const otpCode = generateOtpCode();
  const expiresAt = getOtpExpiry();

  await prisma.otpCode.create({
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
    await SmsService.sendSms(normalized, message);
  } catch (smsErr: any) {
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
export async function verifyOtp(
  phoneNumber: string,
  code: string,
): Promise<AuthResponse> {
  let normalized: string;
  try {
    normalized = normalizePhoneNumber(phoneNumber);
  } catch {
    throw Errors.INVALID_PHONE();
  }

  // Find valid OTP
  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      phoneNumber: normalized,
      code,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!otpRecord) {
    throw Errors.INVALID_OTP();
  }

  // Mark OTP as used
  await prisma.otpCode.update({
    where: { id: otpRecord.id },
    data: { used: true },
  });

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { phoneNumber: normalized },
  });

  if (!user) {
    // New user: create with placeholder name
    user = await prisma.user.create({
      data: {
        phoneNumber: normalized,
        fullName: "User", // Will be updated in profile endpoint
        isVerified: false,
      },
    });
  }

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user.id,
    phoneNumber: user.phoneNumber,
  });

  const refreshToken = generateRefreshToken({
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
export async function refreshAccessToken(
  userId: string,
  phoneNumber: string,
): Promise<{ accessToken: string }> {
  const accessToken = generateAccessToken({
    userId,
    phoneNumber,
  });

  return { accessToken };
}

/**
 * Get current user profile.
 */
export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw Errors.USER_NOT_FOUND();
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
export async function updateUserProfile(
  userId: string,
  data: {
    fullName?: string;
    nationalId?: string;
    profilePhotoUrl?: string;
  },
) {
  const user = await prisma.user.update({
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
