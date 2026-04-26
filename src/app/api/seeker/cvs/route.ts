import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ingestCv } from "@/lib/ingest";
import { extractPdfText, PdfTooSparseError } from "@/lib/pdf";

const MAX_PER_SPEC = Number(process.env.MAX_CVS_PER_SPECIALIZATION ?? 5);

export async function GET() {
  const user = getCurrentUser();
  if (!user || user.role !== "seeker") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const rows = db
    .prepare(
      `SELECT c.id, c.specialization, c.filename, c.created_at,
              (SELECT COUNT(*) FROM cv_chunks WHERE cv_id = c.id) AS chunk_count
       FROM cvs c
       WHERE c.seeker_id = ?
       ORDER BY c.created_at DESC`
    )
    .all(user.id);
  return NextResponse.json({ cvs: rows });
}

export async function POST(req: Request) {
  const user = getCurrentUser();
  if (!user || user.role !== "seeker") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ct = req.headers.get("content-type") ?? "";
  let specialization = "";
  let filename: string | null = null;
  let rawText = "";

  if (ct.includes("multipart/form-data")) {
    const form = await req.formData();
    specialization = String(form.get("specialization") ?? "").trim();
    const pasted = String(form.get("text") ?? "").trim();
    const file = form.get("file");
    if (file instanceof File && file.size > 0) {
      filename = file.name;
      const buf = Buffer.from(await file.arrayBuffer());
      try {
        rawText = await extractPdfText(buf);
      } catch (e) {
        if (e instanceof PdfTooSparseError) {
          return NextResponse.json({ error: e.message }, { status: 400 });
        }
        return NextResponse.json({ error: "Could not parse PDF." }, { status: 400 });
      }
    } else if (pasted) {
      rawText = pasted;
    }
  } else {
    const body = (await req.json()) as { specialization?: string; text?: string; filename?: string };
    specialization = (body.specialization ?? "").trim();
    rawText = (body.text ?? "").trim();
    filename = body.filename ?? null;
  }

  if (!specialization) {
    return NextResponse.json({ error: "specialization is required" }, { status: 400 });
  }
  if (rawText.length < 100) {
    return NextResponse.json({ error: "CV text is too short (need ≥100 chars)" }, { status: 400 });
  }

  const count = (
    db
      .prepare(
        "SELECT COUNT(*) AS n FROM cvs WHERE seeker_id = ? AND specialization = ?"
      )
      .get(user.id, specialization) as { n: number }
  ).n;
  if (count >= MAX_PER_SPEC) {
    return NextResponse.json(
      { error: `Limit reached: ${MAX_PER_SPEC} CVs per specialization.` },
      { status: 409 }
    );
  }

  try {
    const result = await ingestCv({
      seekerId: user.id,
      specialization,
      filename,
      rawText,
    });
    return NextResponse.json({ cv_id: result.cvId, chunks: result.chunkCount });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ingest failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
