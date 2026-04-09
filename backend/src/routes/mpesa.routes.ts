import { Router, Request, Response } from 'express';
import { MpesaService } from '../services/mpesa.service';
import { authMiddleware } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

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
 * Initiate STK Push
 * POST /api/mpesa/stkpush
 */
router.post(
  '/stkpush',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      chamaId: z.string().uuid(),
      amount: z.number().positive(),
      phoneNumber: z.string().regex(/^254[17]\d{8}$/, "Must be in format 2547XXXXXXXX or 2541XXXXXXXX"),
      referenceId: z.string().uuid(),
      referenceType: z.enum(["contribution", "penalty", "loan_repayment"]),
      description: z.string().min(1),
    });

    const data = schema.parse(req.body);

    const result = await MpesaService.sendStkPush({
      chamaId: data.chamaId,
      userId: req.user!.userId,
      phoneNumber: data.phoneNumber,
      amount: data.amount,
      referenceId: data.referenceId,
      referenceType: data.referenceType,
      description: data.description,
    });

    if (data.referenceType === "contribution") {
      await prisma.contribution.updateMany({
        where: { id: data.referenceId, status: "pending" },
        data: { status: "stk_sent", stkSentAt: new Date() },
      });
    }

    res.status(200).json(result);
  })
);

/**
 * Check Transaction Status
 * GET /api/mpesa/status/:checkoutRequestId
 */
router.get(
  '/status/:checkoutRequestId',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { checkoutRequestId } = req.params;
    const transaction = await prisma.transaction.findFirst({
      where: { mpesaCheckoutRequestId: checkoutRequestId as string, userId: req.user!.userId },
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json(transaction);
  })
);

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
 * B2C Result callback — Safaricom notifies us when a payout succeeds or fails.
 * POST /api/mpesa/b2c/result
 */
router.post('/b2c/result', verifySafaricomIp, async (req, res) => {
  try {
    await MpesaService.processB2CResult(req.body);
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    console.error('M-Pesa B2C result processing error:', error);
    res.status(200).json({ ResultCode: 1, ResultDesc: 'Failed internally' });
  }
});

/**
 * B2C Timeout callback — Safaricom could not reach our ResultURL in time.
 * POST /api/mpesa/b2c/timeout
 */
router.post('/b2c/timeout', verifySafaricomIp, async (req, res) => {
  try {
    await MpesaService.processB2CTimeout(req.body);
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Acknowledged' });
  } catch (error) {
    console.error('M-Pesa B2C timeout processing error:', error);
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Acknowledged' }); // always 200 to stop retries
  }
});

export default router;
