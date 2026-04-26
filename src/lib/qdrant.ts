import { QdrantClient } from "@qdrant/js-client-rest";
import { EMBED_DIMS } from "./ollama";

const QDRANT_URL = process.env.QDRANT_URL ?? "http://localhost:6333";
const QDRANT_API_KEY = process.env.QDRANT_API_KEY || undefined;

export const COLL_CV = "cv_chunks";
export const COLL_JOB = "job_chunks";

declare global {
  // eslint-disable-next-line no-var
  var __sm_qdrant: QdrantClient | undefined;
}

export const qdrant: QdrantClient =
  global.__sm_qdrant ?? new QdrantClient({ url: QDRANT_URL, apiKey: QDRANT_API_KEY });
if (process.env.NODE_ENV !== "production") global.__sm_qdrant = qdrant;

export interface CvPayload {
  cv_id: number;
  seeker_id: number;
  specialization: string;
}

export interface JobPayload {
  job_id: number;
  employer_id: number;
  status: "open" | "closed";
  location: string | null;
}

export async function ensureCollections(): Promise<void> {
  for (const name of [COLL_CV, COLL_JOB]) {
    const exists = await qdrant
      .getCollection(name)
      .then(() => true)
      .catch(() => false);
    if (exists) continue;
    await qdrant.createCollection(name, {
      vectors: { size: EMBED_DIMS, distance: "Cosine" },
    });
  }
}

export async function ping(): Promise<boolean> {
  try {
    await qdrant.getCollections();
    return true;
  } catch {
    return false;
  }
}

export interface ChunkPoint<P extends Record<string, unknown>> {
  id: number;
  vector: number[];
  payload: P;
}

export async function upsertCvChunks(points: ChunkPoint<CvPayload>[]): Promise<void> {
  if (points.length === 0) return;
  await qdrant.upsert(COLL_CV, { wait: true, points });
}

export async function upsertJobChunks(points: ChunkPoint<JobPayload>[]): Promise<void> {
  if (points.length === 0) return;
  await qdrant.upsert(COLL_JOB, { wait: true, points });
}

export async function deleteCvChunks(cvId: number): Promise<void> {
  await qdrant.delete(COLL_CV, {
    filter: { must: [{ key: "cv_id", match: { value: cvId } }] },
    wait: true,
  });
}

export async function deleteJobChunks(jobId: number): Promise<void> {
  await qdrant.delete(COLL_JOB, {
    filter: { must: [{ key: "job_id", match: { value: jobId } }] },
    wait: true,
  });
}

export interface SearchHit<P> {
  id: number;
  score: number;
  payload: P;
}

export async function searchJobs(
  vector: number[],
  topK: number,
  onlyOpen = true
): Promise<SearchHit<JobPayload>[]> {
  const filter = onlyOpen
    ? { must: [{ key: "status", match: { value: "open" } }] }
    : undefined;
  const res = await qdrant.search(COLL_JOB, {
    vector,
    limit: topK,
    filter,
    with_payload: true,
  });
  return res.map((r) => ({
    id: Number(r.id),
    score: r.score,
    payload: r.payload as unknown as JobPayload,
  }));
}

export async function searchCvs(
  vector: number[],
  topK: number,
  specialization?: string
): Promise<SearchHit<CvPayload>[]> {
  const filter = specialization
    ? { must: [{ key: "specialization", match: { value: specialization } }] }
    : undefined;
  const res = await qdrant.search(COLL_CV, {
    vector,
    limit: topK,
    filter,
    with_payload: true,
  });
  return res.map((r) => ({
    id: Number(r.id),
    score: r.score,
    payload: r.payload as unknown as CvPayload,
  }));
}

export async function getVectors(
  collection: typeof COLL_CV | typeof COLL_JOB,
  ids: number[]
): Promise<Map<number, number[]>> {
  if (ids.length === 0) return new Map();
  const res = await qdrant.retrieve(collection, {
    ids,
    with_vector: true,
    with_payload: false,
  });
  const out = new Map<number, number[]>();
  for (const p of res) {
    if (Array.isArray(p.vector)) out.set(Number(p.id), p.vector as number[]);
  }
  return out;
}
