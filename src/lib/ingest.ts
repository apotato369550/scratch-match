import { db } from "./db";
import { chunk } from "./chunk";
import { embed } from "./ollama";
import {
  upsertCvChunks,
  upsertJobChunks,
  deleteCvChunks,
  deleteJobChunks,
  type CvPayload,
  type JobPayload,
} from "./qdrant";

export interface IngestCvInput {
  seekerId: number;
  specialization: string;
  filename: string | null;
  rawText: string;
}

export async function ingestCv(input: IngestCvInput): Promise<{ cvId: number; chunkCount: number }> {
  const insert = db
    .prepare(
      "INSERT INTO cvs (seeker_id, specialization, filename, raw_text) VALUES (?, ?, ?, ?)"
    )
    .run(input.seekerId, input.specialization, input.filename, input.rawText);
  const cvId = Number(insert.lastInsertRowid);

  const pieces = chunk(input.rawText);
  if (pieces.length === 0) return { cvId, chunkCount: 0 };

  const insertChunk = db.prepare(
    "INSERT INTO cv_chunks (cv_id, chunk_idx, text) VALUES (?, ?, ?)"
  );
  const chunkRowIds: number[] = [];
  for (let i = 0; i < pieces.length; i++) {
    const r = insertChunk.run(cvId, i, pieces[i]);
    chunkRowIds.push(Number(r.lastInsertRowid));
  }

  const points = [];
  for (let i = 0; i < pieces.length; i++) {
    const vector = await embed(pieces[i]);
    const payload: CvPayload = {
      cv_id: cvId,
      seeker_id: input.seekerId,
      specialization: input.specialization,
    };
    points.push({ id: chunkRowIds[i], vector, payload });
  }
  await upsertCvChunks(points);
  return { cvId, chunkCount: pieces.length };
}

export async function deleteCv(cvId: number): Promise<void> {
  await deleteCvChunks(cvId);
  db.prepare("DELETE FROM cvs WHERE id = ?").run(cvId);
}

export interface IngestJobInput {
  employerId: number;
  title: string;
  description: string;
  requirements: string;
  qualifications: string;
  location: string;
  salaryRange: string;
}

export async function ingestJob(input: IngestJobInput): Promise<{ jobId: number; chunkCount: number }> {
  const insert = db
    .prepare(
      `INSERT INTO jobs
       (employer_id, title, description, requirements, qualifications, location, salary_range)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      input.employerId,
      input.title,
      input.description,
      input.requirements,
      input.qualifications,
      input.location,
      input.salaryRange
    );
  const jobId = Number(insert.lastInsertRowid);

  const composed = [
    `Title: ${input.title}`,
    `Location: ${input.location}`,
    `Description: ${input.description}`,
    `Requirements: ${input.requirements}`,
    `Qualifications: ${input.qualifications}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const pieces = chunk(composed);
  if (pieces.length === 0) return { jobId, chunkCount: 0 };

  const insertChunk = db.prepare(
    "INSERT INTO job_chunks (job_id, chunk_idx, text) VALUES (?, ?, ?)"
  );
  const chunkRowIds: number[] = [];
  for (let i = 0; i < pieces.length; i++) {
    const r = insertChunk.run(jobId, i, pieces[i]);
    chunkRowIds.push(Number(r.lastInsertRowid));
  }

  const points = [];
  for (let i = 0; i < pieces.length; i++) {
    const vector = await embed(pieces[i]);
    const payload: JobPayload = {
      job_id: jobId,
      employer_id: input.employerId,
      status: "open",
      location: input.location || null,
    };
    points.push({ id: chunkRowIds[i], vector, payload });
  }
  await upsertJobChunks(points);
  return { jobId, chunkCount: pieces.length };
}

export async function deleteJob(jobId: number): Promise<void> {
  await deleteJobChunks(jobId);
  db.prepare("DELETE FROM jobs WHERE id = ?").run(jobId);
}
