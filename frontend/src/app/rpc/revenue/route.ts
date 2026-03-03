import { NextResponse } from "next/server";
import { z } from "zod";
import { decryptApiKey } from "@/lib/crypto";
import { runStrategyOnWeeklyRevenueSave } from "@/lib/engine";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { startOfWeekMonday } from "@/lib/time";
import { unauthorized } from "@/lib/http";

const schema = z.object({
  revenue: z.number().min(0),
  note: z.string().max(240).optional(),
  weekStart: z.string().optional(),
});

export async function GET() {
  const session = await requireSession();
  if (!session) return unauthorized();

  const weekStart = startOfWeekMonday();

  const [current, recent, strategy] = await Promise.all([
    prisma.weeklyRevenue.findUnique({
      where: { userId_weekStart: { userId: session.user.id, weekStart } },
    }),
    prisma.weeklyRevenue.findMany({
      where: { userId: session.user.id },
      orderBy: { weekStart: "desc" },
      take: 8,
    }),
    prisma.weeklyStrategy.findUnique({
      where: { userId_weekStart: { userId: session.user.id, weekStart } },
    }),
  ]);

  return NextResponse.json({
    weekStart,
    currentRevenue: current ? current.revenueCents / 100 : null,
    currentLever: strategy?.selectedLever ?? "Distribution",
    recent: recent.map((item) => ({
      weekStart: item.weekStart,
      revenue: item.revenueCents / 100,
      strategyTriggered: item.strategyTriggered,
    })),
  });
}

export async function POST(req: Request) {
  const session = await requireSession();
  if (!session) return unauthorized();

  try {
    const body = await req.json();
    const input = schema.parse(body);
    const weekStart = input.weekStart ? startOfWeekMonday(new Date(input.weekStart)) : startOfWeekMonday();

    const revenue = await prisma.weeklyRevenue.upsert({
      where: { userId_weekStart: { userId: session.user.id, weekStart } },
      update: {
        revenueCents: Math.round(input.revenue * 100),
        note: input.note,
        strategyTriggered: true,
      },
      create: {
        userId: session.user.id,
        weekStart,
        revenueCents: Math.round(input.revenue * 100),
        note: input.note,
        strategyTriggered: true,
      },
    });

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    const apiKey = user?.openAiApiKeyEncrypted ? decryptApiKey(user.openAiApiKeyEncrypted) : null;

    const strategy = await runStrategyOnWeeklyRevenueSave({
      userId: session.user.id,
      apiKey,
      weekStart,
      note: input.note,
    });

    return NextResponse.json({
      ok: true,
      revenue: revenue.revenueCents / 100,
      strategy: {
        selectedLever: strategy.selectedLever,
        reasoningSummary: strategy.reasoningSummary,
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid revenue entry" }, { status: 400 });
  }
}
