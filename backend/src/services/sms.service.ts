import axios from 'axios';
import { env } from '../config/env';

const AT_API_KEY = process.env.AT_API_KEY || 'dummy';
const AT_USERNAME = process.env.AT_USERNAME || 'sandbox';
const AT_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.africastalking.com/version1/messaging' 
  : 'https://api.sandbox.africastalking.com/version1/messaging';

export class SmsService {
  /**
   * Send SMS via Africa's Talking API
   */
  public static async sendSms(to: string, message: string) {
    if (process.env.NODE_ENV === 'test') {
      console.log(`[Mock SMS] To: ${to} | Message: ${message}`);
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append('username', AT_USERNAME);
      params.append('to', to);
      params.append('message', message);

      const response = await axios.post(AT_BASE_URL, params.toString(), {
        headers: {
          apiKey: AT_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log(`SMS sent successfully to ${to}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to send SMS:', error.response?.data || error.message);
      // Don't throw for SMS failures to avoid breaking critical flows
    }
  }
}
