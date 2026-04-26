import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { deleteCv } from "@/lib/ingest";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = getCurrentUser();
  if (!user || user.role !== "seeker") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const cvId = Number(params.id);
  if (!Number.isFinite(cvId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const row = db.prepare("SELECT seeker_id FROM cvs WHERE id = ?").get(cvId) as
    | { seeker_id: number }
    | undefined;
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (row.seeker_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await deleteCv(cvId);
  return NextResponse.json({ ok: true });
}
