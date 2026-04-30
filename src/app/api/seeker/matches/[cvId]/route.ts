import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, isShowcaseMode } from "@/lib/auth";
import { matchJobsForCv } from "@/lib/match";
import { getShowcaseMatches } from "@/lib/showcase";

export async function GET(_req: Request, { params }: { params: { cvId: string } }) {
  const user = getCurrentUser();
  if (!user || user.role !== "seeker") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const cvId = Number(params.cvId);
  if (!Number.isFinite(cvId)) {
    return NextResponse.json({ error: "Invalid cvId" }, { status: 400 });
  }
  if (isShowcaseMode()) {
    const matches = getShowcaseMatches().filter((m) => m.cv_id === cvId);
    return NextResponse.json({ matches });
  }
  const cv = db.prepare("SELECT seeker_id FROM cvs WHERE id = ?").get(cvId) as { seeker_id: number } | undefined;
  if (!cv) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (cv.seeker_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const matches = await matchJobsForCv(cvId, 10);
    return NextResponse.json({ matches });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Match failed" }, { status: 502 });
  }
}
