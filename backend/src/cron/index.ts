import cron from 'node-cron';
import { prisma } from '../lib/prisma';
import { MpesaService } from '../services/mpesa.service';
import { SmsService } from '../services/sms.service';
import { CreditScoreService } from '../services/credit-score.service';
import dayjs from 'dayjs';

/**
 * Initialize all cron jobs
 */
export function initCronJobs() {
  console.log('Initializing Background Jobs...');

  // 1. Reconcile M-Pesa transactions (Every 10 minutes)
  cron.schedule('*/10 * * * *', async () => {
    try {
      console.log('[Cron] Reconciling M-Pesa transactions...');
      await MpesaService.reconcileTransactions();
    } catch (err) {
      console.error('[Cron] Reconcile M-Pesa Error:', err);
    }
  });

  // 2. Check expired swap requests (Hourly at minute 0)
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('[Cron] Checking expired swap requests...');
      const expired = await prisma.swapRequest.findMany({
        where: { status: 'pending', expiresAt: { lt: new Date() } }
      });
      for (const req of expired) {
        await prisma.swapRequest.update({ where: { id: req.id }, data: { status: 'expired' } });
      }
    } catch (err) {
      console.error('[Cron] Expired swaps Error:', err);
    }
  });

  // 3. Apply penalties (Daily at 8:00 AM)
  cron.schedule('0 8 * * *', async () => {
    try {
      console.log('[Cron] Applying late penalties...');
      // In a real app we'd fetch chamas, check grace days, and apply
      // Let's do a basic blanket query:
      // Find pending contributions where due date + grace days < today
      const today = new Date();
      
      const pendingConts = await prisma.contribution.findMany({
        where: { status: 'pending' },
        include: { chamaMember: { include: { chama: true, user: true } } }
      });

      for (const cont of pendingConts) {
        const graceDays = cont.chamaMember.chama.penaltyGraceDays || 0;
        const penaltyAmount = cont.chamaMember.chama.penaltyAmount || 0;
        
        if (Number(penaltyAmount) > 0) {
           const deadline = dayjs(cont.dueDate).add(graceDays, 'days');
           if (dayjs(today).isAfter(deadline)) {
              await prisma.contribution.update({
                 where: { id: cont.id },
                 data: { status: 'late', penaltyAmount }
              });

              if (cont.chamaMember.user?.phoneNumber) {
                 await SmsService.sendSms(
                    cont.chamaMember.user.phoneNumber,
                    `Your contribution to ${cont.chamaMember.chama.name} is late. A penalty of KES ${penaltyAmount} has been added.`
                 );
              }
           }
        }
      }
    } catch (err) {
      console.error('[Cron] Apply penalties Error:', err);
    }
  });

  // 4. Send SMS Reminders (Daily at 9:00 AM)
  cron.schedule('0 9 * * *', async () => {
    try {
      console.log('[Cron] Sending contribution reminders...');
      const inThreeDays = dayjs().add(3, 'days').format('YYYY-MM-DD');
      
      const impending = await prisma.contribution.findMany({
        where: { status: 'pending' },
        include: { chamaMember: { include: { chama: true, user: true } } }
      });

      for (const cont of impending) {
         if (dayjs(cont.dueDate).format('YYYY-MM-DD') === inThreeDays && cont.chamaMember.user?.phoneNumber) {
             const amount = Number(cont.expectedAmount) - Number(cont.paidAmount);
             await SmsService.sendSms(
               cont.chamaMember.user.phoneNumber,
               `Habari ${cont.chamaMember.user.fullName}, your KES ${amount} contribution for ${cont.chamaMember.chama.name} is due on ${dayjs(cont.dueDate).format('MMM D')}.`
             );
         }
      }
    } catch (err) {
      console.error('[Cron] SMS reminders Error:', err);
    }
  });

  // 5. Auto-create contribution cycles (Daily at 7:00 AM)
  cron.schedule('0 7 * * *', async () => {
    try {
      console.log('[Cron] Auto-creating contribution cycles...');
      
      const activeChamas = await prisma.chama.findMany({
        where: { status: 'active' },
        include: { members: { where: { status: 'active' } } }
      });

      for (const chama of activeChamas) {
        // Find latest cycle
        const latestCycle = await prisma.contributionCycle.findFirst({
           where: { chamaId: chama.id },
           orderBy: { cycleNumber: 'desc' }
        });

        const today = dayjs();
        let shouldCreate = false;
        let nextCycleNumber = 1;
        let startDate = today.toDate();
        let endDate = today.add(1, 'month').toDate(); // rough default

        if (!latestCycle) {
          shouldCreate = true;
          // Calculate start/end based on frequency and meetingDay
          endDate = today.add(chama.contributionFrequency === 'weekly' ? 7 : chama.contributionFrequency === 'biweekly' ? 14 : 30, 'days').toDate();
        } else if (today.isAfter(dayjs(latestCycle.dueDate))) {
          shouldCreate = true;
          nextCycleNumber = latestCycle.cycleNumber + 1;
          startDate = latestCycle.dueDate;
          endDate = dayjs(startDate).add(chama.contributionFrequency === 'weekly' ? 7 : chama.contributionFrequency === 'biweekly' ? 14 : 30, 'days').toDate();
        }

        if (shouldCreate && chama.members.length > 0) {
           const newCycle = await prisma.contributionCycle.create({
              data: {
                 chamaId: chama.id,
                 cycleNumber: nextCycleNumber,
                 startDate,
                 dueDate: endDate,
                 expectedAmount: Number(chama.contributionAmount) * chama.members.length,
              }
           });

           // Create pending contribution records for all members
           const contributions = chama.members.map((member: any) => ({
              cycleId: newCycle.id,
              chamaMemberId: member.id,
              expectedAmount: chama.contributionAmount,
              status: 'pending' as const,
              dueDate: endDate
           }));

           await prisma.contribution.createMany({ data: contributions });
           
           console.log(`[Cron] Created cycle ${nextCycleNumber} for chama ${chama.id}`);
        }
      }
    } catch (err) {
      console.error('[Cron] Create cycles Error:', err);
    }
  });

  // 6. Process MGR Payouts (Daily at 6:00 AM)
  cron.schedule('0 6 * * *', async () => {
    try {
      console.log('[Cron] Processing MGR payouts...');
      
      // Find completed cycles where mgrPaidOut = false
      const today = new Date();
      const completedCycles = await prisma.contributionCycle.findMany({
        where: { dueDate: { lte: today }, mgrPaidOut: false },
        include: { chama: true }
      });

      for (const cycle of completedCycles) {
         if (cycle.chama.chamaType === 'investment' || cycle.chama.chamaType === 'welfare') continue; // Not MGR

         // Find the member scheduled for this cycle
         const schedule = await prisma.mgrSchedule.findFirst({
           where: { chamaId: cycle.chamaId, cycleNumber: cycle.cycleNumber },
           include: { chamaMember: { include: { user: true } } }
         });

         if (schedule && schedule.chamaMember.user?.phoneNumber && schedule.status === 'upcoming') {
           // Ensure the pot has funds
           const amountToPay = cycle.collectedAmount; // Simplified payout
           
           if (Number(amountToPay) > 0) {
              await MpesaService.sendB2CPayout({
                 phoneNumber: schedule.chamaMember.user.phoneNumber,
                 amount: Number(amountToPay),
                 remarks: `MGR Payout for cycle ${cycle.cycleNumber}`,
              });

              await prisma.mgrSchedule.update({
                 where: { id: schedule.id },
                 data: { status: 'completed' }
              });
              
              await prisma.auditLog.create({
                 data: {
                    chamaId: cycle.chamaId,
                    actorId: 'system',
                    entityType: 'mgr_payout',
                    entityId: schedule.id,
                    action: 'mgr_payout_disbursed'
                 }
              });
           }
         }

         await prisma.contributionCycle.update({
             where: { id: cycle.id },
             data: { mgrPaidOut: true }
         });
      }
    } catch (err) {
      console.error('[Cron] MGR Payouts Error:', err);
    }
  });

  // 7. Recalculate Credit Scores (Monthly on 1st at 1:00 AM)
  cron.schedule('0 1 1 * *', async () => {
    try {
       console.log('[Cron] Recalculating all credit scores...');
       await CreditScoreService.recalculateAll();
    } catch (err) {
       console.error('[Cron] Credit Score Recalculation Error:', err);
    }
  });

}
