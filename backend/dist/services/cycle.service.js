"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CycleService = void 0;
const prisma_1 = require("../lib/prisma");
const mpesa_service_1 = require("./mpesa.service");
const uuid_1 = require("uuid");
class CycleService {
    /**
     * Triggers STK Push for a single user in a cycle
     */
    static async collectContribution(chamaId, cycleId, contributionId, actedById) {
        const contribution = await prisma_1.prisma.contribution.findUnique({
            where: { id: contributionId },
            include: {
                chamaMember: {
                    include: { user: true }
                }
            }
        });
        if (!contribution)
            throw new Error('Contribution not found');
        if (contribution.cycleId !== cycleId)
            throw new Error('Contribution belongs to another cycle');
        if (contribution.status === 'paid')
            throw new Error('Contribution already paid');
        if (!contribution.chamaMember.user?.phoneNumber) {
            throw new Error('User has no phone number on record');
        }
        const totalDue = Number(contribution.expectedAmount) - Number(contribution.paidAmount) + Number(contribution.penaltyAmount);
        if (totalDue <= 0) {
            throw new Error('No outstanding amount for this contribution');
        }
        // Call Daraja
        await mpesa_service_1.MpesaService.sendStkPush({
            chamaId,
            userId: contribution.chamaMember.user.id,
            phoneNumber: contribution.chamaMember.user.phoneNumber,
            amount: totalDue,
            referenceId: contribution.id,
            referenceType: 'contribution',
            description: `Chama contribution collection`,
        });
        // Mark as STK sent
        await prisma_1.prisma.contribution.update({
            where: { id: contribution.id },
            data: {
                status: 'stk_sent',
                stkSentAt: new Date()
            }
        });
        return { message: `STK Push sent to ${contribution.chamaMember.user.phoneNumber}` };
    }
    /**
     * Collect for ALL pending members in a cycle
     */
    static async collectAllPending(chamaId, cycleId, actedById) {
        const pendingContributions = await prisma_1.prisma.contribution.findMany({
            where: {
                cycleId,
                status: { in: ['pending', 'late', 'partial'] }
            },
            include: {
                chamaMember: { include: { user: true } }
            }
        });
        const results = [];
        for (const cont of pendingContributions) {
            if (cont.chamaMember.user?.phoneNumber) {
                try {
                    await this.collectContribution(chamaId, cycleId, cont.id, actedById);
                    results.push({ id: cont.id, status: 'sent' });
                }
                catch (e) {
                    results.push({ id: cont.id, status: 'failed', reason: e.message });
                }
            }
        }
        return results;
    }
    /**
     * Manually mark as paid (cash payment)
     */
    static async markPaid(chamaId, cycleId, contributionId, amount, actedById) {
        const contribution = await prisma_1.prisma.contribution.findUnique({
            where: { id: contributionId },
            include: { chamaMember: { include: { chama: true } } }
        });
        if (!contribution)
            throw new Error('Contribution not found');
        const result = await prisma_1.prisma.$transaction(async (tx) => {
            const updated = await tx.contribution.update({
                where: { id: contributionId },
                data: {
                    paidAmount: amount,
                    status: 'paid',
                    paidAt: new Date()
                }
            });
            await tx.chamaMember.update({
                where: { id: contribution.chamaMemberId },
                data: { totalContributed: { increment: amount } }
            });
            const chama = contribution.chamaMember.chama;
            if (chama.chamaType === 'hybrid') {
                await tx.chama.update({
                    where: { id: chama.id },
                    data: {
                        mgrPotBalance: { increment: (amount * chama.mgrPercentage) / 100 },
                        investmentFundBalance: { increment: (amount * chama.investmentPercentage) / 100 },
                        welfarePotBalance: { increment: (amount * chama.welfarePercentage) / 100 }
                    }
                });
            }
            else {
                await tx.chama.update({
                    where: { id: chama.id },
                    data: { mgrPotBalance: { increment: amount } }
                });
            }
            await tx.contributionCycle.update({
                where: { id: cycleId },
                data: { collectedAmount: { increment: amount } }
            });
            await tx.auditLog.create({
                where: { id: (0, uuid_1.v4)() },
                data: {
                    chamaId: chamaId,
                    actorId: actedById,
                    entityType: 'contribution',
                    entityId: contribution.id,
                    action: 'mark_paid_manual',
                    oldValue: { status: contribution.status, paidAmount: contribution.paidAmount },
                    newValue: { status: 'paid', paidAmount: amount },
                }
            });
            return updated;
        });
        return result;
    }
    /**
     * Waive penalty
     */
    static async waivePenalty(chamaId, cycleId, contributionId, actedById) {
        const contribution = await prisma_1.prisma.contribution.findUnique({
            where: { id: contributionId }
        });
        if (!contribution)
            throw new Error('Contribution not found');
        const result = await prisma_1.prisma.$transaction(async (tx) => {
            const updated = await tx.contribution.update({
                where: { id: contributionId },
                data: {
                    penaltyAmount: 0,
                    status: contribution.paidAmount >= contribution.expectedAmount ? 'paid' : 'pending'
                }
            });
            await tx.auditLog.create({
                where: { id: (0, uuid_1.v4)() },
                data: {
                    chamaId,
                    actorId: actedById,
                    entityType: 'contribution',
                    entityId: contribution.id,
                    action: 'waive_penalty',
                    oldValue: { penaltyAmount: contribution.penaltyAmount, status: contribution.status },
                    newValue: { penaltyAmount: 0, status: updated.status },
                }
            });
            return updated;
        });
        return result;
    }
}
exports.CycleService = CycleService;
