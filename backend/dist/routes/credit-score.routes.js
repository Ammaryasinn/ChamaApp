"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creditScoreRouter = void 0;
const express_1 = require("express");
const credit_score_service_1 = require("../services/credit-score.service");
const auth_1 = require("../middleware/auth");
exports.creditScoreRouter = (0, express_1.Router)();
exports.creditScoreRouter.use(auth_1.authMiddleware);
/**
 * Get My Credit Score
 * GET /api/credit-scores/me
 */
exports.creditScoreRouter.get('/me', async (req, res) => {
    try {
        const score = await credit_score_service_1.CreditScoreService.calculateUserScore(req.user.userId);
        res.status(200).json(score);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
/**
 * Recalculate (Internal cron trigger)
 * POST /api/credit-scores/recalculate
 */
exports.creditScoreRouter.post('/recalculate', async (req, res) => {
    try {
        await credit_score_service_1.CreditScoreService.recalculateAll();
        res.status(200).json({ success: true, message: 'All scores recalculated' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = exports.creditScoreRouter;
