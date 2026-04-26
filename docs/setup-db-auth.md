# Startup Guide — DB + Auth (Bones)

This guide covers the second slice of Scratch Match: SQLite schema, sessions, signup/login/logout, and the seed scripts. Frontend (the "skin") is already in place; ingestion (the "meat" — Qdrant + Ollama) lands next.

> **Prereqs:** Node.js ≥ 20. Windows native build tools are required for `better-sqlite3` to compile (`npm install` will pull in `node-gyp` and friends).

---

## 1. Install & configure

```bash
npm install
cp .env.example .env
```

Open `.env` and at minimum change `SESSION_SECRET` and `ADMIN_PASSWORD`. The defaults work for local dev but should not be left as-is.

## 2. Initialize the database

The schema is embedded in `src/lib/db.ts` and applied on first connection. Run:

```bash
npm run db:migrate     # creates data/app.db, lists tables
npm run seed:admin     # creates the admin from .env
npm run ingest:sample  # inserts sample seekers, employers, jobs (relational only)
```

Expected after these three commands:

- `data/app.db` exists.
- `db:migrate` prints 7 tables: `users`, `seeker_profiles`, `employer_profiles`, `cvs`, `jobs`, `matches`, `sessions`.
- `seed:admin` says either *created* or *password reset*.
- `ingest:sample` reports 3 seekers, 2 employers, ~2 cvs, 4 jobs.

To start over: `npm run reset` then re-run the three steps above.

## 3. Run the dev server

```bash
npm run dev
```

App at `http://localhost:3000`.

## 4. Manual verification (UI)

1. Visit `/signup`. Register `test@example.ph` / `password123` as Job Seeker. You should land on `/onboarding/seeker`.
2. Hit `/api/me` in the browser — JSON should show your user.
3. Visit `/login` in a private window. Sign in as `admin@scratchmatch.local` / `changeme` (or whatever you set in `.env`). You should land on `/admin`.
4. Try a sample seeker: `maria.santos@example.ph` / `password123`. Lands on `/seeker/dashboard`.
5. Try a sample employer: `hr@cebubpo.example.ph` / `password123`. Lands on `/employer/dashboard`.

> The dashboards still render mock data — that's expected at this milestone. Real data wiring comes next.

## 5. Automated verification

With the dev server running, in a second terminal:

```bash
npm run test:bones
```

This script exercises `signup → /me → logout → login → wrong-password → duplicate-email` against the live API and checks DB state directly. Output should end with `ALL CHECKS PASSED`. Any failed check prints a red `FAIL` line and exits non-zero.

The test script creates and then cleans up a throwaway user (`bones-test+<timestamp>@example.ph`); it does not touch the seeded users.

## 6. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `npm install` fails on `better-sqlite3` | Missing C++ build tools on Windows | Install **Visual Studio Build Tools** with the *Desktop development with C++* workload, then `npm install` again. |
| `db:migrate` errors with `EACCES` / `EBUSY` on `data/app.db` | Dev server is holding the DB | Stop `npm run dev` first, or just re-run — WAL mode usually allows it. |
| `test:bones` shows `ECONNREFUSED` | Dev server not running | Start it with `npm run dev` in another terminal. |
| Login always says "Invalid email or password" | DB was reset but admin not re-seeded | Run `npm run seed:admin`. |
| Signed in but `/api/me` returns `{ user: null }` | Cookie blocked by browser | You must use `localhost` (not `127.0.0.1`) — the cookie is `sameSite=lax` on the localhost origin. |

## 7. What's wired vs. what isn't

**Wired:** users table, session cookies, signup/login/logout API, `/api/me`, login form, signup form, sample data ingestion.

**Not yet:** onboarding forms still POST nowhere (they use `<Link>` to navigate); dashboards read mock data, not the DB; no route-level auth guard yet (you can manually visit `/admin` even when logged out — pages just render). All of these are intentionally deferred to the next slice along with Qdrant + Ollama.
