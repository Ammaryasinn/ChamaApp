import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";

/**
 * Normalize a phone number to E.164 format (2547XXXXXXXX for Kenya).
 * Accepts various input formats:
 * - 07XXXXXXXX (local)
 * - +2547XXXXXXXX
 * - 2547XXXXXXXX
 */
export function normalizePhoneNumber(input: string): string {
  const cleaned = input.replace(/\s+/g, "");

  try {
    const parsed = parsePhoneNumber(cleaned, "KE");
    if (!parsed || !isValidPhoneNumber(cleaned, "KE")) {
      throw new Error("Invalid phone number");
    }
    return parsed.format("E.164");
  } catch {
    throw new Error(`Invalid phone number: ${input}`);
  }
}

/**
 * Check if a phone number is valid for Kenya.
 */
export function isValidKenyanPhone(phone: string): boolean {
  try {
    return isValidPhoneNumber(phone, "KE");
  } catch {
    return false;
  }
}
