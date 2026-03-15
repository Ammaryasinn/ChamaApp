"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const axios_1 = __importDefault(require("axios"));
const AT_API_KEY = process.env.AT_API_KEY || 'dummy';
const AT_USERNAME = process.env.AT_USERNAME || 'sandbox';
const AT_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://api.africastalking.com/version1/messaging'
    : 'https://api.sandbox.africastalking.com/version1/messaging';
class SmsService {
    /**
     * Send SMS via Africa's Talking API
     */
    static async sendSms(to, message) {
        if (process.env.NODE_ENV === 'test') {
            console.log(`[Mock SMS] To: ${to} | Message: ${message}`);
            return;
        }
        try {
            const params = new URLSearchParams();
            params.append('username', AT_USERNAME);
            params.append('to', to);
            params.append('message', message);
            const response = await axios_1.default.post(AT_BASE_URL, params.toString(), {
                headers: {
                    apiKey: AT_API_KEY,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            console.log(`SMS sent successfully to ${to}`);
            return response.data;
        }
        catch (error) {
            console.error('Failed to send SMS:', error.response?.data || error.message);
            // Don't throw for SMS failures to avoid breaking critical flows
        }
    }
}
exports.SmsService = SmsService;
