# Scratch Match — MVP POC Design Doc

**Status:** Draft v0.1
**Scope:** Prototype proof-of-concept
**Locality:** Cebu, Philippines
**Alignment:** UN SDG 8 — Decent Work and Economic Growth

---

## 1. Problem

Cebu has a mismatch between what job seekers carry on their CVs and what employers actually need. Seekers bloat their qualifications hoping something sticks; employers receive piles of irrelevant applications. The result: persistent unemployment and underemployment across government, educational, and private sectors despite open roles.

## 2. Goal

A local, AI-assisted matchmaker that:
1. Matches job seekers to jobs based on real CV content, not keyword spam.
2. Lets employers post and review candidate fits.
3. Gives seekers conversational advice grounded in current Cebu listings.

KISS. Prototype only. Single-machine deploy. No cloud lock-in.

## 3. Non-Goals (MVP)

- Payments, subscriptions, billing.
- Multi-tenancy or cross-region scaling.
- Background-check integrations.
- Mobile native apps.
- Real-time messaging between seeker and employer.
- Anything outside Cebu.

## 4. Users

| Role | Count | Capabilities |
|---|---|---|
| Admin | 1 (seeded) | Manage users, view all data, moderate listings |
| Job Seeker | many | Upload up to 5 CVs/specialization, chat advisor, search jobs |
| Employer | many | Post up to 5 jobs, chat about candidates, search seekers |

## 5. Tech Stack

- **Frontend:** Next.js (App Router) + React + Tailwind. Plain HTML/CSS/JS where simpler.
- **Backend:** Next.js API routes (Node). One process — no microservices.
- **Relational store:** SQLite (single file, `data/app.db`).
- **Vector store:** Qdrant (Docker container).
- **LLM / Embeddings:** Local models served via Ollama (Mistral 7B for chat, `nomic-embed-text` for embeddings). Verbose logging on.
- **PDF parsing:** `pdf-parse` (Node) for CV/JD text extraction.
- **Auth:** session cookies, password hash via `bcrypt`. No OAuth.
- **Container:** `docker compose` for Qdrant + Ollama. App runs on host (`npm run dev`).

## 6. Architecture

```
              ┌──────────────────────────────┐
              │   Next.js (React + API)      │
              │  ┌────────────┐ ┌──────────┐ │
   Browser ──▶│  │  Pages/UI  │ │ /api/*   │ │
              │  └────────────┘ └────┬─────┘ │
              └────────────────────┬─┴───────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
        ┌──────────┐        ┌────────────┐       ┌────────────┐
        │ SQLite   │        │ Qdrant     │       │ Ollama     │
        │ (users,  │        │ (cv_chunks,│       │ (mistral,  │
        │ jobs,    │        │  job_chunks│       │  nomic-    │
        │ sessions)│        │ )          │       │  embed)    │
        └──────────┘        └────────────┘       └────────────┘
```

**Why this split:**
- SQLite holds canonical records and identity. Cheap, file-based, zero ops.
- Qdrant holds chunk embeddings for semantic match + RAG retrieval.
- Ollama keeps everything local — no API keys, no data leaves the machine.

## 7. Data Model (SQLite)

```sql
-- users
id INTEGER PK
email TEXT UNIQUE
password_hash TEXT
role TEXT CHECK(role IN ('admin','seeker','employer'))
created_at DATETIME

-- seeker_profiles
user_id FK
full_name, about, specializations TEXT  -- comma-separated for MVP
years_experience INTEGER
location TEXT       -- Cebu municipality

-- employer_profiles
user_id FK
company_name, industry, about, website TEXT
location TEXT

-- cvs
id PK, seeker_id FK
specialization TEXT
filename TEXT, raw_text TEXT
qdrant_point_ids TEXT  -- JSON array
created_at

-- jobs
id PK, employer_id FK
title, description, requirements, qualifications TEXT
location TEXT, salary_range TEXT
status TEXT CHECK(status IN ('open','closed'))
qdrant_point_ids TEXT
created_at

-- matches  (recorded when employer reviews)
id PK, job_id FK, cv_id FK
score REAL, notes TEXT, created_at

-- sessions
token TEXT PK, user_id FK, expires_at
```

**Constraints enforced in app layer:** ≤5 CVs per (seeker, specialization); ≤5 open jobs per employer.

## 8. Vector Store (Qdrant)

Two collections, both with `nomic-embed-text` (768 dims, cosine):

- `cv_chunks` — payload: `{cv_id, seeker_id, specialization, chunk_idx, text}`
- `job_chunks` — payload: `{job_id, employer_id, chunk_idx, text}`

**Chunking:** ~500 tokens, 50-token overlap. One embed call per chunk.

**Matching:** to find candidates for a job, embed the job's `requirements + qualifications`, query `cv_chunks` (top-K=20), aggregate by `cv_id` (mean of top-3 chunk scores per CV), return ranked CVs. Mirror the reverse for seeker→jobs search.

