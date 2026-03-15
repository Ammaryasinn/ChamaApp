"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChama = createChama;
exports.getUserChamas = getUserChamas;
exports.getChamaById = getChamaById;
exports.updateChama = updateChama;
const prisma_1 = require("../lib/prisma");
const error_1 = require("../utils/error");
/**
 * Create a new chama and add creator as chairperson.
 */
async function createChama(createdBy, input) {
    // Validate hybrid percentages
    if (input.chamaType === "hybrid") {
        const mgrPct = input.mgrPercentage || 0;
        const invPct = input.investmentPercentage || 0;
        const welPct = input.welfarePercentage || 0;
        if (mgrPct + invPct + welPct !== 100) {
            throw error_1.Errors.INVALID_INPUT("Hybrid chama percentages must sum to 100");
        }
    }
    const chama = await prisma_1.prisma.chama.create({
        data: {
            name: input.name,
            description: input.description,
            chamaType: input.chamaType,
            contributionAmount: input.contributionAmount,
            contributionFrequency: input.contributionFrequency,
            meetingDay: input.meetingDay,
            penaltyAmount: input.penaltyAmount || 0,
            penaltyGraceDays: input.penaltyGraceDays || 3,
            maxLoanMultiplier: input.maxLoanMultiplier || 3.0,
            loanInterestRate: input.loanInterestRate || 10.0,
            minVotesToApproveLoan: input.minVotesToApproveLoan || 0,
            mgrPercentage: input.mgrPercentage || 0,
            investmentPercentage: input.investmentPercentage || 0,
            welfarePercentage: input.welfarePercentage || 0,
            createdBy,
        },
    });
    // Add creator as chairperson
    await prisma_1.prisma.chamaMember.create({
        data: {
            chamaId: chama.id,
            userId: createdBy,
            role: "chairperson",
        },
    });
    return formatChamaResponse(chama);
}
/**
 * Get all chamas for a user.
 */
async function getUserChamas(userId) {
    const memberships = await prisma_1.prisma.chamaMember.findMany({
        where: { userId },
        include: {
            chama: true,
        },
    });
    return memberships.map((m) => formatChamaResponse(m.chama));
}
/**
 * Get single chama with member count.
 */
async function getChamaById(chamaId) {
    const chama = await prisma_1.prisma.chama.findUnique({
        where: { id: chamaId },
        include: {
            members: {
                select: {
                    id: true,
                    userId: true,
                    role: true,
                    status: true,
                    totalContributed: true,
                },
            },
        },
    });
    if (!chama) {
        throw error_1.Errors.CHAMA_NOT_FOUND();
    }
    return {
        ...formatChamaResponse(chama),
        memberCount: chama.members.length,
        members: chama.members,
    };
}
/**
 * Update chama settings (chairperson only).
 */
async function updateChama(chamaId, userId, data) {
    // Verify user is chairperson
    const membership = await prisma_1.prisma.chamaMember.findFirst({
        where: {
            chamaId,
            userId,
            role: "chairperson",
        },
    });
    if (!membership) {
        throw error_1.Errors.FORBIDDEN();
    }
    const chama = await prisma_1.prisma.chama.update({
        where: { id: chamaId },
        data: {
            name: data.name,
            description: data.description,
            contributionAmount: data.contributionAmount,
            contributionFrequency: data.contributionFrequency,
            meetingDay: data.meetingDay,
            penaltyAmount: data.penaltyAmount,
            penaltyGraceDays: data.penaltyGraceDays,
            loanInterestRate: data.loanInterestRate,
            minVotesToApproveLoan: data.minVotesToApproveLoan,
        },
    });
    return formatChamaResponse(chama);
}
/**
 * Format chama response.
 */
function formatChamaResponse(chama) {
    return {
        id: chama.id,
        name: chama.name,
        description: chama.description,
        chamaType: chama.chamaType,
        contributionAmount: chama.contributionAmount,
        contributionFrequency: chama.contributionFrequency,
        penaltyAmount: chama.penaltyAmount,
        status: chama.status,
        createdAt: chama.createdAt,
    };
}
