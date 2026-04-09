"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRouter = void 0;
const express_1 = require("express");
const notification_service_1 = require("../services/notification.service");
const auth_1 = require("../middleware/auth");
exports.notificationRouter = (0, express_1.Router)();
exports.notificationRouter.use(auth_1.authMiddleware);
/**
 * Get all notifications for logged in user
 * GET /api/notifications
 */
exports.notificationRouter.get('/', async (req, res) => {
    try {
        const notifications = await notification_service_1.NotificationService.getUserNotifications(req.user.userId);
        res.status(200).json(notifications);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
