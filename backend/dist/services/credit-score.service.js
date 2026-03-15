"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditScoreService = void 0;
const prisma_1 = require("../lib/prisma");
class CreditScoreService {
    /**
     * Calculate credit score for a single user
     */
    static async calculateUserScore(userId) {
        const members = await prisma_1.prisma.chamaMember.findMany({
            where: { userId },
            include: {
                contributions: true,
                borrowedLoans: true,
                chama: true
            }
        });
        if (members.length === 0)
            return null;
        let totalExpectedPayments = 0;
        let totalOnTimePayments = 0;
        let totalLatePenaltiesCount = 0;
        let totalLoans = 0;
        let onTimeLoans = 0;
        let maxTenureMonths = 0;
        let totalContributed = 0;
        for (const member of members) {
            totalContributed += Number(member.totalContributed);
            const tenureMonths = (Date.now() - member.joinedAt.getTime()) / (1000 * 60 * 60 * 24 * 30);
            if (tenureMonths > maxTenureMonths)
                maxTenureMonths = tenureMonths;
            for (const cont of member.contributions) {
                if (cont.status !== 'pending')
                    totalExpectedPayments++;
                if (cont.paidAt && cont.paidAt <= cont.dueDate && cont.status === 'paid') {
                    totalOnTimePayments++;
                }
                if (Number(cont.penaltyAmount) > 0 || cont.status === 'late') {
                    totalLatePenaltiesCount++;
                }
            }
            for (const loan of member.borrowedLoans) {
                if (loan.status === 'completed' || loan.status === 'defaulted' || loan.status === 'active') {
                    totalLoans++;
                    // Approximating on time loan repayment (can be expanded later)
                    if (loan.status === 'completed' && loan.completedAt && loan.dueDate && loan.completedAt <= loan.dueDate) {
                        onTimeLoans++;
                    }
                }
            }
        }
        // Payment consistency  (35%)
        let paymentConsistencyScore = 0;
        if (totalExpectedPayments > 0) {
            paymentConsistencyScore = Math.round((totalOnTimePayments / totalExpectedPayments) * 100);
        }
        // Loan repayment (25%)
        let loanRepaymentScore = 75; // Neutral default
        if (totalLoans > 0) {
            loanRepaymentScore = Math.round((onTimeLoans / totalLoans) * 100);
        }
        // Tenure (20%)
        let tenureScore = Math.min(Math.round((maxTenureMonths / 36) * 100), 100);
        // Contribution Growth (10%)
        // Naïve calculation right now since tracking full history cleanly requires aggregation
        // Giving neutral 70 for now
        let contributionGrowthScore = 70;
        // Penalty Record (10%)
        let penaltyRecordScore = Math.max(100 - (totalLatePenaltiesCount * 5), 0);
        // Final raw calculation
        let rawScore = (paymentConsistencyScore * 0.35) +
            (loanRepaymentScore * 0.25) +
            (tenureScore * 0.20) +
            (contributionGrowthScore * 0.10) +
            (penaltyRecordScore * 0.10); // out of 100
        let finalScore = Math.round(rawScore * 8.5); // scale to 850
        if (finalScore < 300)
            finalScore = 300;
        // Save
        const scoreRecord = await prisma_1.prisma.creditScore.create({
            data: {
                userId,
                score: finalScore,
                paymentConsistencyScore,
                loanRepaymentScore,
                tenureScore,
                contributionGrowthScore,
                penaltyRecordScore,
                totalMonthsTracked: Math.floor(maxTenureMonths),
                totalContributed,
                chamasCount: members.length,
                consecutiveOnTime: totalOnTimePayments // Simulating for now
            }
        });
        return scoreRecord;
    }
    /**
     * Recalculate all eligible members
     */
    static async recalculateAll() {
        const users = await prisma_1.prisma.user.findMany({
            where: {
                chamaMemberships: { some: {} }
            }
        });
        for (const user of users) {
            await this.calculateUserScore(user.id);
        }
    }
}
exports.CreditScoreService = CreditScoreService;