## 9. Features — Detailed

### 9.1 Auth & Onboarding
- `/signup` chooses role (seeker or employer). Admin is seeded by setup script — no public admin signup.
- After signup, redirect to onboarding form. Seeker: name, location, specializations, years, short "why are you here". Employer: company, industry, location, "what are you hiring for".
- Profile editable later; required complete before using features.

### 9.2 Seeker Feature 1 — CV Upload & Auto-Match
- Upload PDF or paste text. Pick a specialization label (free text or pick existing).
- Backend: parse → chunk → embed → upsert to Qdrant → store `raw_text` in SQLite.
- After ingest, run match against open jobs and show top 10 with score + snippet.
- Limit: 5 CVs per specialization per seeker. UI shows count remaining.

### 9.3 Seeker Feature 2 — Advisor Chat (RAG)
- Chat UI. On each user turn:
  1. Embed the user message.
  2. Query Qdrant: `job_chunks` (top-5) and the seeker's own `cv_chunks` (top-3).
  3. Build prompt: system rules + retrieved snippets + chat history.
  4. Stream from Mistral via Ollama (verbose logs to server console).
- Use cases: "tailor my CV for X", "what jobs fit me", "how should I apply".

### 9.4 Seeker Feature 3 — Job Search
- Plain SQL `LIKE` search over `jobs.title/description/location` with optional semantic toggle that hits Qdrant. Lists only `status='open'`. Click → full job page.

### 9.5 Employer Feature 1 — Post Job
- Form fields: title, description, requirements, qualifications, location, salary (optional). Or upload a JD PDF — same parse pipeline.
- On save: chunk → embed → Qdrant. Limit 5 open jobs.

### 9.6 Employer Feature 2 — Candidate Chat (RAG)
- Same pipeline as 9.3 but retrieval scoped to:
  - `cv_chunks` filtered by `specialization` matching any of the employer's open jobs.
  - `job_chunks` of the employer's own jobs (so the agent knows what they're hiring for).
- "Find me three candidates for Job #2" → agent retrieves, summarizes, links to CV detail pages where the employer can record a match.

### 9.7 Employer Feature 3 — Candidate Search
- Search seeker profiles by specialization, location, years. Optional semantic search over CVs. Privacy: only shows seekers who have at least one CV uploaded; seeker contact email revealed only after employer records a `match`.

### 9.8 Admin
- `/admin` lists users, jobs, CVs. Can deactivate users, delete jobs/CVs (cascades to Qdrant point deletion). View raw match scores for debugging.

## 10. API Surface (sketch)

```
POST /api/auth/signup           {email, password, role}
POST /api/auth/login            {email, password}
POST /api/auth/logout
GET  /api/me

POST /api/seeker/profile
POST /api/seeker/cvs            multipart: file, specialization
GET  /api/seeker/cvs
DELETE /api/seeker/cvs/:id
GET  /api/seeker/matches/:cvId

POST /api/employer/profile
POST /api/employer/jobs
GET  /api/employer/jobs
DELETE /api/employer/jobs/:id
GET  /api/employer/candidates/:jobId
POST /api/employer/matches      {jobId, cvId, notes}

GET  /api/jobs/search?q=&semantic=
GET  /api/seekers/search?...    (employer-only)

POST /api/chat                  {role, message, history}   -> SSE stream

GET  /api/admin/users
DELETE /api/admin/users/:id
```

## 11. Repository Layout

```
scratch-match/
├── docs/
│   └── DESIGN.md                  (this file)
├── docker-compose.yml             (qdrant + ollama)
├── .env.example
├── package.json
├── next.config.js
├── tailwind.config.js
├── scripts/
│   ├── setup.sh                   (linux/mac)
│   ├── setup.ps1                  (windows)
│   ├── seed-admin.ts
│   └── ingest-sample.ts
├── data/
│   └── seed/                      (sample CVs + JDs for demo)
├── src/
│   ├── app/                       (Next.js routes + pages)
│   ├── components/
│   ├── lib/
│   │   ├── db.ts                  (sqlite client + migrations)
│   │   ├── qdrant.ts
│   │   ├── ollama.ts              (chat + embed wrappers)
│   │   ├── pdf.ts
│   │   ├── chunk.ts
│   │   ├── auth.ts
│   │   └── rag.ts
│   └── styles/
└── README.md
```

## 12. Setup Instructions

### 12.1 Prerequisites
- Node.js ≥ 20
- Docker Desktop (for Qdrant + Ollama containers; or install Ollama natively)
- ~10 GB free disk for model weights

### 12.2 First-time setup

**Linux/macOS:**
```bash
git clone <repo> scratch-match && cd scratch-match
cp .env.example .env
bash scripts/setup.sh
```

