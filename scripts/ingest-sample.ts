import "dotenv/config";
import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/password";
import { ingestCv, ingestJob } from "../src/lib/ingest";
import { ping as pingOllama } from "../src/lib/ollama";
import { ping as pingQdrant, ensureCollections } from "../src/lib/qdrant";

interface SampleSeeker {
  email: string;
  full_name: string;
  about: string;
  specializations: string;
  years_experience: number;
  location: string;
  cvs: { specialization: string; filename: string; raw_text: string }[];
}

interface SampleEmployer {
  email: string;
  company_name: string;
  industry: string;
  about: string;
  website: string;
  location: string;
  jobs: {
    title: string;
    description: string;
    requirements: string;
    qualifications: string;
    location: string;
    salary_range: string;
  }[];
}

const PASSWORD = "password123";

const seekers: SampleSeeker[] = [
  {
    email: "maria.santos@example.ph",
    full_name: "Maria Santos",
    about: "Frontend developer with a focus on accessible interfaces.",
    specializations: "Frontend Development, UI Engineering",
    years_experience: 4,
    location: "Cebu City",
    cvs: [
      {
        specialization: "Frontend Development",
        filename: "maria_santos_frontend.pdf",
        raw_text: `Maria Santos — Senior Frontend Developer

Summary
Frontend developer with 4 years of experience building React, TypeScript, and Tailwind CSS
applications. Strong on accessibility (WCAG 2.1 AA), web performance, and design systems.
Worked on internal tools, customer dashboards, and SaaS products for BPO and fintech clients
in Cebu City and Manila.

Skills
React, TypeScript, Next.js, Tailwind CSS, Storybook, Jest, Playwright, GitHub Actions,
WAI-ARIA, design tokens, performance budgeting, Lighthouse, axe-core.

Experience
Frontend Engineer — Acme Cebu BPO (2024–present)
Built an agent-facing dashboard in React/Next.js used by 600 daily agents. Migrated the legacy
Bootstrap UI to Tailwind with a documented component library. Cut Largest Contentful Paint
from 4.2s to 1.6s via code splitting and image optimization.

Junior Frontend Developer — Visayan Fintech Co. (2022–2024)
Implemented the customer onboarding flow. Owned the design-system Storybook. Drove the
adoption of automated accessibility tests in CI.

Education
BS Computer Science, University of San Carlos, Cebu City, 2022.
        `,
      },
    ],
  },
  {
    email: "juan.dela.cruz@example.ph",
    full_name: "Juan dela Cruz",
    about: "Bookkeeper transitioning to data analysis.",
    specializations: "Bookkeeping, Data Analysis",
    years_experience: 6,
    location: "Mandaue City",
    cvs: [
      {
        specialization: "Bookkeeping",
        filename: "juan_bookkeeping.pdf",
        raw_text: `Juan dela Cruz — Senior Bookkeeper

Summary
Bookkeeper with 6 years of experience handling full-cycle accounting for SMEs in Cebu.
Strong on QuickBooks Online and Xero, BIR compliance (VAT, withholding, expanded
withholding, 2307s), payroll processing, and bank reconciliations. Currently up-skilling
in SQL and Power BI to move into a data-analysis role.

Skills
QuickBooks Online, Xero, MS Excel (advanced), Pivot Tables, Power Query, SQL (basic),
Power BI (basic), BIR e-filing, Philippine GAAP, payroll computation, government remittances
(SSS, PhilHealth, Pag-IBIG).

Experience
Senior Bookkeeper — Visayas Manufacturing Co. (2021–present)
Owns books for two subsidiaries. Coordinates quarterly with external auditors. Reduced
month-end close from 12 days to 5.

Bookkeeper — Cebu Foods Trading (2018–2021)
Full-cycle bookkeeping for a 40-employee food distribution company. BIR audit lead for 2020.

Education
BS Accountancy, Cebu Technological University, 2018.
        `,
      },
    ],
  },
  {
    email: "ana.reyes@example.ph",
    full_name: "Ana Reyes",
    about: "Customer support team lead, BPO industry veteran.",
    specializations: "Customer Support, Team Leadership",
    years_experience: 8,
    location: "Lapu-Lapu City",
    cvs: [
      {
        specialization: "Customer Support",
        filename: "ana_reyes_cs.pdf",
        raw_text: `Ana Reyes — Customer Support Team Lead

Summary
Eight years in BPO customer support, last three as a team lead managing 12 agents across
two shifts for an Australian telco account. Strong on coaching, KPI ownership (CSAT, AHT,
FCR), escalation handling, and shift scheduling. Cebu-based, comfortable on graveyard.

Skills
Coaching and feedback, KPI dashboards, Zendesk, Salesforce Service Cloud, Genesys,
schedule adherence, escalation management, English (native-like fluency), Cebuano,
Tagalog.

Experience
Team Lead — Lapu-Lapu BPO Hub (2022–present)
Led a 12-agent team servicing an AU telco. Lifted team CSAT from 78% to 91% in 18 months.
Owns shift scheduling and coaching plans.

Senior Agent — Cebu BPO Solutions (2018–2022)
Top-quartile agent for 14 consecutive months. Mentor for 6 new hires.

Education
BS Tourism, University of Cebu, 2017.
        `,
      },
    ],
  },
];

