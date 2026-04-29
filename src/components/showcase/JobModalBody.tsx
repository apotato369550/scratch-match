import type { ShowcaseJob } from "@/lib/showcase";

export function JobModalBody({ job, score }: { job: ShowcaseJob; score?: number }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {typeof score === "number" && (
          <span className="badge-gold">Match {(score * 100).toFixed(0)}%</span>
        )}
        <span className="badge-muted">{job.location}</span>
        <span className="badge-muted">{job.salary_range}</span>
        <span className="badge-muted">{job.employment_type}</span>
      </div>

      <Section title="Summary">
        <p className="text-lg text-navy-900 leading-relaxed">{job.summary}</p>
      </Section>

      <Section title="Description">
        {job.description.split("\n\n").map((p, i) => (
          <p key={i} className="text-base text-ink-soft leading-relaxed mb-3 last:mb-0">
            {p}
          </p>
        ))}
      </Section>

      <Section title="Responsibilities">
        <ul className="list-disc pl-5 space-y-1.5 text-base text-ink-soft leading-relaxed">
          {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </Section>

      <Section title="Requirements">
        <ul className="list-disc pl-5 space-y-1.5 text-base text-ink-soft leading-relaxed">
          {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </Section>

      <Section title="Qualifications">
        <ul className="list-disc pl-5 space-y-1.5 text-base text-ink-soft leading-relaxed">
          {job.qualifications.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </Section>

      <Section title="Benefits">
        <ul className="list-disc pl-5 space-y-1.5 text-base text-ink-soft leading-relaxed">
          {job.benefits.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </Section>

      <div className="text-xs text-navy-700">
        Posted {job.posted_at} · {job.applicants} applicants surfaced · Reference SM-{job.id}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-gold-600 mb-2">{title}</div>
      {children}
    </div>
  );
}