**Windows (PowerShell):**
```powershell
git clone <repo> scratch-match; cd scratch-match
Copy-Item .env.example .env
./scripts/setup.ps1
```

`setup.sh` / `setup.ps1` performs:
1. `npm install`
2. `docker compose up -d qdrant ollama`
3. Wait for Ollama, then `ollama pull mistral` and `ollama pull nomic-embed-text`
4. `npm run db:migrate` (creates `data/app.db`)
5. `npm run seed:admin` (prompts for admin email/password, or reads from `.env`)
6. `npm run qdrant:init` (creates `cv_chunks` and `job_chunks` collections)

### 12.3 Running

```bash
docker compose up -d        # Qdrant + Ollama
npm run dev                 # Next.js on :3000
```

Logs: Ollama runs verbosely; tail with `docker compose logs -f ollama`.

### 12.4 Initial Data Ingestion

For demo purposes, sample CVs and JDs live in `data/seed/`:
```
data/seed/
├── cvs/         (5 sample CVs as PDFs)
├── jobs/        (5 sample JDs as JSON)
└── users.json   (sample seeker + employer accounts)
```

Run:
```bash
npm run ingest:sample
```

This script:
1. Creates the sample users (idempotent, skips if exists).
2. Inserts sample profiles.
3. Uploads each CV through the same pipeline the API uses (parse → chunk → embed → Qdrant + SQLite).
4. Posts each sample job similarly.
5. Prints a summary of records and Qdrant point counts.

To wipe and re-ingest:
```bash
npm run reset    # drops app.db, recreates Qdrant collections
npm run ingest:sample
```

## 13. `.env.example`

```dotenv
# App
NODE_ENV=development
PORT=3000
SESSION_SECRET=change-me-to-a-long-random-string

# SQLite
DATABASE_URL=file:./data/app.db

# Qdrant
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=

# Ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_CHAT_MODEL=mistral
OLLAMA_EMBED_MODEL=nomic-embed-text
OLLAMA_VERBOSE=true

# Seeded admin (used by scripts/seed-admin.ts)
ADMIN_EMAIL=admin@scratchmatch.local
ADMIN_PASSWORD=changeme

# Limits
MAX_CVS_PER_SPECIALIZATION=5
MAX_OPEN_JOBS_PER_EMPLOYER=5

# RAG
CHUNK_SIZE_TOKENS=500
CHUNK_OVERLAP_TOKENS=50
RAG_TOP_K_JOBS=5
RAG_TOP_K_CVS=3
```

## 14. Dependency Installation

`package.json` (key deps):

```json
{
  "dependencies": {
    "next": "^14",
    "react": "^18",
    "react-dom": "^18",
    "tailwindcss": "^3",
    "better-sqlite3": "^11",
    "bcryptjs": "^2",
    "@qdrant/js-client-rest": "^1.9",
    "pdf-parse": "^1.1",
    "zod": "^3"
  },
  "devDependencies": {
    "typescript": "^5",
    "tsx": "^4",
    "@types/node": "^20"
  }
}
```

Install:
```bash
npm install
```

Ollama models (one-time, run after `docker compose up`):
```bash
docker exec -it scratch-match-ollama ollama pull mistral
docker exec -it scratch-match-ollama ollama pull nomic-embed-text
```

## 15. `docker-compose.yml` (sketch)

```yaml
services:
  qdrant:
    image: qdrant/qdrant:latest
    ports: ["6333:6333"]
    volumes: ["./data/qdrant:/qdrant/storage"]

  ollama:
    image: ollama/ollama:latest
    container_name: scratch-match-ollama
    ports: ["11434:11434"]
    volumes: ["./data/ollama:/root/.ollama"]
```

## 16. Risks & Open Questions

- **Match quality** with a 7B local model is unknown — may need reranking or larger embed model. Acceptable for POC; revisit if demos look weak.
- **PDF parsing** is fragile. Scanned-image CVs won't extract — flag and ask seeker to paste text instead. No OCR in MVP.
- **Privacy.** Seeker contact info gated behind `match` record. No PII export. Local-only deployment means data doesn't leave the operator's machine.
- **Bias.** RAG over real listings will reflect Cebu market biases (gendered language, age limits common locally). Out-of-scope to fix in POC; document the limitation in the README.
- **One admin account.** If lost, recover by re-running `seed-admin.ts` against the SQLite file.

## 17. Milestones

1. **M1 — skeleton (week 1):** Next.js scaffold, Tailwind, SQLite + migrations, auth, role-based layout shells.
2. **M2 — ingestion (week 2):** Docker compose, Ollama wrappers, PDF parse, chunk, Qdrant collections, CV upload end-to-end.
3. **M3 — matching + chat (week 3):** Job posting, match endpoint, RAG chat for seeker and employer.
4. **M4 — search + admin (week 4):** Job/seeker search, admin pages, sample data, polish, demo script.

---

*End of design doc.*
