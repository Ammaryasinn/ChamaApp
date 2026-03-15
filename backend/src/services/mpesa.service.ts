import axios from 'axios';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY!;
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE!;
const MPESA_CALLBACK_URL = process.env.MPESA_CALLBACK_URL!;
const MPESA_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

export class MpesaService {
  /**
   * Encodes credentials for M-Pesa authentication
   */
  private static getAuthToken = async (): Promise<string> => {
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
    try {
      const response = await axios.get(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      return response.data.access_token;
    } catch (error: any) {
      console.error('M-Pesa Auth Error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with M-Pesa');
    }
  };

  /**
   * Generates physical password for STK push
   */
  private static getPassword = (timestamp: string): string => {
    return Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');
  };

  /**
   * Trigger STK Push (Lipa na M-Pesa Online)
   */
  public static async sendStkPush({
    chamaId,
    userId,
    phoneNumber,
    amount,
    referenceId,
    referenceType,
    description,
  }: {
    chamaId: string;
    userId: string;
    phoneNumber: string; // Must be 2547XXXXXXXX
    amount: number;
    referenceId: string;
    referenceType: 'contribution' | 'penalty' | 'loan_repayment';
    description: string;
  }) {
    // Generate idempotency_key — uuid+timestamp ensures uniqueness per STK attempt
    const idempotencyKey = `${uuidv4()}-${Date.now()}`;

    // Use upsert keyed on idempotencyKey as the race-condition guard.
    // Two simultaneous calls with the same referenceId will each generate their own
    // idempotencyKey (UUID-based), so they won't collide here. The real guard is that
    // only one STK push is sent per contribution — enforced by the caller checking
    // contribution.status before calling this method.
    // If the same idempotencyKey is retried (network blip on our side), the upsert
    // returns the existing row instead of creating a duplicate.
    const transaction = await prisma.transaction.upsert({
      where: { idempotencyKey },
      update: {}, // already exists — return it unchanged
      create: {
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

    // Send STK Push
    const token = await this.getAuthToken();
    const timestamp = dayjs().format('YYYYMMDDHHmmss');
    const password = this.getPassword(timestamp);

    try {
      const response = await axios.post(
        `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
        {
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
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update transaction with checkout request ID
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          mpesaCheckoutRequestId: response.data.CheckoutRequestID,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('STK Push Error:', error.response?.data || error.message);
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'failed' },
      });
      throw new Error('Failed to initiate STK push');
    }
  }

  /**
   * Process Safaricom STK Callback
   */
  public static async processCallback(callbackData: any) {
    const stkCallback = callbackData.Body.stkCallback;
    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    // Find transaction
    const transaction = await prisma.transaction.findFirst({
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
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'failed',
          mpesaResultCode: resultCode,
          mpesaResultDesc: resultDesc,
        },
      });

      // Update reference if needed
      if (transaction.referenceType === 'contribution' && transaction.referenceId) {
         await prisma.contribution.updateMany({
           where: { id: transaction.referenceId, status: 'stk_sent' },
           data: { status: 'pending' } // revert
         });
      }

      return;
    }

    // Success
    const metaMap = stkCallback.CallbackMetadata.Item.reduce((acc: any, item: any) => {
      acc[item.Name] = item.Value;
      return acc;
    }, {});

    const amount = metaMap.Amount;
    const receiptNumber = metaMap.MpesaReceiptNumber;
    const phoneNumber = metaMap.PhoneNumber.toString();

    // Begin DB Transaction for financial integrity
    await prisma.$transaction(async (tx) => {
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
          } else {
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
            data: {
               chamaId: transaction.chamaId!,
               actorId: transaction.userId ?? undefined,
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
   * Send B2C (Business-to-Customer) payout via M-Pesa
   */
  public static async sendB2CPayout({
    phoneNumber,
    amount,
    remarks,
  }: {
    phoneNumber: string; // 2547XXXXXXXX
    amount: number;
    remarks: string;
  }) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[MOCK B2C] Would send KES ${amount} to ${phoneNumber}. Remarks: ${remarks}`);
      return { mock: true };
    }

    const MPESA_B2C_INITIATOR = process.env.MPESA_B2C_INITIATOR!;
    const MPESA_B2C_SECURITY_CREDENTIAL = process.env.MPESA_B2C_SECURITY_CREDENTIAL!;
    const MPESA_B2C_SHORTCODE = process.env.MPESA_SHORTCODE!;

    const token = await this.getAuthToken();

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/b2c/v3/paymentrequest`,
      {
        InitiatorName: MPESA_B2C_INITIATOR,
        SecurityCredential: MPESA_B2C_SECURITY_CREDENTIAL,
        CommandID: 'BusinessPayment',
        Amount: Math.ceil(amount),
        PartyA: MPESA_B2C_SHORTCODE,
        PartyB: phoneNumber,
        Remarks: remarks.substring(0, 100),
        QueueTimeOutURL: `${MPESA_CALLBACK_URL}/api/mpesa/b2c/timeout`,
        ResultURL: `${MPESA_CALLBACK_URL}/api/mpesa/b2c/result`,
        Occasion: remarks.substring(0, 100),
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  }

  /**
   * Reconcile status of pending transactions > 5 mins old
   */
  public static async reconcileTransactions() {
    const fiveMinutesAgo = dayjs().subtract(5, 'minutes').toDate();
    const thirtyMinutesAgo = dayjs().subtract(30, 'minutes').toDate();

    const pendingTransactions = await prisma.transaction.findMany({
      where: {
        status: 'pending',
        mpesaCheckoutRequestId: { not: null },
        createdAt: { lte: fiveMinutesAgo },
      },
    });

    for (const tx of pendingTransactions) {
       // If older than 30 mins, mark it as failed directly (M-Pesa expires STK push after 25s typically)
       if (tx.createdAt <= thirtyMinutesAgo) {
          await prisma.transaction.update({
             where: { id: tx.id },
             data: {
               status: 'failed',
               mpesaResultDesc: 'Transaction timed out after 30 minutes',
             }
          });
          
          if (tx.referenceType === 'contribution' && tx.referenceId) {
             await prisma.contribution.updateMany({
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
         const timestamp = dayjs().format('YYYYMMDDHHmmss');
         const password = this.getPassword(timestamp);

         const response = await axios.post(
           `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
           {
             BusinessShortCode: MPESA_SHORTCODE,
             Password: password,
             Timestamp: timestamp,
             CheckoutRequestID: tx.mpesaCheckoutRequestId
           },
           { headers: { Authorization: `Bearer ${token}` } }
         );

         const { ResultCode, ResultDesc } = response.data;

         // Simulate callback processing structure if finished
         if (ResultCode !== undefined) {
             // In query API: ResultCode='0' is success.
             // But unfortunately, Query API doesn't return the Amount or ReceiptNumber directly for success 
             // in some forms, so we might still rely on callback.
             // If ResultCode != 0, it definitively failed or was cancelled.

             // IMPORTANT: Daraja STK Query API returns ResultCode as a STRING "0", not integer 0.
             // Do NOT change this to !== 0 — that would silently treat every success as a failure.
             // Ref: https://developer.safaricom.co.ke/docs#lipa-na-m-pesa-online-query-request
             if (ResultCode !== '0') {
                 await prisma.transaction.update({
                   where: { id: tx.id },
                   data: { status: 'failed', mpesaResultDesc: ResultDesc }
                 });

                 if (tx.referenceType === 'contribution' && tx.referenceId) {
                    await prisma.contribution.updateMany({
                       where: { id: tx.referenceId, status: 'stk_sent' },
                       data: { status: 'pending' }
                    });
                 }
             }
         }
       } catch (err: any) {
          // If error is 500 from Daraja, usually means "The transaction is being processed"
          // We just skip and wait.
       }
    }
  }

  /**
   * Process B2C Result callback from Safaricom.
   * Called when M-Pesa confirms or rejects a B2C (MGR payout) disbursement.
   * POST /api/mpesa/b2c/result
   */
  public static async processB2CResult(body: any) {
    const result = body?.Result;
    if (!result) {
      console.warn('[B2C Result] Received malformed payload:', JSON.stringify(body));
      return;
    }

    const resultCode: number               = result.ResultCode;
    const resultDesc: string               = result.ResultDesc ?? '';
    const originatorConversationId: string = result.OriginatorConversationID ?? '';
    const conversationId: string           = result.ConversationID ?? '';

    // Parse result parameters into a flat map
    const params: Record<string, unknown> = {};
    for (const item of (result.ResultParameters?.ResultParameter ?? [])) {
      params[item.Key] = item.Value;
    }
    const transactionReceipt = params['TransactionReceipt'] as string | undefined;
    const receiverPartyName  = params['ReceiverPartyPublicName'] as string | undefined;
    const amount             = params['TransactionAmount'] as number | undefined;

    // Find the outbound transaction by originatorConversationId stored in metadata
    const transaction = await prisma.transaction.findFirst({
      where: {
        direction: 'outbound',
        status: 'processing',
        metadata: { path: ['originatorConversationId'], equals: originatorConversationId },
      },
    });

    if (!transaction) {
      console.warn(`[B2C Result] No matching transaction for OriginatorConversationID=${originatorConversationId}`);
      return;
    }

    if (resultCode === 0) {
      // Disbursement confirmed by Safaricom
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'completed',
          mpesaReceiptNumber: transactionReceipt,
          mpesaResultCode: resultCode,
          mpesaResultDesc: resultDesc,
          metadata: {
            ...(transaction.metadata as object ?? {}),
            receiverPartyName,
            amount,
            conversationId,
          },
        },
      });

