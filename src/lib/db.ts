import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "app.db");

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('admin','seeker','employer')),
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seeker_profiles (
  user_id          INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name        TEXT NOT NULL,
  about            TEXT,
  specializations  TEXT,
  years_experience INTEGER,
  location         TEXT
);

CREATE TABLE IF NOT EXISTS employer_profiles (
  user_id      INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry     TEXT,
  about        TEXT,
  website      TEXT,
  location     TEXT
);

CREATE TABLE IF NOT EXISTS cvs (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  seeker_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  specialization  TEXT NOT NULL,
  filename        TEXT,
  raw_text        TEXT NOT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_cvs_seeker ON cvs(seeker_id);
CREATE INDEX IF NOT EXISTS idx_cvs_seeker_spec ON cvs(seeker_id, specialization);

CREATE TABLE IF NOT EXISTS cv_chunks (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  cv_id      INTEGER NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  chunk_idx  INTEGER NOT NULL,
  text       TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_cv_chunks_cv ON cv_chunks(cv_id);

CREATE TABLE IF NOT EXISTS jobs (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  employer_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  requirements    TEXT,
  qualifications  TEXT,
  location        TEXT,
  salary_range    TEXT,
  status          TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed')),
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_jobs_employer ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);

CREATE TABLE IF NOT EXISTS job_chunks (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id     INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  chunk_idx  INTEGER NOT NULL,
  text       TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_job_chunks_job ON job_chunks(job_id);

CREATE TABLE IF NOT EXISTS matches (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id      INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  cv_id       INTEGER NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  score       REAL NOT NULL,
  notes       TEXT,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (job_id, cv_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  token       TEXT PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at  DATETIME NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
`;

declare global {
  // eslint-disable-next-line no-var
  var __sm_db: Database.Database | undefined;
}

function init(): Database.Database {
  const conn = new Database(DB_PATH);
  conn.pragma("journal_mode = WAL");
  conn.pragma("foreign_keys = ON");
  conn.exec(SCHEMA);
  return conn;
}

export const db: Database.Database = global.__sm_db ?? init();
if (process.env.NODE_ENV !== "production") global.__sm_db = db;

export type Role = "admin" | "seeker" | "employer";

export interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  role: Role;
  created_at: string;
}
