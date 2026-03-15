import { prisma } from '../lib/prisma';

export class CreditScoreService {
  /**
   * Calculate credit score for a single user
   */
  public static async calculateUserScore(userId: string) {
    const members = await prisma.chamaMember.findMany({
      where: { userId },
      include: {
        contributions: { orderBy: { dueDate: 'asc' } },
        borrowedLoans: true,
        chama: true
      }
    });

    if (members.length === 0) return null;

    let totalExpectedPayments = 0;
    let totalOnTimePayments = 0;
    let totalLatePenaltiesCount = 0;

    // Streak tracking — we walk all contributions across all chamas chronologically
    // and maintain a running streak that resets on any miss.
    const allContributions: Array<{ paidAt: Date | null; dueDate: Date; status: string; penaltyAmount: unknown }> = [];

    let totalLoans = 0;
    let onTimeLoans = 0;

    let maxTenureMonths = 0;
    let totalContributed = 0;

    for (const member of members) {
      totalContributed += Number(member.totalContributed);
      
      const tenureMonths = (Date.now() - member.joinedAt.getTime()) / (1000 * 60 * 60 * 24 * 30);
      if (tenureMonths > maxTenureMonths) maxTenureMonths = tenureMonths;

      for (const cont of member.contributions) {
        allContributions.push(cont);
        if (cont.status !== 'pending') totalExpectedPayments++;
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

    // ── Consecutive on-time streak ────────────────────────────────────────────
    // Sort all contributions chronologically and walk forward.
    // Streak increments on paid-on-time, resets to 0 on any miss or late payment.
    allContributions.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    let consecutiveOnTime = 0;
    for (const cont of allContributions) {
      if (cont.status === 'pending') continue; // not yet due — don't break streak
      const onTime = cont.paidAt !== null && cont.paidAt <= cont.dueDate && cont.status === 'paid';
      if (onTime) {
        consecutiveOnTime++;
      } else {
        consecutiveOnTime = 0; // streak broken by a late/missed payment
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
    let rawScore = 
      (paymentConsistencyScore * 0.35) + 
      (loanRepaymentScore * 0.25) + 
      (tenureScore * 0.20) + 
      (contributionGrowthScore * 0.10) + 
      (penaltyRecordScore * 0.10); // out of 100

    let finalScore = Math.round(rawScore * 8.5); // scale to 850
    if (finalScore < 300) finalScore = 300;

    // Save
    const scoreRecord = await prisma.creditScore.create({
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
        consecutiveOnTime
      }
    });

    return scoreRecord;
  }

  /**
   * Recalculate all eligible members
   */
  public static async recalculateAll() {
    const users = await prisma.user.findMany({
      where: {
         chamaMemberships: { some: {} }
      }
    });

    for (const user of users) {
       await this.calculateUserScore(user.id);
    }
  }
}
