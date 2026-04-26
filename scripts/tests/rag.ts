import "dotenv/config";
import { db } from "../../src/lib/db";
import { ping as pingOllama, listModels } from "../../src/lib/ollama";
import { ping as pingQdrant, qdrant, COLL_CV, COLL_JOB } from "../../src/lib/qdrant";

const BASE = process.env.TEST_BASE_URL ?? "http://localhost:3000";
const STAMP = Date.now();
const SEEKER_EMAIL = `rag-seeker+${STAMP}@example.ph`;
const EMPLOYER_EMAIL = `rag-employer+${STAMP}@example.ph`;
const PASSWORD = "test-password-123";

let passed = 0;
let failed = 0;

function ok(label: string, cond: unknown, detail?: string) {
  if (cond) {
    console.log(`  PASS  ${label}`);
    passed++;
  } else {
    console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
    failed++;
  }
}

function section(label: string) {
  console.log(`\n[${label}]`);
}

const cookies: Record<string, string> = { seeker: "", employer: "" };

function cookieFor(role: "seeker" | "employer", res: Response) {
  const set = res.headers.get("set-cookie");
  if (!set) return;
  const m = set.match(/sm_session=([^;]+)/);
  if (m) cookies[role] = `sm_session=${m[1]}`;
}

async function call(
  role: "seeker" | "employer" | "none",
  method: "GET" | "POST" | "DELETE",
  path: string,
  body?: unknown,
  isForm = false
): Promise<{ res: Response; data: any }> {
  const headers: Record<string, string> = {};
  if (role !== "none" && cookies[role]) headers.cookie = cookies[role];
  let payload: BodyInit | undefined;
  if (body !== undefined) {
    if (isForm) {
      payload = body as FormData;
    } else {
      headers["content-type"] = "application/json";
      payload = JSON.stringify(body);
    }
  }
  const res = await fetch(`${BASE}${path}`, { method, headers, body: payload });
  if (role !== "none") cookieFor(role, res);
  let data: any = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { res, data };
}

const SEEKER_CV = `Lara Magbanua — Frontend Developer

Summary
React and Next.js developer with 5 years of experience building accessible, performant
single-page applications. Strong on TypeScript, Tailwind CSS, design systems, and automated
accessibility testing. Cebu-based, comfortable with hybrid work.

Skills
React, Next.js (App Router), TypeScript, Tailwind CSS, Storybook, Jest, Playwright,
WAI-ARIA, Lighthouse performance budgeting, GitHub Actions, design tokens.

Experience
Senior Frontend Engineer — Cebu BPO (2023–present)
Owns the agent-facing dashboard used by 800 daily agents. Migrated the legacy app to
Next.js with a Tailwind component library documented in Storybook.

Frontend Developer — Manila SaaS Co. (2020–2023)
Implemented the customer onboarding flow. Drove the adoption of accessibility tests in CI.

Education
BS Computer Science, University of the Philippines Cebu, 2020.
`;

const RELEVANT_JOB = {
  title: "Senior Frontend Developer",
  description:
    "Build the agent-facing dashboard for our BPO operation in Cebu City. Own the design system, drive performance and accessibility, mentor mid-level frontend engineers.",
  requirements:
    "5+ years React. TypeScript. Next.js. Tailwind CSS. Storybook. Strong on accessibility (WAI-ARIA) and performance (Lighthouse).",
  qualifications:
    "Bachelor's degree in Computer Science or equivalent. Cebu-based or willing to relocate.",
  location: "Cebu City",
  salary_range: "PHP 80,000 – 120,000",
};

const IRRELEVANT_JOB = {
  title: "Production Line Supervisor",
  description:
    "Supervise day-shift production line of 30 food-processing operators. Own throughput and quality KPIs. Coordinate with QA and maintenance.",
  requirements:
    "3+ years manufacturing supervision. ISO 9001 familiarity. HACCP awareness for food and beverage.",
  qualifications: "Vocational or Bachelor's degree. Cebu-based.",
  location: "Mandaue City",
  salary_range: "PHP 28,000 – 38,000",
};

let seekerId = 0;
let employerId = 0;
let cvId = 0;
let relevantJobId = 0;
let irrelevantJobId = 0;

async function cleanup() {
  for (const email of [SEEKER_EMAIL, EMPLOYER_EMAIL]) {
    db.prepare("DELETE FROM users WHERE email = ?").run(email);
  }
  if (cvId)
    await qdrant
      .delete(COLL_CV, { filter: { must: [{ key: "cv_id", match: { value: cvId } }] }, wait: true })
      .catch(() => undefined);
  for (const jid of [relevantJobId, irrelevantJobId]) {
    if (!jid) continue;
    await qdrant
      .delete(COLL_JOB, { filter: { must: [{ key: "job_id", match: { value: jid } }] }, wait: true })
      .catch(() => undefined);
  }
}

