"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePhoneNumber = normalizePhoneNumber;
exports.isValidKenyanPhone = isValidKenyanPhone;
const libphonenumber_js_1 = require("libphonenumber-js");
/**
 * Normalize a phone number to E.164 format (2547XXXXXXXX for Kenya).
 * Accepts various input formats:
 * - 07XXXXXXXX (local)
 * - +2547XXXXXXXX
 * - 2547XXXXXXXX
 */
function normalizePhoneNumber(input) {
    const cleaned = input.replace(/\s+/g, "");
    try {
        const parsed = (0, libphonenumber_js_1.parsePhoneNumber)(cleaned, "KE");
        if (!parsed || !(0, libphonenumber_js_1.isValidPhoneNumber)(cleaned, "KE")) {
            throw new Error("Invalid phone number");
        }
        return parsed.format("E.164");
    }
    catch {
        throw new Error(`Invalid phone number: ${input}`);
    }
}
/**
 * Check if a phone number is valid for Kenya.
 */
function isValidKenyanPhone(phone) {
    try {
        return (0, libphonenumber_js_1.isValidPhoneNumber)(phone, "KE");
    }
    catch {
        return false;
    }
}
