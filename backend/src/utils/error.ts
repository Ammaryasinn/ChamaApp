export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function createError(
  statusCode: number,
  message: string,
  code?: string,
): AppError {
  return new AppError(statusCode, message, code);
}

export const Errors = {
  INVALID_PHONE: () =>
    createError(400, "Invalid phone number format", "INVALID_PHONE"),
  USER_NOT_FOUND: () =>
    createError(404, "User not found", "USER_NOT_FOUND"),
  INVALID_OTP: () => createError(400, "Invalid or expired OTP", "INVALID_OTP"),
  OTP_NOT_SENT: () =>
    createError(400, "OTP not requested yet", "OTP_NOT_SENT"),
  CHAMA_NOT_FOUND: () =>
    createError(404, "Chama not found", "CHAMA_NOT_FOUND"),
  CHAMA_MEMBER_NOT_FOUND: () =>
    createError(404, "Chama member not found", "CHAMA_MEMBER_NOT_FOUND"),
  UNAUTHORIZED: () =>
    createError(401, "Unauthorized", "UNAUTHORIZED"),
  FORBIDDEN: () =>
    createError(403, "Forbidden", "FORBIDDEN"),
  INVALID_INPUT: (details: string) =>
    createError(400, `Invalid input: ${details}`, "INVALID_INPUT"),
  DUPLICATE_MEMBER: () =>
    createError(409, "User is already a member of this chama", "DUPLICATE_MEMBER"),
  RATE_LIMIT: () =>
    createError(429, "Too many requests. Please try again later.", "RATE_LIMIT"),
};
