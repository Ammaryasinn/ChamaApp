import { Router, Request, Response } from 'express';
import { CycleService } from '../services/cycle.service';
import { authMiddleware } from '../middleware/auth';

export const cycleRouter = Router({ mergeParams: true });

cycleRouter.use(authMiddleware);

/**
 * Trigger STK push to all pending members
 * POST /api/chamas/:id/cycles/:cycleId/collect
 */
cycleRouter.post('/:cycleId/collect', async (req: Request, res: Response) => {
  try {
    const results = await CycleService.collectAllPending(
      req.params.id as string,
      req.params.cycleId as string,
      req.user!.userId
    );
    res.status(200).json({ success: true, results });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Trigger STK push for a single member's contribution
 * POST /api/chamas/:id/cycles/:cycleId/contributions/:contributionId/collect
 */
cycleRouter.post('/:cycleId/contributions/:contributionId/collect', async (req: Request, res: Response) => {
  try {
    const result = await CycleService.collectContribution(
      req.params.id as string,
      req.params.cycleId as string,
      req.params.contributionId as string,
      req.user!.userId
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Manual mark paid
 * POST /api/chamas/:id/cycles/:cycleId/contributions/:contributionId/mark-paid
 */
cycleRouter.post('/:cycleId/contributions/:contributionId/mark-paid', async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const result = await CycleService.markPaid(
      req.params.id as string,
      req.params.cycleId as string,
      req.params.contributionId as string,
      Number(amount),
      req.user!.userId
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Waive penalty
 * POST /api/chamas/:id/cycles/:cycleId/contributions/:contributionId/waive-penalty
 */
cycleRouter.post('/:cycleId/contributions/:contributionId/waive-penalty', async (req: Request, res: Response) => {
  try {
    const result = await CycleService.waivePenalty(
      req.params.id as string,
      req.params.cycleId as string,
      req.params.contributionId as string,
      req.user!.userId
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