const employers: SampleEmployer[] = [
  {
    email: "hr@cebubpo.example.ph",
    company_name: "Cebu BPO Solutions",
    industry: "BPO",
    about: "Cebu-headquartered BPO serving North American and AU clients.",
    website: "https://cebubpo.example.ph",
    location: "Cebu City",
    jobs: [
      {
        title: "Frontend Developer",
        description:
          "Build internal tools and client-facing dashboards using React, Next.js, and Tailwind CSS. Collaborate with product on accessible, performant UIs serving up to 600 concurrent agents.",
        requirements:
          "3+ years of React. TypeScript. Tailwind CSS. Comfortable owning a design system. Familiarity with Storybook, Jest, accessibility testing.",
        qualifications:
          "Bachelor's degree in Computer Science or equivalent experience. Cebu-based or willing to relocate.",
        location: "Cebu City",
        salary_range: "PHP 50,000 – 80,000",
      },
      {
        title: "Customer Support Team Lead",
        description:
          "Lead a 12-person customer support team across two shifts for an AU telco account. Coach agents, manage shift schedules, handle escalations, and own CSAT/AHT KPIs.",
        requirements:
          "5+ years BPO. 2+ years team-lead experience. Strong written and spoken English. Comfortable on graveyard shift.",
        qualifications: "Senior High School minimum; Bachelor's preferred.",
        location: "Cebu City",
        salary_range: "PHP 45,000 – 65,000",
      },
    ],
  },
  {
    email: "careers@visayasmfg.example.ph",
    company_name: "Visayas Manufacturing Co.",
    industry: "Manufacturing",
    about: "Mid-sized manufacturer, food and beverage processing.",
    website: "https://visayasmfg.example.ph",
    location: "Mandaue City",
    jobs: [
      {
        title: "Senior Bookkeeper",
        description:
          "Maintain full-cycle books for two subsidiaries. Coordinate quarterly with external auditors. Own BIR compliance (VAT, withholding, 2307s) and government remittances.",
        requirements:
          "5+ years bookkeeping. QuickBooks Online or Xero. Strong on BIR compliance and Philippine GAAP. Excel advanced.",
        qualifications: "Bachelor's in Accountancy or related field.",
        location: "Mandaue City",
        salary_range: "PHP 30,000 – 42,000",
      },
      {
        title: "Production Line Supervisor",
        description:
          "Supervise day-shift production line of approximately 30 operators. Own quality and throughput KPIs. Coordinate with QA and maintenance.",
        requirements: "3+ years manufacturing supervision. ISO 9001 familiarity.",
        qualifications: "Vocational or Bachelor's degree. Cebu-based.",
        location: "Mandaue City",
        salary_range: "PHP 28,000 – 38,000",
      },
    ],
  },
];

function upsertUser(email: string, role: "seeker" | "employer"): number {
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email) as
    | { id: number }
    | undefined;
  if (existing) return existing.id;
  const r = db
    .prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)")
    .run(email, hashPassword(PASSWORD), role);
  return Number(r.lastInsertRowid);
}

async function main() {
  if (!(await pingQdrant())) {
    console.error("Qdrant not reachable. Bring it up: docker compose up -d qdrant");
    process.exit(1);
  }
  if (!(await pingOllama())) {
    console.error("Ollama not reachable. Bring it up: docker compose up -d ollama");
    process.exit(1);
  }
  await ensureCollections();

  let seekerCount = 0;
  let employerCount = 0;
  let cvCount = 0;
  let jobCount = 0;

  for (const s of seekers) {
    const userId = upsertUser(s.email, "seeker");
    db.prepare(
      `INSERT OR REPLACE INTO seeker_profiles
       (user_id, full_name, about, specializations, years_experience, location)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(userId, s.full_name, s.about, s.specializations, s.years_experience, s.location);
    seekerCount++;

    for (const cv of s.cvs) {
      const exists = db
        .prepare("SELECT id FROM cvs WHERE seeker_id = ? AND filename = ?")
        .get(userId, cv.filename);
      if (exists) continue;
      const r = await ingestCv({
        seekerId: userId,
        specialization: cv.specialization,
        filename: cv.filename,
        rawText: cv.raw_text,
      });
      console.log(`  CV ${cv.filename}: ${r.chunkCount} chunks`);
      cvCount++;
    }
  }

  for (const e of employers) {
    const userId = upsertUser(e.email, "employer");
    db.prepare(
      `INSERT OR REPLACE INTO employer_profiles
       (user_id, company_name, industry, about, website, location)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(userId, e.company_name, e.industry, e.about, e.website, e.location);
    employerCount++;

    for (const j of e.jobs) {
      const exists = db
        .prepare("SELECT id FROM jobs WHERE employer_id = ? AND title = ?")
        .get(userId, j.title);
      if (exists) continue;
      const r = await ingestJob({
        employerId: userId,
        title: j.title,
        description: j.description,
        requirements: j.requirements,
        qualifications: j.qualifications,
        location: j.location,
        salaryRange: j.salary_range,
      });
      console.log(`  Job ${j.title}: ${r.chunkCount} chunks`);
      jobCount++;
    }
  }

  console.log("\nSample data ingested:");
  console.log(`  seekers:   ${seekerCount}`);
  console.log(`  employers: ${employerCount}`);
  console.log(`  cvs:       ${cvCount}`);
  console.log(`  jobs:      ${jobCount}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
