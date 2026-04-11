import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/api-helpers";

export async function GET() {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalRackets,
      activeRackets,
      soldRackets,
      pendingSubmissions,
      totalSubmissions,
      unreadContacts,
      totalContacts,
      recentContacts,
      recentSubmissions,
    ] = await Promise.all([
      prisma.racket.count(),
      prisma.racket.count({ where: { sold: false } }),
      prisma.racket.count({ where: { sold: true } }),
      prisma.submission.count({ where: { status: "pending" } }),
      prisma.submission.count(),
      prisma.contactRequest.count({ where: { read: false } }),
      prisma.contactRequest.count(),
      prisma.contactRequest.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.submission.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
    ]);

    // Revenue estimate (total of sold items)
    const soldRacketsList = await prisma.racket.findMany({
      where: { sold: true },
      select: { price: true },
    });
    const totalRevenue = soldRacketsList.reduce((sum, r) => sum + r.price, 0);

    // Recent activity
    const recentActivity = await prisma.contactRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        read: true,
        createdAt: true,
      },
    });

    return apiSuccess({
      rackets: { total: totalRackets, active: activeRackets, sold: soldRackets },
      submissions: {
        total: totalSubmissions,
        pending: pendingSubmissions,
        recentWeek: recentSubmissions,
      },
      contacts: {
        total: totalContacts,
        unread: unreadContacts,
        recentWeek: recentContacts,
      },
      revenue: totalRevenue,
      recentActivity,
    });
  } catch (error) {
    console.error("GET /api/admin/analytics error:", error);
    return apiError("Failed to fetch analytics", 500);
  }
}
