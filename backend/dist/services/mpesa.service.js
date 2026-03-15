"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MpesaService = void 0;
const axios_1 = __importDefault(require("axios"));
const prisma_1 = require("../lib/prisma");
const uuid_1 = require("uuid");
const dayjs_1 = __importDefault(require("dayjs"));
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE;
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL;
const MPESA_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';
class MpesaService {
    /**
     * Trigger STK Push (Lipa na M-Pesa Online)
     */
    static async sendStkPush({ chamaId, userId, phoneNumber, amount, referenceId, referenceType, description, }) {
        // 1. Generate idempotency_key
        const idempotencyKey = `${(0, uuid_1.v4)()}-${Date.now()}`;
        // 2. Check if transaction with this reference is already pending
        const existingPending = await prisma_1.prisma.transaction.findFirst({
            where: {
                referenceId,
                referenceType,
                status: 'pending'
            }
        });
        if (existingPending) {
            throw new Error('A transaction is already pending for this reference.');
        }
        // 3. Create Transaction in DB
        const transaction = await prisma_1.prisma.transaction.create({
            data: {
                chamaId,
                userId,
                transactionType: referenceType,
                amount,
                direction: 'inbound',
                status: 'pending',
                idempotencyKey,
                referenceId,
                referenceType,
                description,
                mpesaPhoneNumber: phoneNumber,
            },
        });
        // 4. Send STK Push
        const token = await this.getAuthToken();
        const timestamp = (0, dayjs_1.default)().format('YYYYMMDDHHmmss');
        const password = this.getPassword(timestamp);
        try {
            const response = await axios_1.default.post(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
                BusinessShortCode: MPESA_SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: Math.ceil(amount),
                PartyA: phoneNumber,
                PartyB: MPESA_SHORTCODE,
                PhoneNumber: phoneNumber,
                CallBackURL: `${MPESA_CALLBACK_URL}/api/mpesa/callback`,
                AccountReference: referenceType.substring(0, 12).toUpperCase(),
                TransactionDesc: description.substring(0, 20),
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Update transaction with checkout request ID
            await prisma_1.prisma.transaction.update({
                where: { id: transaction.id },
                data: {
                    mpesaCheckoutRequestId: response.data.CheckoutRequestID,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('STK Push Error:', error.response?.data || error.message);
            await prisma_1.prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: 'failed' },
            });
            throw new Error('Failed to initiate STK push');
        }
    }
    /**
     * Process Safaricom STK Callback
     */
    static async processCallback(callbackData) {
        const stkCallback = callbackData.Body.stkCallback;
        const checkoutRequestId = stkCallback.CheckoutRequestID;
        const resultCode = stkCallback.ResultCode;
        const resultDesc = stkCallback.ResultDesc;
        // Find transaction
        const transaction = await prisma_1.prisma.transaction.findFirst({
            where: { mpesaCheckoutRequestId: checkoutRequestId },
        });
        if (!transaction) {
            console.warn(`No transaction found for CheckoutRequestID: ${checkoutRequestId}`);
            return;
        }
        if (transaction.status !== 'pending') {
            console.warn(`Transaction ${transaction.id} already processed`);
            return;
        }
        if (resultCode !== 0) {
            // Failed
            await prisma_1.prisma.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: 'failed',
                    mpesaResultCode: resultCode,
                    mpesaResultDesc: resultDesc,
                },
            });
            // Update reference if needed
            if (transaction.referenceType === 'contribution' && transaction.referenceId) {
                await prisma_1.prisma.contribution.updateMany({
                    where: { id: transaction.referenceId, status: 'stk_sent' },
                    data: { status: 'pending' } // revert
                });
            }
            return;
        }
        // Success
        const metaMap = stkCallback.CallbackMetadata.Item.reduce((acc, item) => {
            acc[item.Name] = item.Value;
            return acc;
        }, {});
        const amount = metaMap.Amount;
        const receiptNumber = metaMap.MpesaReceiptNumber;
        const phoneNumber = metaMap.PhoneNumber.toString();
        // Begin DB Transaction for financial integrity
        await prisma_1.prisma.$transaction(async (tx) => {
            // 1. Mark transaction completed
            await tx.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: 'completed',
                    mpesaReceiptNumber: receiptNumber,
                    mpesaPhoneNumber: phoneNumber,
                    mpesaResultCode: resultCode,
                    mpesaResultDesc: resultDesc,
                },
            });
            // 2. Handle Contribution Payment
            if (transaction.referenceType === 'contribution' && transaction.referenceId) {
                const contribution = await tx.contribution.findUnique({
                    where: { id: transaction.referenceId },
                    include: {
                        cycle: true,
                        chamaMember: { include: { chama: true } }
                    }
                });
                if (contribution) {
                    // Update contribution
                    await tx.contribution.update({
                        where: { id: contribution.id },
                        data: {
                            status: 'paid',
                            paidAmount: amount,
                            paidAt: new Date(),
                        },
                    });
                    // Update member lifetime contribution
                    await tx.chamaMember.update({
                        where: { id: contribution.chamaMemberId },
                        data: {
                            totalContributed: {
                                increment: amount,
                            },
                        },
                    });
                    // Hybrid split logic
                    const chama = contribution.chamaMember.chama;
                    if (chama.chamaType === 'hybrid') {
                        await tx.chama.update({
                            where: { id: chama.id },
                            data: {
                                mgrPotBalance: { increment: (Number(amount) * chama.mgrPercentage) / 100 },
                                investmentFundBalance: { increment: (Number(amount) * chama.investmentPercentage) / 100 },
                                welfarePotBalance: { increment: (Number(amount) * chama.welfarePercentage) / 100 }
                            }
                        });
                    }
                    else {
                        await tx.chama.update({
                            where: { id: chama.id },
                            data: { mgrPotBalance: { increment: amount } }
                        });
                    }
                    // Cycle collected amount
                    await tx.contributionCycle.update({
                        where: { id: contribution.cycleId },
                        data: { collectedAmount: { increment: amount } }
                    });
                    // Write Audit Log
                    await tx.auditLog.create({
                        where: { id: (0, uuid_1.v4)() },
                        data: {
                            chamaId: transaction.chamaId,
                            actorId: transaction.userId, // Can be null for system callback
                            entityType: 'contribution',
                            entityId: contribution.id,
                            action: 'paid',
                            oldValue: { status: contribution.status, paidAmount: contribution.paidAmount },
                            newValue: { status: 'paid', paidAmount: amount },
                        }
                    });
                }
            }
            // Add logic for 'loan_repayment' and 'penalty' here later
        });
    }
    /**
     * Reconcile status of pending transactions > 5 mins old
     */
    static async reconcileTransactions() {
        const fiveMinutesAgo = (0, dayjs_1.default)().subtract(5, 'minutes').toDate();
        const thirtyMinutesAgo = (0, dayjs_1.default)().subtract(30, 'minutes').toDate();
        const pendingTransactions = await prisma_1.prisma.transaction.findMany({
            where: {
                status: 'pending',
                mpesaCheckoutRequestId: { not: null },
                createdAt: { lte: fiveMinutesAgo },
            },
        });
        for (const tx of pendingTransactions) {
            // If older than 30 mins, mark it as failed directly (M-Pesa expires STK push after 25s typically)
            if (tx.createdAt <= thirtyMinutesAgo) {
                await prisma_1.prisma.transaction.update({
                    where: { id: tx.id },
                    data: {
                        status: 'failed',
                        mpesaResultDesc: 'Transaction timed out after 30 minutes',
                    }
                });
                if (tx.referenceType === 'contribution' && tx.referenceId) {
                    await prisma_1.prisma.contribution.updateMany({
                        where: { id: tx.referenceId, status: 'stk_sent' },
                        data: { status: 'pending' }
                    });
                }
                continue;
            }
            // Optionally call M-Pesa transaction status API here if B2C or other, 
            // but for STK push, Daraja provides a separate query endpoint:
            // /mpesa/stkpushquery/v1/query
            try {
                const token = await this.getAuthToken();
                const timestamp = (0, dayjs_1.default)().format('YYYYMMDDHHmmss');
                const password = this.getPassword(timestamp);
                const response = await axios_1.default.post(`${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`, {
                    BusinessShortCode: MPESA_SHORTCODE,
                    Password: password,
                    Timestamp: timestamp,
                    CheckoutRequestID: tx.mpesaCheckoutRequestId
                }, { headers: { Authorization: `Bearer ${token}` } });
                const { ResultCode, ResultDesc } = response.data;
                // Simulate callback processing structure if finished
                if (ResultCode !== undefined) {
                    // In query API: ResultCode='0' is success.
                    // But unfortunately, Query API doesn't return the Amount or ReceiptNumber directly for success 
                    // in some forms, so we might still rely on callback.
                    // If ResultCode != 0, it definitively failed or was cancelled.
                    if (ResultCode !== '0') {
                        await prisma_1.prisma.transaction.update({
                            where: { id: tx.id },
                            data: { status: 'failed', mpesaResultDesc: ResultDesc }
                        });
                        if (tx.referenceType === 'contribution' && tx.referenceId) {
                            await prisma_1.prisma.contribution.updateMany({
                                where: { id: tx.referenceId, status: 'stk_sent' },
                                data: { status: 'pending' }
                            });
                        }
                    }
                }
            }
            catch (err) {
                // If error is 500 from Daraja, usually means "The transaction is being processed"
                // We just skip and wait.
            }
        }
    }
}
exports.MpesaService = MpesaService;
_a = MpesaService;
/**
 * Encodes credentials for M-Pesa authentication
 */
MpesaService.getAuthToken = async () => {
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
    try {
        const response = await axios_1.default.get(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        return response.data.access_token;
    }
    catch (error) {
        console.error('M-Pesa Auth Error:', error.response?.data || error.message);
        throw new Error('Failed to authenticate with M-Pesa');
    }
};
/**
 * Generates physical password for STK push
 */
MpesaService.getPassword = (timestamp) => {
    return Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');
};
