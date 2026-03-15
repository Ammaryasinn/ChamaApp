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

    // Accumulators for per-member growth scores and streaks (aggregated after the loop)
    const memberGrowthScores: number[] = [];
    const memberStreaks: number[] = [];

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

      // ── Contribution growth score (per member) ─────────────────────────────
      // Compare average paid amount across first 3 vs last 3 paid contributions.
      // A member paying more over time scores higher; flat or declining scores lower.
      const paidContributions = member.contributions
        .filter(c => c.status === 'paid')
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

      if (paidContributions.length >= 2) {
        const first3 = paidContributions.slice(0, 3);
        const last3  = paidContributions.slice(-3);
        const avgFirst = first3.reduce((s, c) => s + Number(c.paidAmount), 0) / first3.length;
        const avgLast  = last3.reduce((s, c)  => s + Number(c.paidAmount), 0) / last3.length;
        const memberGrowthScore = avgFirst === 0
          ? 70
          : Math.min(Math.round((avgLast / avgFirst) * 70), 100);
        memberGrowthScores.push(memberGrowthScore);
      }

      // ── Per-member streak (newest → oldest, break on first miss) ─────────────
      // Stricter than a cross-chama walk because a missed payment in any chama
      // this member belongs to breaks their current streak.
      const sortedNewestFirst = member.contributions
        .filter(c => c.status !== 'pending')
        .sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime());

      let memberStreak = 0;
      for (const c of sortedNewestFirst) {
        if (c.status === 'paid' && c.paidAt && c.paidAt <= c.dueDate) {
          memberStreak++;
        } else {
          break; // streak is broken — stop counting
        }
      }
      memberStreaks.push(memberStreak);

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

    // ── Aggregate streak and growth across all chamas ────────────────────────
    // Streak: use the minimum streak across all chamas (a miss anywhere counts).
    const consecutiveOnTime = memberStreaks.length > 0 ? Math.min(...memberStreaks) : 0;

    // Growth: average the per-member growth scores.
    const contributionGrowthScore = memberGrowthScores.length > 0
      ? Math.round(memberGrowthScores.reduce((a, b) => a + b, 0) / memberGrowthScores.length)
      : 70; // neutral default if no paid history yet

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
    // Real: compares average paid amount in first 3 vs last 3 contributions per member.
    // Falls back to neutral 70 if member has fewer than 2 paid contributions.

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
      where: { chamaMemberships: { some: {} } }
    });

    // Process in parallel batches of 50 to avoid sequential bottleneck at scale.
    // At 100k users, sequential would take hours; batched parallel is ~50x faster.
    const BATCH_SIZE = 50;
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(u => this.calculateUserScore(u.id)));
    }
  }
}