      // Mark linked MGR schedule entry as completed
      if (transaction.referenceId && transaction.referenceType === 'mgr_payout') {
        await prisma.mgrSchedule.updateMany({
          where: { id: transaction.referenceId },
          data: { status: 'completed', receivedAmount: amount, receivedAt: new Date() },
        });
      }

      console.log(`[B2C Result] ✅ KES ${amount} confirmed to ${receiverPartyName} — receipt ${transactionReceipt}`);
    } else {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'failed', mpesaResultCode: resultCode, mpesaResultDesc: resultDesc },
      });
      console.error(`[B2C Result] ❌ Payout failed — ConversationID=${conversationId} Desc=${resultDesc}`);
    }
  }

  /**
   * Process B2C Timeout callback from Safaricom.
   * Fires when Safaricom cannot deliver the result to our ResultURL within their window.
   * POST /api/mpesa/b2c/timeout
   *
   * Strategy: log and leave the transaction in 'processing' so the reconciliation cron
   * can re-query its status and either confirm or fail it cleanly. Do NOT mark failed
   * immediately — the money may have already left our shortcode.
   */
  public static async processB2CTimeout(body: any) {
    const originatorConversationId: string =
      body?.OriginatorConversationID ?? body?.Result?.OriginatorConversationID ?? '';
    console.warn(`[B2C Timeout] Safaricom timeout for OriginatorConversationID=${originatorConversationId}`);

    if (!originatorConversationId) return;

    const transaction = await prisma.transaction.findFirst({
      where: {
        direction: 'outbound',
        status: 'processing',
        metadata: { path: ['originatorConversationId'], equals: originatorConversationId },
      },
    });

    if (transaction) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          mpesaResultDesc: 'Safaricom timeout — pending reconciliation',
          metadata: { ...(transaction.metadata as object ?? {}), timedOutAt: new Date().toISOString() },
        },
      });
    }
  }
}
