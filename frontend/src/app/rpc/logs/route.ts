import { NextResponse } from "next/server";
import { z } from "zod";
import { LogCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { startOfDay } from "@/lib/time";
import { unauthorized } from "@/lib/http";

const schema = z.object({
  date: z.string(),
  minutes: z.number().min(1).max(720),
  category: z.nativeEnum(LogCategory),
  completed: z.boolean(),
  note: z.string().max(240).optional(),
});

export async function GET() {
  const session = await requireSession();
  if (!session) return unauthorized();

  const logs = await prisma.dailyLog.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: 100,
  });

  return NextResponse.json(
    logs.map((item) => ({
      id: item.id,
      date: item.date,
      minutes: item.minutes,
      category: item.category,
      completed: item.completed,
      note: item.note,
    })),
  );
}

export async function POST(req: Request) {
  const session = await requireSession();
  if (!session) return unauthorized();

  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    const body = await req.json();
    const input = schema.parse(body);
    const date = startOfDay(new Date(input.date));
    const today = startOfDay();

    if (date.getTime() > today.getTime()) {
      return NextResponse.json({ error: "Future dates are not allowed for logs." }, { status: 400 });
    }

    if (!user?.fullLoggingEnabled && ["MAINTENANCE", "DRIFT"].includes(input.category)) {
      return NextResponse.json(
        { error: "Full logging is disabled. Enable full logging to add Maintenance/Drift." },
        { status: 400 },
      );
    }

    const entry = await prisma.dailyLog.create({
      data: {
        userId: session.user.id,
        date,
        minutes: input.minutes,
        category: input.category,
        completed: input.completed,
        note: input.note,
      },
    });

    return NextResponse.json({
      id: entry.id,
      date: entry.date,
      minutes: entry.minutes,
      category: entry.category,
      completed: entry.completed,
      note: entry.note,
    });
  } catch {
    return NextResponse.json({ error: "Invalid log input" }, { status: 400 });
  }
}
