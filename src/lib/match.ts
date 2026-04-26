import { db } from "./db";
import { COLL_CV, getVectors, searchJobs } from "./qdrant";

const MATCH_TOP_K_PER_CHUNK = 20;
const TOP_CHUNK_SCORES_PER_JOB = 3;

export interface RankedJob {
  job_id: number;
  score: number;
  title: string;
  location: string | null;
  salary_range: string | null;
  company_name: string | null;
}

export async function matchJobsForCv(cvId: number, limit = 10): Promise<RankedJob[]> {
  const chunkIds = (
    db
      .prepare("SELECT id FROM cv_chunks WHERE cv_id = ? ORDER BY chunk_idx")
      .all(cvId) as { id: number }[]
  ).map((r) => r.id);
  if (chunkIds.length === 0) return [];

  const vectorMap = await getVectors(COLL_CV, chunkIds);
  if (vectorMap.size === 0) return [];

  const scoresByJob = new Map<number, number[]>();
  for (const v of vectorMap.values()) {
    const hits = await searchJobs(v, MATCH_TOP_K_PER_CHUNK, true);
    for (const h of hits) {
      const arr = scoresByJob.get(h.payload.job_id) ?? [];
      arr.push(h.score);
      scoresByJob.set(h.payload.job_id, arr);
    }
  }

  const aggregated: { job_id: number; score: number }[] = [];
  for (const [job_id, scores] of scoresByJob) {
    scores.sort((a, b) => b - a);
    const top = scores.slice(0, TOP_CHUNK_SCORES_PER_JOB);
    const mean = top.reduce((s, x) => s + x, 0) / top.length;
    aggregated.push({ job_id, score: mean });
  }
  aggregated.sort((a, b) => b.score - a.score);
  const head = aggregated.slice(0, limit);

  if (head.length === 0) return [];
  const placeholders = head.map(() => "?").join(",");
  const rows = db
    .prepare(
      `SELECT j.id AS job_id, j.title, j.location, j.salary_range, ep.company_name
       FROM jobs j
       LEFT JOIN employer_profiles ep ON ep.user_id = j.employer_id
       WHERE j.id IN (${placeholders})`
    )
    .all(...head.map((h) => h.job_id)) as Omit<RankedJob, "score">[];

  const byId = new Map(rows.map((r) => [r.job_id, r]));
  return head
    .map((h) => {
      const row = byId.get(h.job_id);
      if (!row) return null;
      return { ...row, score: h.score };
    })
    .filter((x): x is RankedJob => x !== null);
}
