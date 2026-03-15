/**
 * Generate a random 6-digit OTP code.
 */
export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Calculate OTP expiry (5 minutes from now).
 */
export function getOtpExpiry(): Date {
  return new Date(Date.now() + 5 * 60 * 1000);
}
