"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const prisma_1 = require("../lib/prisma");
class NotificationService {
    static async getUserNotifications(userId) {
        const memberships = await prisma_1.prisma.chamaMember.findMany({
            where: { userId, status: 'active' },
            select: { chamaId: true }
        });
        const chamaIds = memberships.map(m => m.chamaId);
        return await prisma_1.prisma.notification.findMany({
            where: { chamaId: { in: chamaIds } },
            include: {
                chama: { select: { name: true, avatarUrl: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
    }
}
exports.NotificationService = NotificationService;
