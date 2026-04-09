"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mpesa_service_1 = require("../services/mpesa.service");
const auth_1 = require("../middleware/auth");
const error_1 = require("../middleware/error");
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const router = (0, express_1.Router)();
// Middleware to verify Safaricom IPs
const verifySafaricomIp = (req, res, next) => {
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
router.post('/stkpush', auth_1.authMiddleware, (0, error_1.asyncHandler)(async (req, res) => {
    const schema = zod_1.z.object({
        chamaId: zod_1.z.string().uuid(),
        amount: zod_1.z.number().positive(),
        phoneNumber: zod_1.z.string().regex(/^254[17]\d{8}$/, "Must be in format 2547XXXXXXXX or 2541XXXXXXXX"),
        referenceId: zod_1.z.string().uuid(),
        referenceType: zod_1.z.enum(["contribution", "penalty", "loan_repayment"]),
        description: zod_1.z.string().min(1),
    });
    const data = schema.parse(req.body);
    const result = await mpesa_service_1.MpesaService.sendStkPush({
        chamaId: data.chamaId,
        userId: req.user.userId,
        phoneNumber: data.phoneNumber,
        amount: data.amount,
        referenceId: data.referenceId,
        referenceType: data.referenceType,
        description: data.description,
    });
    if (data.referenceType === "contribution") {
        await prisma_1.prisma.contribution.updateMany({
            where: { id: data.referenceId, status: "pending" },
            data: { status: "stk_sent", stkSentAt: new Date() },
        });
    }
    res.status(200).json(result);
}));
/**
 * Check Transaction Status
 * GET /api/mpesa/status/:checkoutRequestId
 */
router.get('/status/:checkoutRequestId', auth_1.authMiddleware, (0, error_1.asyncHandler)(async (req, res) => {
    const { checkoutRequestId } = req.params;
    const transaction = await prisma_1.prisma.transaction.findFirst({
        where: { mpesaCheckoutRequestId: checkoutRequestId, userId: req.user.userId },
    });
    if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json(transaction);
}));
/**
 * Public Callback endpoint for M-Pesa STK Push
 * POST /api/mpesa/callback
 */
router.post('/callback', verifySafaricomIp, async (req, res) => {
    try {
        await mpesa_service_1.MpesaService.processCallback(req.body);
        // Always acknowledge Safaricom to prevent retries
        res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
    }
    catch (error) {
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
        await mpesa_service_1.MpesaService.processB2CResult(req.body);
        res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
    }
    catch (error) {
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
        await mpesa_service_1.MpesaService.processB2CTimeout(req.body);
        res.status(200).json({ ResultCode: 0, ResultDesc: 'Acknowledged' });
    }
    catch (error) {
        console.error('M-Pesa B2C timeout processing error:', error);
        res.status(200).json({ ResultCode: 0, ResultDesc: 'Acknowledged' }); // always 200 to stop retries
    }
});
exports.default = router;
