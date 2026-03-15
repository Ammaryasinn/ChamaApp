import { Router, Request, Response } from 'express';
import { MgrService } from '../services/mgr.service';
import { authMiddleware } from '../middleware/auth';

export const mgrRouter = Router({ mergeParams: true });

mgrRouter.use(authMiddleware);

/**
 * Generate MGR Schedule
 * POST /api/chamas/:id/mgr/schedule
 */
mgrRouter.post('/schedule', async (req: Request, res: Response) => {
  try {
    const schedule = await MgrService.generateSchedule(req.params.id as string, req.user!.userId);
    res.status(201).json(schedule);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Initiate Swap Request
 * POST /api/chamas/:id/mgr/swap
 */
mgrRouter.post('/swap', async (req: Request, res: Response) => {
  try {
    const { targetMemberId, reason } = req.body;
    
    // In a real app we would derive requesterMemberId from req.user!.userId + chamaId
    // For simplicity we will assume it's passed or derived from a middleware
    const { requesterMemberId } = req.body;

    const swap = await MgrService.requestSwap(
      req.params.id as string,
      requesterMemberId,
      targetMemberId,
      reason
    );
    res.status(201).json(swap);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Respond to Swap Request
 * PUT /api/chamas/:id/mgr/swaps/:swapId/respond
 */
mgrRouter.put('/swaps/:swapId/respond', async (req: Request, res: Response) => {
  try {
    const { accept, responderMemberId } = req.body;
    const swap = await MgrService.respondToSwap(
      req.params.swapId as string,
      responderMemberId,
      accept
    );
    res.status(200).json(swap);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
