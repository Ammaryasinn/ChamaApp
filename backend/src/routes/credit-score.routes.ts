import { Router, Request, Response } from 'express';
import { CreditScoreService } from '../services/credit-score.service';
import { authMiddleware } from '../middleware/auth';

export const creditScoreRouter = Router();

creditScoreRouter.use(authMiddleware);

/**
 * Get My Credit Score
 * GET /api/credit-scores/me
 */
creditScoreRouter.get('/me', async (req: Request, res: Response) => {
  try {
    const score = await CreditScoreService.calculateUserScore(req.user!.userId);
    res.status(200).json(score);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Recalculate (Internal cron trigger)
 * POST /api/credit-scores/recalculate
 */
creditScoreRouter.post('/recalculate', async (req: Request, res: Response) => {
  try {
    await CreditScoreService.recalculateAll();
    res.status(200).json({ success: true, message: 'All scores recalculated' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default creditScoreRouter;
