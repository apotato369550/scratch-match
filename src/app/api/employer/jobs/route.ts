import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ingestJob } from "@/lib/ingest";

const MAX_OPEN = Number(process.env.MAX_OPEN_JOBS_PER_EMPLOYER ?? 5);

const Body = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  requirements: z.string().default(""),
  qualifications: z.string().default(""),
  location: z.string().default(""),
  salary_range: z.string().default(""),
});

export async function GET() {
  const user = getCurrentUser();
  if (!user || user.role !== "employer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const rows = db
    .prepare(
      `SELECT j.id, j.title, j.location, j.salary_range, j.status, j.created_at,
              (SELECT COUNT(*) FROM job_chunks WHERE job_id = j.id) AS chunk_count
       FROM jobs j
       WHERE j.employer_id = ?
       ORDER BY j.created_at DESC`
    )
    .all(user.id);
  return NextResponse.json({ jobs: rows });
}

export async function POST(req: Request) {
  const user = getCurrentUser();
  if (!user || user.role !== "employer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const openCount = (
    db
      .prepare("SELECT COUNT(*) AS n FROM jobs WHERE employer_id = ? AND status = 'open'")
      .get(user.id) as { n: number }
  ).n;
  if (openCount >= MAX_OPEN) {
    return NextResponse.json(
      { error: `Limit reached: ${MAX_OPEN} open jobs per employer.` },
      { status: 409 }
    );
  }

  try {
    const result = await ingestJob({
      employerId: user.id,
      title: parsed.title,
      description: parsed.description,
      requirements: parsed.requirements,
      qualifications: parsed.qualifications,
      location: parsed.location,
      salaryRange: parsed.salary_range,
    });
    return NextResponse.json({ job_id: result.jobId, chunks: result.chunkCount });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ingest failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
