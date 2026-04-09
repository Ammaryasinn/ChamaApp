"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loanRouter = void 0;
const express_1 = require("express");
const loan_service_1 = require("../services/loan.service");
const auth_1 = require("../middleware/auth");
exports.loanRouter = (0, express_1.Router)({ mergeParams: true });
/**
 * Get Loans
 * GET /api/chamas/:id/loans
 */
exports.loanRouter.get("/", async (req, res) => {
    try {
        const loans = await loan_service_1.LoanService.getLoans(req.params.id);
        res.status(200).json(loans);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.loanRouter.use(auth_1.authMiddleware);
/**
 * Apply for Loan
 * POST /api/chamas/:id/loans
 */
exports.loanRouter.post('/', async (req, res) => {
    try {
        const { amount, repaymentMonths, purpose } = req.body;
        const loan = await loan_service_1.LoanService.applyForLoan(req.params.id, req.user.userId, Number(amount), Number(repaymentMonths), purpose);
        res.status(201).json(loan);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
/**
 * Cast Vote
 * POST /api/chamas/:id/loans/:loanId/vote
 */
exports.loanRouter.post('/:loanId/vote', async (req, res) => {
    try {
        const { vote } = req.body; // 'yes' | 'no' | 'abstain'
        const result = await loan_service_1.LoanService.castVote(req.params.loanId, req.user.userId, vote);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
/**
 * Disburse Loan (Chairperson only, middleware needed for prod)
 * POST /api/chamas/:id/loans/:loanId/disburse
 */
exports.loanRouter.post('/:loanId/disburse', async (req, res) => {
    try {
        const result = await loan_service_1.LoanService.disburseLoan(req.params.loanId, req.user.userId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
