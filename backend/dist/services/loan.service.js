"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanService = void 0;
const prisma_1 = require("../lib/prisma");
const dayjs_1 = __importDefault(require("dayjs"));
class LoanService {
    /**
     * Apply for a loan
     */
    static async applyForLoan(chamaId, borrowerMemberId, amount, repaymentMonths, purpose) {
        const chama = await prisma_1.prisma.chama.findUnique({ where: { id: chamaId } });
        if (!chama)
            throw new Error('Chama not found');
        const member = await prisma_1.prisma.chamaMember.findUnique({
            where: { id: borrowerMemberId }
        });
        if (!member)
            throw new Error('Member not found');
        const maxAllowed = Number(member.totalContributed) * Number(chama.maxLoanMultiplier);
        if (amount > maxAllowed) {
            throw new Error(`Amount exceeds maximum allowed limit. Max is ${maxAllowed}`);
        }
        const interestRate = Number(chama.loanInterestRate);
        const totalRepayable = amount + (amount * (interestRate / 100) * (repaymentMonths / 12));
        const monthlyRepayment = totalRepayable / repaymentMonths;
        const loan = await prisma_1.prisma.loan.create({
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
        await prisma_1.prisma.auditLog.create({
            data: {
                chamaId,
                entityType: 'loan',
                entityId: loan.id,
                action: 'loan_applied',
                newValue: { amount, repaymentMonths, purpose },
            }
        });
        return loan;
    }
    /**
     * Cast a vote and check threshold
     */
    static async castVote(loanId, voterMemberId, voteValue) {
        const loan = await prisma_1.prisma.loan.findUnique({
            where: { id: loanId },
            include: { chama: { include: { members: { where: { status: 'active' } } } } }
        });
        if (!loan || loan.status !== 'pending_vote')
            throw new Error('Loan not pending vote');
        // Prevent double voting
        const existingVote = await prisma_1.prisma.loanVote.findUnique({
            where: { loanId_voterMemberId: { loanId, voterMemberId } }
        });
        if (existingVote)
            throw new Error('Already voted');
        // Prevent borrower from voting on their own loan
        if (loan.borrowerMemberId === voterMemberId)
            throw new Error('Borrowers cannot vote on their own loan');
        await prisma_1.prisma.loanVote.create({
            data: {
                loanId,
                voterMemberId,
                vote: voteValue,
            }
        });
        // Check approval threshold
        const votes = await prisma_1.prisma.loanVote.findMany({ where: { loanId } });
        const yesVotes = votes.filter(v => v.vote === 'yes').length;
        const noVotes = votes.filter(v => v.vote === 'no').length;
        // Eligible voters = active members - 1 (the borrower)
        const eligibleVoters = loan.chama.members.length - 1;
        let approved = false;
        let rejected = false;
        if (loan.chama.minVotesToApproveLoan === 0) {
            if (yesVotes > eligibleVoters / 2)
                approved = true;
            if (noVotes >= eligibleVoters / 2)
                rejected = true;
        }
        else {
            if (yesVotes >= loan.chama.minVotesToApproveLoan)
                approved = true;
            if (votes.length >= eligibleVoters && !approved)
                rejected = true;
        }
        if (approved) {
            await prisma_1.prisma.loan.update({
                where: { id: loanId },
                data: { status: 'approved' }
            });
        }
        else if (rejected) {
            await prisma_1.prisma.loan.update({
                where: { id: loanId },
                data: { status: 'rejected' }
            });
        }
        return { loanId, voteValue, currentStatus: approved ? 'approved' : rejected ? 'rejected' : 'pending_vote' };
    }
    /**
     * Disburse Loan
     */
    static async disburseLoan(loanId, actedById) {
        const loan = await prisma_1.prisma.loan.findUnique({ where: { id: loanId } });
        if (!loan || loan.status !== 'approved')
            throw new Error('Loan not approved for disbursement');
        // Start repayment sequence
        const updated = await prisma_1.prisma.loan.update({
            where: { id: loanId },
            data: {
                status: 'active',
                disbursedAt: new Date(),
                dueDate: (0, dayjs_1.default)().add(loan.repaymentMonths, 'months').toDate(),
            }
        });
        await prisma_1.prisma.auditLog.create({
            data: {
                chamaId: loan.chamaId,
                actorId: actedById,
                entityType: 'loan',
                entityId: loanId,
                action: 'loan_disbursed',
                newValue: { status: 'active' },
            }
        });
        return updated;
    }
}
exports.LoanService = LoanService;
