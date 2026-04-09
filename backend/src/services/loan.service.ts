import { prisma } from '../lib/prisma';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

export class LoanService {
  /**
   * Apply for a loan
   */
  public static async getLoans(chamaId: string) {
    return await prisma.loan.findMany({
      where: { chamaId },
      include: {
        borrowerMember: {
          include: { user: { select: { fullName: true, profilePhotoUrl: true } } },
        },
        votes: {
          include: {
            voterMember: { include: { user: { select: { fullName: true } } } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  public static async applyForLoan(
    chamaId: string,
    borrowerMemberId: string,
    amount: number,
    repaymentMonths: number,
    purpose: string
  ) {
    const chama = await prisma.chama.findUnique({ where: { id: chamaId } });
    if (!chama) throw new Error('Chama not found');

    const member = await prisma.chamaMember.findUnique({
      where: { id: borrowerMemberId }
    });
    if (!member) throw new Error('Member not found');

    const maxAllowed = Number(member.totalContributed) * Number(chama.maxLoanMultiplier);
    if (amount > maxAllowed) {
      throw new Error(`Amount exceeds maximum allowed limit. Max is ${maxAllowed}`);
    }

    const interestRate = Number(chama.loanInterestRate);
    const totalRepayable = amount + (amount * (interestRate / 100) * (repaymentMonths / 12));
    const monthlyRepayment = totalRepayable / repaymentMonths;

    const loan = await prisma.loan.create({
      data: {
        chamaId,
        borrowerMemberId,
        amount,
        interestRate,
        repaymentMonths,
        monthlyRepayment,
        totalRepayable,
        purpose,
        status: 'pending_vote',
      }
    });

    await prisma.auditLog.create({
      data: {
        chamaId,
        entityType: 'loan',
        entityId: loan.id,
        action: 'loan_applied',
        newValue: { amount, repaymentMonths, purpose } as any,
      }
    });

    return loan;
  }

  /**
   * Cast a vote and check threshold
   */
  public static async castVote(
    loanId: string,
    voterMemberId: string,
    voteValue: 'yes' | 'no' | 'abstain'
  ) {
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: { chama: { include: { members: { where: { status: 'active' } } } } }
    });
    if (!loan || loan.status !== 'pending_vote') throw new Error('Loan not pending vote');

    // Prevent double voting
    const existingVote = await prisma.loanVote.findUnique({
      where: { loanId_voterMemberId: { loanId, voterMemberId } }
    });
    if (existingVote) throw new Error('Already voted');

    // Prevent borrower from voting on their own loan
    if (loan.borrowerMemberId === voterMemberId) throw new Error('Borrowers cannot vote on their own loan');

    await prisma.loanVote.create({
      data: {
        loanId,
        voterMemberId,
        vote: voteValue,
      }
    });

    // Check approval threshold
    const votes = await prisma.loanVote.findMany({ where: { loanId } });
    const yesVotes = votes.filter(v => v.vote === 'yes').length;
    const noVotes = votes.filter(v => v.vote === 'no').length;
    
    // Eligible voters = active members - 1 (the borrower)
    const eligibleVoters = loan.chama.members.length - 1;
    let approved = false;
    let rejected = false;

    if (loan.chama.minVotesToApproveLoan === 0) {
      if (yesVotes > eligibleVoters / 2) approved = true;
      if (noVotes >= eligibleVoters / 2) rejected = true;
    } else {
      if (yesVotes >= loan.chama.minVotesToApproveLoan) approved = true;
      if (votes.length >= eligibleVoters && !approved) rejected = true;
    }

    if (approved) {
      await prisma.loan.update({
        where: { id: loanId },
        data: { status: 'approved' }
      });
    } else if (rejected) {
      await prisma.loan.update({
        where: { id: loanId },
        data: { status: 'rejected' }
      });
    }

    return { loanId, voteValue, currentStatus: approved ? 'approved' : rejected ? 'rejected' : 'pending_vote' };
  }

  /**
   * Disburse Loan
   */
  public static async disburseLoan(loanId: string, actedById: string) {
    const loan = await prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan || loan.status !== 'approved') throw new Error('Loan not approved for disbursement');

    // Start repayment sequence
    const updated = await prisma.loan.update({
      where: { id: loanId },
      data: {
        status: 'active',
        disbursedAt: new Date(),
        dueDate: dayjs().add(loan.repaymentMonths, 'months').toDate(),
      }
    });

    await prisma.auditLog.create({
      data: {
        chamaId: loan.chamaId,
        actorId: actedById,
        entityType: 'loan',
        entityId: loanId,
        action: 'loan_disbursed',
        newValue: { status: 'active' } as any,
      }
    });

    return updated;
  }
}
