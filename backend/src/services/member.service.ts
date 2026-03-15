import { prisma } from "../lib/prisma";
import { Errors } from "../utils/error";
import { MemberRole, MemberStatus } from "@prisma/client";

/**
 * Add a member to a chama by phone number (chairperson only).
 */
export async function addChamaMember(
  chamaId: string,
  actorId: string,
  phoneNumber: string,
  role: MemberRole = "member",
) {
  // Verify actor is chairperson
  const chairperson = await prisma.chamaMember.findFirst({
    where: {
      chamaId,
      userId: actorId,
      role: "chairperson",
    },
  });

  if (!chairperson) {
    throw Errors.FORBIDDEN();
  }

  // Find user by phone
  const user = await prisma.user.findUnique({
    where: { phoneNumber },
  });

  if (!user) {
    throw Errors.USER_NOT_FOUND();
  }

  // Check if already a member
  const existing = await prisma.chamaMember.findFirst({
    where: {
      chamaId,
      userId: user.id,
    },
  });

  if (existing) {
    throw Errors.DUPLICATE_MEMBER();
  }

  const member = await prisma.chamaMember.create({
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
export async function getChamaMembers(chamaId: string) {
  const members = await prisma.chamaMember.findMany({
    where: { chamaId, status: "active" },
    include: { user: true },
  });

  return members.map((m) => formatMemberResponse(m, m.user));
}

/**
 * Get single member profile with history.
 */
export async function getChamaMemberProfile(
  chamaId: string,
  memberId: string,
  actorId: string,
) {
  // Verify actor has access
  const actor = await prisma.chamaMember.findFirst({
    where: { chamaId, userId: actorId },
  });

  if (!actor) {
    throw Errors.FORBIDDEN();
  }

  const member = await prisma.chamaMember.findUnique({
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
    throw Errors.CHAMA_MEMBER_NOT_FOUND();
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
export async function updateMemberRole(
  chamaId: string,
  memberId: string,
  actorId: string,
  newRole: MemberRole,
) {
  // Verify actor is chairperson
  const chairperson = await prisma.chamaMember.findFirst({
    where: {
      chamaId,
      userId: actorId,
      role: "chairperson",
    },
  });

  if (!chairperson) {
    throw Errors.FORBIDDEN();
  }

  const member = await prisma.chamaMember.update({
    where: { id: memberId },
    data: { role: newRole },
    include: { user: true },
  });

  return formatMemberResponse(member, member.user);
}

/**
 * Remove member from chama (chairperson only).
 */
export async function removeChamaMember(
  chamaId: string,
  memberId: string,
  actorId: string,
) {
  // Verify actor is chairperson
  const chairperson = await prisma.chamaMember.findFirst({
    where: {
      chamaId,
      userId: actorId,
      role: "chairperson",
    },
  });

  if (!chairperson) {
    throw Errors.FORBIDDEN();
  }

  // Soft delete: set status to exited
  await prisma.chamaMember.update({
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
function formatMemberResponse(member: any, user: any) {
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
