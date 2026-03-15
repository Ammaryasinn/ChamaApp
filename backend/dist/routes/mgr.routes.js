"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mgrRouter = void 0;
const express_1 = require("express");
const mgr_service_1 = require("../services/mgr.service");
const auth_1 = require("../middleware/auth");
exports.mgrRouter = (0, express_1.Router)({ mergeParams: true });
exports.mgrRouter.use(auth_1.authMiddleware);
/**
 * Generate MGR Schedule
 * POST /api/chamas/:id/mgr/schedule
 */
exports.mgrRouter.post('/schedule', async (req, res) => {
    try {
        const schedule = await mgr_service_1.MgrService.generateSchedule(req.params.id, req.user.userId);
        res.status(201).json(schedule);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
/**
 * Initiate Swap Request
 * POST /api/chamas/:id/mgr/swap
 */
exports.mgrRouter.post('/swap', async (req, res) => {
    try {
        const { targetMemberId, reason } = req.body;
        // In a real app we would derive requesterMemberId from req.user!.userId + chamaId
        // For simplicity we will assume it's passed or derived from a middleware
        const { requesterMemberId } = req.body;
        const swap = await mgr_service_1.MgrService.requestSwap(req.params.id, requesterMemberId, targetMemberId, reason);
        res.status(201).json(swap);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
/**
 * Respond to Swap Request
 * PUT /api/chamas/:id/mgr/swaps/:swapId/respond
 */
exports.mgrRouter.put('/swaps/:swapId/respond', async (req, res) => {
    try {
        const { accept, responderMemberId } = req.body;
        const swap = await mgr_service_1.MgrService.respondToSwap(req.params.swapId, responderMemberId, accept);
        res.status(200).json(swap);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
