import { Router, Request, Response } from 'express';
import { LoanService } from '../services/loan.service';
import { authMiddleware } from '../middleware/auth';

export const loanRouter = Router({ mergeParams: true });

loanRouter.use(authMiddleware);

/**
 * Apply for Loan
 * POST /api/chamas/:id/loans
 */
loanRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { amount, repaymentMonths, purpose } = req.body;
    const loan = await LoanService.applyForLoan(
      req.params.id as string,
      req.user!.userId,
      Number(amount),
      Number(repaymentMonths),
      purpose
    );
    res.status(201).json(loan);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Cast Vote
 * POST /api/chamas/:id/loans/:loanId/vote
 */
loanRouter.post('/:loanId/vote', async (req: Request, res: Response) => {
  try {
    const { vote } = req.body; // 'yes' | 'no' | 'abstain'
    const result = await LoanService.castVote(
      req.params.loanId as string,
      req.user!.userId,
      vote
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Disburse Loan (Chairperson only, middleware needed for prod)
 * POST /api/chamas/:id/loans/:loanId/disburse
 */
loanRouter.post('/:loanId/disburse', async (req: Request, res: Response) => {
  try {
    const result = await LoanService.disburseLoan(
      req.params.loanId as string,
      req.user!.userId
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
