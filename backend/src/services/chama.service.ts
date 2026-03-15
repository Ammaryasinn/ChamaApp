import { prisma } from "../lib/prisma";
import { Errors } from "../utils/error";
import { ChamaType, ContributionFrequency, ChamaStatus } from "@prisma/client";

export interface CreateChamaInput {
  name: string;
  description?: string;
  chamaType: ChamaType;
  contributionAmount: number;
  contributionFrequency: ContributionFrequency;
  meetingDay?: number;
  penaltyAmount?: number;
  penaltyGraceDays?: number;
  maxLoanMultiplier?: number;
  loanInterestRate?: number;
  minVotesToApproveLoan?: number;
  // Hybrid only
  mgrPercentage?: number;
  investmentPercentage?: number;
  welfarePercentage?: number;
}

/**
 * Create a new chama and add creator as chairperson.
 */
export async function createChama(
  createdBy: string,
  input: CreateChamaInput,
) {
  // Validate hybrid percentages
  if (input.chamaType === "hybrid") {
    const mgrPct = input.mgrPercentage || 0;
    const invPct = input.investmentPercentage || 0;
    const welPct = input.welfarePercentage || 0;

    if (mgrPct + invPct + welPct !== 100) {
      throw Errors.INVALID_INPUT(
        "Hybrid chama percentages must sum to 100",
      );
    }
  }

  const chama = await prisma.chama.create({
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
  await prisma.chamaMember.create({
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
export async function getUserChamas(userId: string) {
  const memberships = await prisma.chamaMember.findMany({
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
export async function getChamaById(chamaId: string) {
  const chama = await prisma.chama.findUnique({
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
    throw Errors.CHAMA_NOT_FOUND();
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
export async function updateChama(
  chamaId: string,
  userId: string,
  data: Partial<CreateChamaInput>,
) {
  // Verify user is chairperson
  const membership = await prisma.chamaMember.findFirst({
    where: {
      chamaId,
      userId,
      role: "chairperson",
    },
  });

  if (!membership) {
    throw Errors.FORBIDDEN();
  }

  const chama = await prisma.chama.update({
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
function formatChamaResponse(chama: any) {
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
