# Session Log — 2026-04-25

**Project:** Scratch Match — AI-assisted job matcher for Cebu (SDG 8 prototype)
**Participants:** John Andre Yap, Claude (Opus 4.7)
**Outcome:** Design doc + complete UI scaffold (mock data only).

---

## 1. Goals for the Session

1. Produce a design doc for an MVP POC that meets the brief: AI-assisted job matching for Cebu, three roles, RAG advisor, on-premise stack.
2. Scaffold the entire UI — every page accessible, styled to feel "government site + sleek modern."
3. Commit the work cleanly with one branch per major feature, merged back to main.

## 2. Design Document — `docs/DESIGN.md`

A single comprehensive design doc was written covering:

- **Problem & goal** — addressing CV/role mismatch in Cebu's government, educational, and private sectors.
- **Non-goals** — payments, multi-tenancy, mobile native, real-time messaging, anything outside Cebu.
- **Tech stack** — Next.js (App Router) + React + Tailwind, SQLite, Qdrant (Docker), Ollama running Mistral + `nomic-embed-text`, all local.
- **Architecture** — single Next.js process, three external services (SQLite file, Qdrant container, Ollama container).
- **Data model** — SQLite tables: `users`, `seeker_profiles`, `employer_profiles`, `cvs`, `jobs`, `matches`, `sessions`. App-layer enforcement of 5-CV / 5-job quotas.
- **Vector store** — two Qdrant collections (`cv_chunks`, `job_chunks`), 768-dim cosine, 500-token chunks with 50-token overlap. Match aggregation: mean of top-3 chunk scores per CV.
- **Per-feature spec** — auth & onboarding, seeker CV upload + auto-match, RAG advisor, job search, employer job post, hiring assistant, candidate search, admin console.
- **API surface** — sketched the REST endpoints under `/api/...`.
- **Repository layout** — `src/app`, `src/lib` (db, qdrant, ollama, pdf, chunk, auth, rag), `scripts/`, `data/`.
- **Setup instructions** — Linux/macOS and Windows PowerShell variants, with a single `setup.sh` / `setup.ps1` that installs npm deps, brings up Docker services, pulls Ollama models, runs migrations, seeds admin, initializes Qdrant collections.
- **Initial data ingestion** — `npm run ingest:sample` plus a `data/seed/` directory shape for sample CVs, JDs, and users.
- **`.env.example`** — full sample (session secret, DB path, Qdrant + Ollama URLs, model names, limits, RAG knobs).
- **Dependencies** — exact `package.json` deps to install.
- **`docker-compose.yml`** sketch — Qdrant + Ollama with persistent volumes.
- **Risks** — match quality with a 7B local model, fragile PDF parsing, privacy gating of contact info, local-market biases, single-admin recovery.
- **Milestones** — 4-week M1–M4 plan.

## 3. UI Scaffold — `src/`

User direction: *"UI only. All pages accessible. Make it feel like a government site + sleek modern."*

### Design system

- **Palette:** deep navy (`#0a162e` → `#2d56a4`), warm gold (`#d4a017`), parchment off-white (`#f7f5ee`), seal maroon (`#7a1f1f`).
- **Typography:** Times-style serif for headings/wordmark, system sans for body, mono for codes/IDs.
- **Motifs:** navy/gold "gov stripe" hairline at the very top of the page, official-looking seal SVG, "Public Service Notice" eyebrows, parchment grain background, formal breadcrumbs, subtle dividers.
- **Components:** `Header`, `Footer`, `PageHeader` (eyebrow + title + breadcrumbs + actions), `SideNav` (active-state border highlight), `Workspace` (sidebar + main shell), `Stat`, `Seal`, `ChatPanel` (client component with stub demo replies + retrieval surface + suggestion chips).
- **Tailwind tokens** in `tailwind.config.ts`; component classes (`.card`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-gold`, `.input`, `.textarea`, `.label`, `.badge-*`, `.section-title`, `.divider-rule`, `.gov-stripe`, `.bg-parchment-grain`) declared in `src/app/globals.css`.

### Routes implemented

| Audience | Routes |
|---|---|
| Public | `/`, `/login`, `/signup`, `/onboarding/seeker`, `/onboarding/employer`, `/sitemap` |
| Seeker | `/seeker/dashboard`, `/seeker/cvs`, `/seeker/cvs/upload`, `/seeker/matches`, `/seeker/jobs`, `/seeker/jobs/[id]`, `/seeker/chat` |
| Employer | `/employer/dashboard`, `/employer/jobs`, `/employer/jobs/new`, `/employer/candidates`, `/employer/seekers`, `/employer/chat` |
| Admin | `/admin`, `/admin/users`, `/admin/jobs`, `/admin/cvs` |

A `/sitemap` page lists every route with its href for quick demo navigation.

### Page highlights

- **Home** — hero with seal, three role cards, "Three Pillars" section (vectorized matching / RAG advice / local & private), notice strip with "Issued by / Effective / Coverage", CTA.
- **Auth** — formal sign-in card, registration with role picker, gov-style consent checkbox.
- **Onboarding** — split layout (rationale aside + form), specialization, municipality dropdowns scoped to Cebu cities, "why are you here" feeding the advisor's system context.
- **Seeker dashboard** — three stat cards, top matches list, recent advisor questions, service notices.
- **Seeker CVs** — table of CVs with chunk counts, per-specialization quota meter (gold progress bar), upload page with drag-drop region + paste-text fallback + "what happens after upload" sidebar.
- **Seeker matches** — filter bar, ranked job cards with match-percent badges and snippets.
- **Seeker chat** — full-height ChatPanel with retrieval surface and suggestion chips ("Tailor my CV…", "Compare my CV to top Cebu BPO listings", etc.).
- **Employer dashboard / postings / new job** — gov-styled forms, badge-driven status, JD PDF upload region, 5-active-job quota messaging.
- **Employer candidates / seekers / chat** — ranked candidate cards, gated contact info, semantic-search toggle, hiring assistant with scoped retrieval.
- **Admin console** — system health (Qdrant/Ollama/SQLite status), recent activity log, full users/jobs/CVs tables with admin-protected row.

### Mock data only

No backend. Forms submit into navigation, tables render hard-coded rows, and the chat panel (a client component) replies with a clearly-labeled demo response plus a fake retrieval source list — enough to feel out the flow during demos.

## 4. Tooling Notes

- `package.json` originally pinned Next 14 but was bumped during install (Next 16 currently resolved).
- TypeScript paths `@/*` → `src/*`.
- `.gitignore` rewritten with full Node/Next/IDE/OS boilerplate, plus runtime data dirs (`data/app.db`, `data/qdrant`, `data/ollama`).
- Memory files seeded: user profile (handle `apotato369550`, KISS preference) and project summary.

## 5. Version Control Plan (this session)

KISS branch-per-feature flow into a fresh `main`:

1. `chore/repo-init` — `.gitignore` boilerplate.
2. `docs/design-doc` — `docs/DESIGN.md`.
3. `feat/ui-scaffold` — entire UI (Next.js config, Tailwind, all routes & components).
4. `docs/session-log` — this file.

Each feature branch is merged back into `main` with `--no-ff` so the merge commits trace the feature boundaries. Final push is `git push -u origin main` to `https://github.com/apotato369550/scratch-match.git`.

## 6. What's Next

- Wire SQLite + migrations + auth.
- Stand up Qdrant + Ollama via docker-compose; add the embed/chunk pipelines.
- Replace each page's mock data with live API routes.
- Sample-data ingestion script.
- Admin seed script.

---

*Generated at end of session 2026-04-25.*
