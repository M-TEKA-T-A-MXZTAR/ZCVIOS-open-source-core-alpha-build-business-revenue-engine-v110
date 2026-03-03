import { NextResponse } from "next/server";
import { buildWeeklyReviewPacket } from "@/lib/engine";
import { requireSession } from "@/lib/session";
import { unauthorized } from "@/lib/http";

export async function GET() {
  const session = await requireSession();
  if (!session) return unauthorized();

  const packet = await buildWeeklyReviewPacket(session.user.id);
  return NextResponse.json(packet);
}
