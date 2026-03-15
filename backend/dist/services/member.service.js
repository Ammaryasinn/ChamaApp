"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addChamaMember = addChamaMember;
exports.getChamaMembers = getChamaMembers;
exports.getChamaMemberProfile = getChamaMemberProfile;
exports.updateMemberRole = updateMemberRole;
exports.removeChamaMember = removeChamaMember;
const prisma_1 = require("../lib/prisma");
const error_1 = require("../utils/error");
/**
 * Add a member to a chama by phone number (chairperson only).
 */
async function addChamaMember(chamaId, actorId, phoneNumber, role = "member") {
    // Verify actor is chairperson
    const chairperson = await prisma_1.prisma.chamaMember.findFirst({
        where: {
            chamaId,
            userId: actorId,
            role: "chairperson",
        },
    });
    if (!chairperson) {
        throw error_1.Errors.FORBIDDEN();
    }
    // Find user by phone
    const user = await prisma_1.prisma.user.findUnique({
        where: { phoneNumber },
    });
    if (!user) {
        throw error_1.Errors.USER_NOT_FOUND();
    }
    // Check if already a member
    const existing = await prisma_1.prisma.chamaMember.findFirst({
        where: {
            chamaId,
            userId: user.id,
        },
    });
    if (existing) {
        throw error_1.Errors.DUPLICATE_MEMBER();
    }
    const member = await prisma_1.prisma.chamaMember.create({
        data: {
            chamaId,
            userId: user.id,
            role,
            status: "active",
        },
    });
    return formatMemberResponse(member, user);
}
/**
 * List all members in a chama.
 */
async function getChamaMembers(chamaId) {
    const members = await prisma_1.prisma.chamaMember.findMany({
        where: { chamaId, status: "active" },
        include: { user: true },
    });
    return members.map((m) => formatMemberResponse(m, m.user));
}
/**
 * Get single member profile with history.
 */
async function getChamaMemberProfile(chamaId, memberId, actorId) {
    // Verify actor has access
    const actor = await prisma_1.prisma.chamaMember.findFirst({
        where: { chamaId, userId: actorId },
    });
    if (!actor) {
        throw error_1.Errors.FORBIDDEN();
    }
    const member = await prisma_1.prisma.chamaMember.findUnique({
        where: { id: memberId },
        include: {
            user: true,
            contributions: {
                include: { cycle: true },
                take: 10,
                orderBy: { createdAt: "desc" },
            },
            borrowedLoans: {
                take: 5,
                orderBy: { createdAt: "desc" },
            },
        },
    });
    if (!member) {
        throw error_1.Errors.CHAMA_MEMBER_NOT_FOUND();
    }
    return {
        ...formatMemberResponse(member, member.user),
        totalContributed: member.totalContributed,
        recentContributions: member.contributions,
        loans: member.borrowedLoans,
    };
}
/**
 * Update member role (chairperson only).
 */
async function updateMemberRole(chamaId, memberId, actorId, newRole) {
    // Verify actor is chairperson
    const chairperson = await prisma_1.prisma.chamaMember.findFirst({
        where: {
            chamaId,
            userId: actorId,
            role: "chairperson",
        },
    });
    if (!chairperson) {
        throw error_1.Errors.FORBIDDEN();
    }
    const member = await prisma_1.prisma.chamaMember.update({
        where: { id: memberId },
        data: { role: newRole },
        include: { user: true },
    });
    return formatMemberResponse(member, member.user);
}
/**
 * Remove member from chama (chairperson only).
 */
async function removeChamaMember(chamaId, memberId, actorId) {
    // Verify actor is chairperson
    const chairperson = await prisma_1.prisma.chamaMember.findFirst({
        where: {
            chamaId,
            userId: actorId,
            role: "chairperson",
        },
    });
    if (!chairperson) {
        throw error_1.Errors.FORBIDDEN();
    }
    // Soft delete: set status to exited
    await prisma_1.prisma.chamaMember.update({
        where: { id: memberId },
        data: {
            status: "exited",
            exitAt: new Date(),
        },
    });
    return { success: true };
}
/**
 * Format member response.
 */
function formatMemberResponse(member, user) {
    return {
        id: member.id,
        userId: user.id,
        chamaId: member.chamaId,
        name: user.fullName,
        phoneNumber: user.phoneNumber,
        role: member.role,
        status: member.status,
        joinedAt: member.joinedAt,
    };
}
