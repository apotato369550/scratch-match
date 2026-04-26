# Startup Guide — RAG Pipeline (Meat)

This guide covers the third slice: Qdrant + Ollama infrastructure, the chunk → embed → index pipeline, the CV/job ingest endpoints, and the match endpoint. Builds on the [DB + Auth guide](./setup-db-auth.md).

> **Schema change in this slice.** The `qdrant_point_ids` JSON columns on `cvs`/`jobs` are gone — chunks now live in their own SQLite tables (`cv_chunks`, `job_chunks`), and Qdrant points reference them by row id. **You must reset the DB** when pulling this slice:
>
> ```bash
> npm run reset
> ```

---

## 1. Prerequisites

- Everything from the previous slice (Node 22, install, `.env`).
- **Docker Desktop** running.
- ~10 GB free disk for Ollama model weights (`mistral` ≈ 4 GB, `nomic-embed-text` ≈ 270 MB).
- Existing `.env` already covers `QDRANT_URL`, `OLLAMA_URL`, `OLLAMA_CHAT_MODEL`, `OLLAMA_EMBED_MODEL` — no edits needed unless you've changed defaults.

## 2. One-time setup

```bash
docker compose up -d              # starts qdrant + ollama
npm install                       # picks up @qdrant/js-client-rest + pdf-parse
npm run reset                     # drops old DB so the new schema applies
npm run db:migrate                # rebuilds tables (incl. cv_chunks, job_chunks)
npm run seed:admin
npm run setup:models              # pulls mistral + nomic-embed-text
npm run qdrant:init               # creates cv_chunks + job_chunks collections
```

`setup:models` is the slow one — first-time model pulls take a few minutes per model on a typical home connection. You only do this once; the weights persist in `data/ollama/`.

Verify infra is up:
```bash
curl http://localhost:6333/collections   # Qdrant: should list cv_chunks, job_chunks
curl http://localhost:11434/api/tags     # Ollama: should list installed models
```

## 3. Sample data

```bash
npm run ingest:sample
```

This run is real now — it actually chunks, embeds, and upserts into Qdrant. Expect ~10–20 seconds per CV/job depending on your CPU. Output:

```
  CV maria_santos_frontend.pdf: 2 chunks
  CV juan_bookkeeping.pdf: 2 chunks
  …
  Job Frontend Developer: 1 chunks
  Job Senior Bookkeeper: 1 chunks
  …

Sample data ingested:
  seekers:   3
  employers: 2
  cvs:       3
  jobs:      4
```

The script is idempotent on the **users/profiles/cvs/jobs** rows (skips if already present), but if you reset Qdrant separately you'll want a `npm run reset && npm run ingest:sample` to keep SQLite and Qdrant aligned.

## 4. Manual verification (UI)

1. `npm run dev`
2. Visit `/login`, sign in as `maria.santos@example.ph` / `password123`.
3. Visit `/seeker/cvs/upload`. Specialization "Frontend Development", paste any CV-shaped text (≥100 chars), submit.
4. You should be redirected to `/seeker/matches?cv=<id>`. (The page itself still shows mock data — wiring it to the live `/api/seeker/matches/:cvId` is a later UI slice.)
5. Confirm the round-trip directly:
   ```bash
   curl -s -b "sm_session=$TOKEN" http://localhost:3000/api/seeker/matches/<cv_id> | jq
   ```
   You should see ranked jobs with scores in `[0, 1]`. Frontend-flavored jobs should score higher than manufacturing roles.

## 5. Automated verification

```bash
npm run dev          # in one terminal
npm run test:rag     # in another
```

`test:rag` does the full round-trip:

1. Pings Qdrant + Ollama, checks the embed model is installed.
2. Signs up a fresh seeker and a fresh employer.
3. Uploads a frontend-flavored CV via `/api/seeker/cvs`.
4. Asserts SQLite `cv_chunks` count matches Qdrant point count for that CV.
5. **Asserts the Qdrant payload contains no `text` field** (vectors-only invariant).
6. Posts one *relevant* job (frontend dev) and one *irrelevant* job (production supervisor).
7. Calls `/api/seeker/matches/<cvId>` and asserts the relevant job outranks the irrelevant one by similarity score.
8. Checks an employer cannot read another seeker's matches (403).
9. Cleans up the two test users + their Qdrant points.

