import "dotenv/config";
import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/password";

type Role = "seeker" | "employer";

interface SampleUser {
  email: string;
  password: string;
  role: Role;
}

interface SampleSeeker extends SampleUser {
  role: "seeker";
  full_name: string;
  about: string;
  specializations: string;
  years_experience: number;
  location: string;
  cvs?: { specialization: string; filename: string; raw_text: string }[];
}

interface SampleEmployer extends SampleUser {
  role: "employer";
  company_name: string;
  industry: string;
  about: string;
  website: string;
  location: string;
  jobs?: {
    title: string;
    description: string;
    requirements: string;
    qualifications: string;
    location: string;
    salary_range: string;
  }[];
}

const seekers: SampleSeeker[] = [
  {
    email: "maria.santos@example.ph",
    password: "password123",
    role: "seeker",
    full_name: "Maria Santos",
    about: "Frontend developer with a focus on accessible interfaces.",
    specializations: "Frontend Development, UI Engineering",
    years_experience: 4,
    location: "Cebu City",
    cvs: [
      {
        specialization: "Frontend Development",
        filename: "maria_santos_frontend.pdf",
        raw_text:
          "Maria Santos — Frontend Developer. 4 years building React + Tailwind apps. Strong on accessibility, performance, and design systems. Previous: Acme Cebu, BPO web team.",
      },
    ],
  },
  {
    email: "juan.dela.cruz@example.ph",
    password: "password123",
    role: "seeker",
    full_name: "Juan dela Cruz",
    about: "Bookkeeper transitioning to data analysis.",
    specializations: "Bookkeeping, Data Analysis",
    years_experience: 6,
    location: "Mandaue City",
    cvs: [
      {
        specialization: "Bookkeeping",
        filename: "juan_bookkeeping.pdf",
        raw_text:
          "Juan dela Cruz — Bookkeeper, 6 years. QuickBooks, Xero, payroll, BIR compliance. Currently studying SQL and Power BI.",
      },
    ],
  },
  {
    email: "ana.reyes@example.ph",
    password: "password123",
    role: "seeker",
    full_name: "Ana Reyes",
    about: "Customer support team lead, BPO industry veteran.",
    specializations: "Customer Support, Team Leadership",
    years_experience: 8,
    location: "Lapu-Lapu City",
  },
];

const employers: SampleEmployer[] = [
  {
    email: "hr@cebubpo.example.ph",
    password: "password123",
    role: "employer",
    company_name: "Cebu BPO Solutions",
    industry: "BPO",
    about: "Cebu-headquartered BPO serving North American and AU clients.",
    website: "https://cebubpo.example.ph",
    location: "Cebu City",
    jobs: [
      {
        title: "Frontend Developer",
        description:
          "Build internal tools and client-facing dashboards using React and Tailwind. Collaborate with product on accessible, performant UIs.",
        requirements: "3+ years React. TypeScript. Tailwind. Comfortable with design systems.",
        qualifications: "Bachelor's degree or equivalent experience. Cebu-based.",
        location: "Cebu City",
        salary_range: "PHP 50,000 – 80,000",
      },
      {
        title: "Customer Support Team Lead",
        description: "Lead a 12-person CS team across two shifts. Coach, schedule, escalate.",
        requirements: "5+ years BPO. 2+ years team lead. Strong English written + spoken.",
        qualifications: "Senior High School minimum; Bachelor's preferred.",
        location: "Cebu City",
        salary_range: "PHP 45,000 – 65,000",
      },
    ],
  },
  {
    email: "careers@visayasmfg.example.ph",
    password: "password123",
    role: "employer",
    company_name: "Visayas Manufacturing Co.",
    industry: "Manufacturing",
    about: "Mid-sized manufacturer, food and beverage processing.",
    website: "https://visayasmfg.example.ph",
    location: "Mandaue City",
    jobs: [
      {
        title: "Bookkeeper",
        description: "Maintain books for two subsidiaries. Coordinate with external auditors quarterly.",
        requirements: "5+ years bookkeeping. Xero or QuickBooks. BIR compliance.",
        qualifications: "Bachelor's in Accountancy or related.",
        location: "Mandaue City",
        salary_range: "PHP 30,000 – 42,000",
      },
      {
        title: "Production Line Supervisor",
        description: "Supervise day-shift production line, ~30 operators. Quality and throughput KPIs.",
        requirements: "3+ years manufacturing supervision. ISO 9001 familiarity.",
        qualifications: "Vocational or Bachelor's. Cebu-based.",
        location: "Mandaue City",
        salary_range: "PHP 28,000 – 38,000",
      },
    ],
  },
];

function upsertUser(email: string, password: string, role: Role): number {
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email) as
    | { id: number }
    | undefined;
  if (existing) return existing.id;
  const r = db
    .prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)")
    .run(email, hashPassword(password), role);
  return Number(r.lastInsertRowid);
}

let seekerCount = 0;
let employerCount = 0;
let cvCount = 0;
let jobCount = 0;

for (const s of seekers) {
  const userId = upsertUser(s.email, s.password, "seeker");
  db.prepare(
    `INSERT OR REPLACE INTO seeker_profiles
     (user_id, full_name, about, specializations, years_experience, location)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(userId, s.full_name, s.about, s.specializations, s.years_experience, s.location);
  seekerCount++;

  for (const cv of s.cvs ?? []) {
    const exists = db
      .prepare("SELECT id FROM cvs WHERE seeker_id = ? AND filename = ?")
      .get(userId, cv.filename);
    if (exists) continue;
    db.prepare(
      "INSERT INTO cvs (seeker_id, specialization, filename, raw_text) VALUES (?, ?, ?, ?)"
    ).run(userId, cv.specialization, cv.filename, cv.raw_text);
    cvCount++;
  }
}

for (const e of employers) {
  const userId = upsertUser(e.email, e.password, "employer");
  db.prepare(
    `INSERT OR REPLACE INTO employer_profiles
     (user_id, company_name, industry, about, website, location)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(userId, e.company_name, e.industry, e.about, e.website, e.location);
  employerCount++;

  for (const j of e.jobs ?? []) {
    const exists = db
      .prepare("SELECT id FROM jobs WHERE employer_id = ? AND title = ?")
      .get(userId, j.title);
    if (exists) continue;
    db.prepare(
      `INSERT INTO jobs
       (employer_id, title, description, requirements, qualifications, location, salary_range)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(
      userId,
      j.title,
      j.description,
      j.requirements,
      j.qualifications,
      j.location,
      j.salary_range
    );
    jobCount++;
  }
}

console.log("Sample data ingested:");
console.log(`  seekers:   ${seekerCount}`);
console.log(`  employers: ${employerCount}`);
console.log(`  cvs:       ${cvCount}`);
console.log(`  jobs:      ${jobCount}`);
console.log("Note: CVs and jobs are inserted as relational rows only.");
console.log("      Embedding + Qdrant ingestion lands in the next milestone.");
