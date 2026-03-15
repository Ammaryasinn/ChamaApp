import { Router, Request, Response } from 'express';
import { MpesaService } from '../services/mpesa.service';

const router = Router();

// Middleware to verify Safaricom IPs
const verifySafaricomIp = (req: Request, res: Response, next: Function) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  const ipString = Array.isArray(ip) ? ip[0] : ip;

  // In production, enforce Safaricom IPs
  if (process.env.NODE_ENV === 'production') {
    if (!ipString.includes('196.201.214.200') && !ipString.includes('196.201.214.206')) {
       console.warn(`Blocked callback from non-Safaricom IP: ${ipString}`);
       return res.status(403).json({ error: 'Forbidden' });
    }
  }
  
  next();
};

/**
 * Public Callback endpoint for M-Pesa STK Push
 * POST /api/mpesa/callback
 */
router.post('/callback', verifySafaricomIp, async (req, res) => {
  try {
    await MpesaService.processCallback(req.body);
    // Always acknowledge Safaricom to prevent retries
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    console.error('M-Pesa Callback processing error:', error);
    // Safaricom expects a 200 response anyway, but maybe send success with an internal error state if wanted.
    // However, it's safer to reply 200 so Daraja stops sending.
    res.status(200).json({ ResultCode: 1, ResultDesc: 'Failed internally' });
  }
});

/**
 * Public Callback endpoint for M-Pesa B2C
 * POST /api/mpesa/b2c/result
 */
router.post('/b2c/result', verifySafaricomIp, async (req, res) => {
  try {
    // Implement B2C callback processing here
    console.log('B2C Result:', req.body);
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    console.error('M-Pesa B2C callback error:', error);
    res.status(200).json({ ResultCode: 1, ResultDesc: 'Failed internally' });
  }
});

/**
 * Public endpoint for M-Pesa Transaction Status Timeout
 * POST /api/mpesa/b2c/timeout
 */
router.post('/b2c/timeout', verifySafaricomIp, async (req, res) => {
   // Acknowledge Safaricom timeouts
   res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
});

export default router;