To run both bones and meat at once: `npm run test`.

## 6. Operating the pipeline

### Where the parts live

| Concern | File |
|---|---|
| SQLite client + schema | `src/lib/db.ts` |
| Chunking (~500 tokens, 50 overlap) | `src/lib/chunk.ts` |
| PDF text extraction | `src/lib/pdf.ts` |
| Ollama embed/chat client | `src/lib/ollama.ts` |
| Qdrant client + filters | `src/lib/qdrant.ts` |
| Shared CV/job ingest pipeline | `src/lib/ingest.ts` |
| Matching aggregation | `src/lib/match.ts` |
| Upload route | `src/app/api/seeker/cvs/route.ts` |
| Match route | `src/app/api/seeker/matches/[cvId]/route.ts` |
| Job post route | `src/app/api/employer/jobs/route.ts` |

### Tuning knobs (`.env`)

- `CHUNK_SIZE_TOKENS=500`, `CHUNK_OVERLAP_TOKENS=50` — chunking. Word-count, not BPE; safe-ish under the model's context.
- `RAG_TOP_K_JOBS=5`, `RAG_TOP_K_CVS=3` — for the chat advisor (used in the next slice).
- Match retrieval is hard-coded for now: top-20 per chunk, mean of top-3 chunk scores per job.
- `MAX_CVS_PER_SPECIALIZATION=5`, `MAX_OPEN_JOBS_PER_EMPLOYER=5` — quotas enforced in the API routes.

### The vectors-only invariant

Qdrant point payloads carry **only filterable scalars** (`cv_id`, `seeker_id`, `specialization` for CV chunks; `job_id`, `employer_id`, `status`, `location` for job chunks). The chunk text lives in SQLite (`cv_chunks.text`, `job_chunks.text`). The chunk row's primary key **is** the Qdrant point id — that's the seam between the two stores.

Practical implication: never store anything in Qdrant payload that you wouldn't put in a B-tree index. If you need to display chunk text, hydrate it from SQLite by joining on the returned point ids.

### Data lifecycle

- **Add**: `ingestCv` / `ingestJob` write the parent row, write chunk rows, embed each chunk, upsert into Qdrant.
- **Delete**: `deleteCv` / `deleteJob` remove Qdrant points by `cv_id`/`job_id` filter, then SQL `DELETE` cascades to chunk rows.
- **Re-embed everything**: `npm run reset && npm run db:migrate && npm run qdrant:init && npm run ingest:sample`.

## 7. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `Ollama embed returned unexpected vector length` | Wrong embed model active | Check `OLLAMA_EMBED_MODEL` is `nomic-embed-text` (768-dim). |
| `Qdrant not reachable` from any script | Container down | `docker compose up -d qdrant` |
| First embed call hangs for tens of seconds | Cold model load on Ollama | Normal once. Subsequent calls are fast. |
| `PdfTooSparseError` | Scanned image PDF, no extractable text | Paste the CV text instead — no OCR in MVP. |
| `npm run ingest:sample` re-runs but creates 0 new rows | Idempotency — it skipped existing CVs/jobs | Run `npm run reset` first to start clean. |
| Match endpoint returns `[]` | Qdrant collections empty (DB and Qdrant out of sync) | Reset and re-ingest. |
| `test:rag` fails on "relevant ranks above irrelevant" | Mistral/nomic not yet warm, or chunks too small | Re-run; if persistent, increase the test CV/job text length. |

## 8. What's wired vs. what isn't

**Wired:** Qdrant collections, Ollama embed pipeline, CV upload (PDF or pasted text), job posting, ranked matches via `/api/seeker/matches/:cvId`, quotas (5 CVs/spec, 5 open jobs/employer), CV deletion with Qdrant cleanup.

**Not yet:** RAG chat (advisor + hiring assistant) — embedding pipeline is here, but the streaming chat route + ChatPanel wiring is the next slice. Pages that list CVs/matches/jobs still render mock data; rewiring them to the live API routes is a UI follow-up.
