"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cycleRouter = void 0;
const express_1 = require("express");
const cycle_service_1 = require("../services/cycle.service");
const auth_1 = require("../middleware/auth");
exports.cycleRouter = (0, express_1.Router)({ mergeParams: true });
exports.cycleRouter.use(auth_1.authMiddleware);
/**
 * Trigger STK push to all pending members
 * POST /api/chamas/:id/cycles/:cycleId/collect
 */
exports.cycleRouter.post('/:cycleId/collect', async (req, res) => {
    try {
        const results = await cycle_service_1.CycleService.collectAllPending(req.params.id, req.params.cycleId, req.user.userId);
        res.status(200).json({ success: true, results });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
/**
 * Trigger STK push for a single member's contribution
 * POST /api/chamas/:id/cycles/:cycleId/contributions/:contributionId/collect
 */
exports.cycleRouter.post('/:cycleId/contributions/:contributionId/collect', async (req, res) => {
    try {
        const result = await cycle_service_1.CycleService.collectContribution(req.params.id, req.params.cycleId, req.params.contributionId, req.user.userId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
/**
 * Manual mark paid
 * POST /api/chamas/:id/cycles/:cycleId/contributions/:contributionId/mark-paid
 */
exports.cycleRouter.post('/:cycleId/contributions/:contributionId/mark-paid', async (req, res) => {
    try {
        const { amount } = req.body;
        const result = await cycle_service_1.CycleService.markPaid(req.params.id, req.params.cycleId, req.params.contributionId, Number(amount), req.user.userId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
/**
 * Waive penalty
 * POST /api/chamas/:id/cycles/:cycleId/contributions/:contributionId/waive-penalty
 */
exports.cycleRouter.post('/:cycleId/contributions/:contributionId/waive-penalty', async (req, res) => {
    try {
        const result = await cycle_service_1.CycleService.waivePenalty(req.params.id, req.params.cycleId, req.params.contributionId, req.user.userId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
