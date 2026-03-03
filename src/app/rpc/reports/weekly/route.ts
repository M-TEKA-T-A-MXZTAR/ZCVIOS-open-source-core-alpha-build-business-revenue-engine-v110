import { NextResponse } from "next/server";
import { buildWeeklyReport } from "@/lib/engine";
import { requireSession } from "@/lib/session";
import { unauthorized } from "@/lib/http";

export async function GET() {
  const session = await requireSession();
  if (!session) return unauthorized();

  const report = await buildWeeklyReport(session.user.id);
  return NextResponse.json(report);
}
