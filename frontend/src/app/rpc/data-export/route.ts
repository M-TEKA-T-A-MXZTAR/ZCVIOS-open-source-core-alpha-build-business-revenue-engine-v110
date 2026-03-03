import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { unauthorized } from "@/lib/http";

export async function GET() {
  const session = await requireSession();
  if (!session) return unauthorized();

  const [user, weeklyRevenues, strategies, logs, missions, pauses] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        email: true,
        name: true,
        businessUrl: true,
        socialLinks: true,
        businessDescription: true,
        businessType: true,
        hoursAvailablePerWeek: true,
        weeklyRevenueBaselineCents: true,
        targetMonthlyIncomeCents: true,
        targetMaxHoursPerWeek: true,
        consistencyWindowMonths: true,
        fullLoggingEnabled: true,
        commandMode: true,
        createdAt: true,
      },
    }),
    prisma.weeklyRevenue.findMany({ where: { userId: session.user.id }, orderBy: { weekStart: "asc" } }),
    prisma.weeklyStrategy.findMany({ where: { userId: session.user.id }, orderBy: { weekStart: "asc" } }),
    prisma.dailyLog.findMany({ where: { userId: session.user.id }, orderBy: { date: "asc" } }),
    prisma.dailyMission.findMany({ where: { userId: session.user.id }, orderBy: { date: "asc" } }),
    prisma.pauseWindow.findMany({ where: { userId: session.user.id }, orderBy: { startDate: "asc" } }),
  ]);

  return NextResponse.json({
    policy: "We do not sell your data.",
    exportedAt: new Date().toISOString(),
    data: {
      user,
      weeklyRevenues,
      strategies,
      logs,
      missions,
      pauses,
    },
  });
}
