import { prisma } from '../lib/prisma';

export class NotificationService {
  public static async getUserNotifications(userId: string) {
    const memberships = await prisma.chamaMember.findMany({
      where: { userId, status: 'active' },
      select: { chamaId: true }
    });

    const chamaIds = memberships.map(m => m.chamaId);

    return await prisma.notification.findMany({
      where: { chamaId: { in: chamaIds } },
      include: {
        chama: { select: { name: true, avatarUrl: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }
}