async function main() {
  console.log("Scratch Match — RAG / ingest / match integration test");
  console.log(`base: ${BASE}`);

  section("infrastructure reachable");
  const ollamaUp = await pingOllama();
  const qdrantUp = await pingQdrant();
  ok("Ollama reachable", ollamaUp, "start with: docker compose up -d ollama");
  ok("Qdrant reachable", qdrantUp, "start with: docker compose up -d qdrant");
  if (!ollamaUp || !qdrantUp) {
    console.log("\nSkipping rest of tests — fix infrastructure first.");
    process.exit(1);
  }
  const models = await listModels();
  ok(
    `embed model present (${process.env.OLLAMA_EMBED_MODEL ?? "nomic-embed-text"})`,
    models.some((m) => m.startsWith(process.env.OLLAMA_EMBED_MODEL ?? "nomic-embed-text")),
    "run: npm run setup:models"
  );

  try {
    const r = await fetch(`${BASE}/api/me`);
    ok(`dev server reachable (${BASE})`, r.ok || r.status === 200);
  } catch {
    console.log(`  FAIL  dev server unreachable — start with: npm run dev`);
    process.exit(1);
  }

  section("signup seeker + employer");
  {
    const { res: r1, data: d1 } = await call("none", "POST", "/api/auth/signup", {
      email: SEEKER_EMAIL,
      password: PASSWORD,
      role: "seeker",
    });
    ok("seeker signup 200", r1.status === 200, `got ${r1.status}`);
    cookieFor("seeker", r1);
    seekerId = d1?.id;

    const { res: r2, data: d2 } = await call("none", "POST", "/api/auth/signup", {
      email: EMPLOYER_EMAIL,
      password: PASSWORD,
      role: "employer",
    });
    ok("employer signup 200", r2.status === 200, `got ${r2.status}`);
    cookieFor("employer", r2);
    employerId = d2?.id;
  }

  section("CV ingest (seeker)");
  {
    const form = new FormData();
    form.set("specialization", "Frontend Development");
    form.set("text", SEEKER_CV);
    const { res, data } = await call("seeker", "POST", "/api/seeker/cvs", form, true);
    ok("status 200", res.status === 200, `got ${res.status} ${JSON.stringify(data)}`);
    ok("returns cv_id", typeof data?.cv_id === "number");
    ok("creates ≥1 chunk", typeof data?.chunks === "number" && data.chunks >= 1);
    cvId = data?.cv_id;
  }

  section("DB + Qdrant state after CV ingest");
  {
    const sqlCount = (
      db.prepare("SELECT COUNT(*) AS n FROM cv_chunks WHERE cv_id = ?").get(cvId) as { n: number }
    ).n;
    ok("cv_chunks rows in SQLite", sqlCount >= 1, `found ${sqlCount}`);

    const cnt = await qdrant.count(COLL_CV, {
      filter: { must: [{ key: "cv_id", match: { value: cvId } }] },
      exact: true,
    });
    ok("cv_chunks points in Qdrant", cnt.count === sqlCount, `qdrant=${cnt.count} sqlite=${sqlCount}`);

    const sample = await qdrant.scroll(COLL_CV, {
      filter: { must: [{ key: "cv_id", match: { value: cvId } }] },
      limit: 1,
      with_payload: true,
      with_vector: false,
    });
    const point = sample.points[0];
    ok("payload has cv_id", (point?.payload as any)?.cv_id === cvId);
    ok(
      "payload does NOT contain text (vectors-only invariant)",
      point && !("text" in (point.payload as any))
    );
  }

  section("post relevant + irrelevant jobs (employer)");
  {
    const { res: r1, data: d1 } = await call("employer", "POST", "/api/employer/jobs", RELEVANT_JOB);
    ok("relevant job 200", r1.status === 200, `got ${r1.status}`);
    relevantJobId = d1?.job_id;

    const { res: r2, data: d2 } = await call("employer", "POST", "/api/employer/jobs", IRRELEVANT_JOB);
    ok("irrelevant job 200", r2.status === 200, `got ${r2.status}`);
    irrelevantJobId = d2?.job_id;
  }

  section("match endpoint");
  {
    const { res, data } = await call("seeker", "GET", `/api/seeker/matches/${cvId}`);
    ok("status 200", res.status === 200, `got ${res.status} ${JSON.stringify(data)}`);
    const matches: { job_id: number; score: number; title: string }[] = data?.matches ?? [];
    ok("returns at least one match", matches.length >= 1);

    const ranks = matches.map((m, i) => ({ ...m, rank: i }));
    const relevant = ranks.find((m) => m.job_id === relevantJobId);
    const irrelevant = ranks.find((m) => m.job_id === irrelevantJobId);
    ok("relevant job is in results", !!relevant);
    if (relevant && irrelevant) {
      console.log(
        `        relevant rank=${relevant.rank} score=${relevant.score.toFixed(3)} | ` +
          `irrelevant rank=${irrelevant.rank} score=${irrelevant.score.toFixed(3)}`
      );
      ok(
        "relevant job ranks above irrelevant job",
        relevant.score > irrelevant.score,
        `relevant=${relevant.score.toFixed(3)} irrelevant=${irrelevant.score.toFixed(3)}`
      );
    }
  }

  section("authorization");
  {
    const { res } = await call("employer", "GET", `/api/seeker/matches/${cvId}`);
    ok("employer cannot read seeker matches → 403", res.status === 403, `got ${res.status}`);
  }

  await cleanup();
  console.log(
    `\n${failed === 0 ? "ALL CHECKS PASSED" : "SOME CHECKS FAILED"}  (${passed} passed, ${failed} failed)`
  );
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(async (e) => {
  console.error(e);
  await cleanup().catch(() => undefined);
  process.exit(1);
});
