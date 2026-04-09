"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MgrService = void 0;
const prisma_1 = require("../lib/prisma");
const dayjs_1 = __importDefault(require("dayjs"));
class MgrService {
    /**
     * Generates initial random MGR schedule
     */
    static async getSchedule(chamaId) {
        return await prisma_1.prisma.mgrSchedule.findMany({
            where: { chamaId },
            include: {
                chamaMember: { include: { user: { select: { fullName: true, profilePhotoUrl: true } } } },
            },
            orderBy: { cycleNumber: "asc" },
        });
    }
    static async generateSchedule(chamaId, actedById) {
        const members = await prisma_1.prisma.chamaMember.findMany({
            where: { chamaId, status: 'active' },
        });
        if (members.length === 0)
            throw new Error('No active members in this chama');
        // Check if schedule already exists
        const existing = await prisma_1.prisma.mgrSchedule.findFirst({ where: { chamaId } });
        if (existing)
            throw new Error('MGR Schedule already exists for this chama');
        // Cryptographically secure Fisher-Yates shuffle
        const crypto = await Promise.resolve().then(() => __importStar(require('crypto')));
        const shuffled = [...members];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = crypto.randomInt(0, i + 1);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        const scheduleData = shuffled.map((member, index) => ({
            chamaId,
            chamaMemberId: member.id,
            cycleNumber: index + 1,
            originalCycleNumber: index + 1,
            status: 'upcoming',
        }));
        await prisma_1.prisma.mgrSchedule.createMany({ data: scheduleData });
        await prisma_1.prisma.auditLog.create({
            data: {
                chamaId,
                actorId: actedById,
                entityType: 'mgr_schedule',
                entityId: chamaId,
                action: 'schedule_generated',
            }
        });
        return scheduleData;
    }
    /**
     * Validates and creates a swap request
     */
    static async requestSwap(chamaId, requesterMemberId, targetMemberId, reason) {
        // 1. Fetch current positions
        const requesterSchedule = await prisma_1.prisma.mgrSchedule.findFirst({
            where: { chamaId, chamaMemberId: requesterMemberId, status: 'upcoming' }
        });
        const targetSchedule = await prisma_1.prisma.mgrSchedule.findFirst({
            where: { chamaId, chamaMemberId: targetMemberId, status: 'upcoming' }
        });
        if (!requesterSchedule)
            throw new Error('Rule 1 Failed: Requester has already received or has no upcoming cycle.');
        if (!targetSchedule)
            throw new Error('Rule 5 Failed: Target has already received or has no upcoming cycle.');
        // 2. Check outstanding penalties
        const penalties = await prisma_1.prisma.contribution.findFirst({
            where: { chamaMemberId: requesterMemberId, status: 'late' }
        });
        if (penalties)
            throw new Error('Rule 2 Failed: Requester has outstanding penalties.');
        // 3. No existing pending swap for requester cycle
        const existingPending = await prisma_1.prisma.swapRequest.findFirst({
            where: {
                chamaId,
                status: 'pending',
                OR: [
                    { requesterCycle: requesterSchedule.cycleNumber },
                    { targetCycle: requesterSchedule.cycleNumber }
                ]
            }
        });
        if (existingPending)
            throw new Error('Rule 3 Failed: Requester cycle position already has a pending swap request.');
        // 4. Swap window must be > 7 days from earlier cycle's payout
        const earlierCycle = Math.min(requesterSchedule.cycleNumber, targetSchedule.cycleNumber);
        const cycleRecord = await prisma_1.prisma.contributionCycle.findFirst({
            where: { chamaId, cycleNumber: earlierCycle }
        });
        // Sometimes the cycle record is not created yet (created progressively).
        // If it is created, check date
        if (cycleRecord) {
            if ((0, dayjs_1.default)(cycleRecord.dueDate).diff((0, dayjs_1.default)(), 'days') <= 7) {
                throw new Error('Rule 4 Failed: Swap window is locked (< 7 days to payout).');
            }
        }
        // Create swap request
        const swap = await prisma_1.prisma.swapRequest.create({
            data: {
                chamaId,
                requesterMemberId,
                targetMemberId,
                requesterCycle: requesterSchedule.cycleNumber,
                targetCycle: targetSchedule.cycleNumber,
                reason,
                expiresAt: (0, dayjs_1.default)().add(48, 'hours').toDate(),
            }
        });
        return swap;
    }
    /**
     * Responds to a swap request
     */
    static async respondToSwap(swapId, responderMemberId, accept) {
        const swap = await prisma_1.prisma.swapRequest.findUnique({ where: { id: swapId } });
        if (!swap || swap.status !== 'pending')
            throw new Error('Swap request not found or not pending');
        if (swap.targetMemberId !== responderMemberId)
            throw new Error('Unauthorized to respond to this swap');
        if (swap.expiresAt < new Date()) {
            await prisma_1.prisma.swapRequest.update({ where: { id: swapId }, data: { status: 'expired' } });
            throw new Error('Swap request expired');
        }
        if (!accept) {
            return await prisma_1.prisma.swapRequest.update({
                where: { id: swapId },
                data: { status: 'declined', respondedAt: new Date() }
            });
        }
        // Accept Swap - Atomic transaction
        return await prisma_1.prisma.$transaction(async (tx) => {
            // Fetch both schedules
            const reqSchedule = await tx.mgrSchedule.findFirst({
                where: { chamaId: swap.chamaId, chamaMemberId: swap.requesterMemberId, cycleNumber: swap.requesterCycle }
            });
            const tgtSchedule = await tx.mgrSchedule.findFirst({
                where: { chamaId: swap.chamaId, chamaMemberId: swap.targetMemberId, cycleNumber: swap.targetCycle }
            });
            if (!reqSchedule || !tgtSchedule)
                throw new Error('Schedules not found for swap positions');
            // Swap cycle numbers
            await tx.mgrSchedule.update({
                where: { id: reqSchedule.id },
                data: { cycleNumber: swap.targetCycle }
            });
            await tx.mgrSchedule.update({
                where: { id: tgtSchedule.id },
                data: { cycleNumber: swap.requesterCycle }
            });
            // Update swap status
            const updatedSwap = await tx.swapRequest.update({
                where: { id: swapId },
                data: { status: 'accepted', respondedAt: new Date() }
            });
            // Audit log
            await tx.auditLog.create({
                data: {
                    chamaId: swap.chamaId,
                    entityType: 'swap',
                    entityId: swapId,
                    action: 'swap_accepted',
                    oldValue: { reqCycle: swap.requesterCycle, tgtCycle: swap.targetCycle },
                    newValue: { reqCycle: swap.targetCycle, tgtCycle: swap.requesterCycle }
                }
            });
            return updatedSwap;
        });
    }
}
exports.MgrService = MgrService;
