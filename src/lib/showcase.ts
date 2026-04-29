import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "data", "showcase");

export type ShowcaseCv = {
  id: number;
  seeker_id: number;
  seeker_name: string;
  specialization: string;
  filename: string;
  uploaded_at: string;
  chunks: number;
  headline: string;
  summary: string;
  skills: string[];
  experience: { title: string; company: string; location: string; period: string; details: string }[];
  education: { degree: string; school: string; year: number }[];
  languages: string[];
  links: string[];
  full_text: string;
};

export type ShowcaseJob = {
  id: number;
  employer_id: number;
  title: string;
  company: string;
  location: string;
  salary_range: string;
  employment_type: string;
  status: "open" | "closed";
  posted_at: string;
  applicants: number;
  tags: string[];
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  qualifications: string[];
  benefits: string[];
};

export type ShowcaseSeeker = {
  id: number;
  name: string;
  email: string;
  location: string;
  primary_specialization: string;
  years_experience: number;
  cv_count: number;
  headline: string;
  bio: string;
  cv_ids: number[];
};

export type ShowcaseMatch = {
  cv_id: number;
  job_id: number;
  score: number;
  rationale: string;
};

function load<T>(name: string): T {
  return JSON.parse(fs.readFileSync(path.join(DIR, name), "utf-8")) as T;
}

export function getShowcaseCvs(): ShowcaseCv[] {
  return load<ShowcaseCv[]>("cvs.json");
}

export function getShowcaseCv(id: number): ShowcaseCv | undefined {
  return getShowcaseCvs().find((c) => c.id === id);
}

export function getShowcaseJobs(): ShowcaseJob[] {
  return load<ShowcaseJob[]>("jobs.json");
}

export function getShowcaseJob(id: number): ShowcaseJob | undefined {
  return getShowcaseJobs().find((j) => j.id === id);
}

export function getShowcaseSeekers(): ShowcaseSeeker[] {
  return load<ShowcaseSeeker[]>("seekers.json");
}

export function getShowcaseSeeker(id: number): ShowcaseSeeker | undefined {
  return getShowcaseSeekers().find((s) => s.id === id);
}

export function getShowcaseMatches(): ShowcaseMatch[] {
  return load<ShowcaseMatch[]>("matches.json");
}

/** Matches for a given seeker, joined with their best CV per job. */
export function getMatchesForSeeker(seekerId: number) {
  const cvs = getShowcaseCvs().filter((c) => c.seeker_id === seekerId);
  const cvIds = new Set(cvs.map((c) => c.id));
  const matches = getShowcaseMatches().filter((m) => cvIds.has(m.cv_id));
  const jobs = new Map(getShowcaseJobs().map((j) => [j.id, j]));
  // Pick the best score per job
  const bestPerJob = new Map<number, ShowcaseMatch>();
  for (const m of matches) {
    const cur = bestPerJob.get(m.job_id);
    if (!cur || m.score > cur.score) bestPerJob.set(m.job_id, m);
  }
  return Array.from(bestPerJob.values())
    .map((m) => ({
      match: m,
      job: jobs.get(m.job_id)!,
      cv: cvs.find((c) => c.id === m.cv_id)!,
    }))
    .filter((r) => r.job)
    .sort((a, b) => b.match.score - a.match.score);
}

/** Candidate seekers ranked for a given job, with the CV that scored. */
export function getCandidatesForJob(jobId: number) {
  const matches = getShowcaseMatches().filter((m) => m.job_id === jobId);
  const cvs = new Map(getShowcaseCvs().map((c) => [c.id, c]));
  const seekers = new Map(getShowcaseSeekers().map((s) => [s.id, s]));
  return matches
    .map((m) => {
      const cv = cvs.get(m.cv_id);
      if (!cv) return null;
      const seeker = seekers.get(cv.seeker_id);
      if (!seeker) return null;
      return { match: m, cv, seeker };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.match.score - a.match.score);
}
