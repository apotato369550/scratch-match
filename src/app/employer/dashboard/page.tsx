import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Workspace, employerNav } from "@/components/Workspace";
import { Stat } from "@/components/Stat";

export default function EmployerDashboard() {
  return (
    <>
      <PageHeader
        eyebrow="Employer"
        title="BlueLeaf Tech — Hiring Console"
        description="Manage postings, review surfaced candidates, and consult the hiring assistant."
        crumbs={[{ label: "Home", href: "/" }, { label: "Employer" }, { label: "Dashboard" }]}
        actions={
          <>
            <Link href="/employer/jobs/new" className="btn-secondary">Post a Job</Link>
            <Link href="/employer/chat" className="btn-primary">Hiring Assistant</Link>
          </>
        }
      />
      <Workspace navTitle="Employer Workspace" nav={employerNav}>
        <div className="grid sm:grid-cols-3 gap-4">
          <Stat label="Active Postings" value={3} hint="2 slots remaining" />
          <Stat label="Candidates Surfaced" value={47} hint="Across all postings" tone="gold" />
          <Stat label="Matches Recorded" value={12} hint="This quarter" tone="seal" />
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Top candidates today</h2>
            <Link href="/employer/candidates" className="text-sm text-navy-800 underline">View all</Link>
          </div>
          <div className="divider-rule my-4" />
          <ul className="divide-y divide-navy-100">
            {[
              { n: "Juan dela Cruz", spec: "Frontend Development", s: 0.92 },
              { n: "Maria Santos", spec: "Frontend Development", s: 0.86 },
              { n: "Pedro Reyes", spec: "Customer Support", s: 0.81 },
            ].map((c, i) => (
              <li key={i} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-navy-900">{c.n}</div>
                  <div className="text-xs text-ink-soft">{c.spec}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge-gold">Fit {(c.s*100).toFixed(0)}%</span>
                  <Link href="/employer/candidates" className="btn-secondary">Review</Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Workspace>
    </>
  );
}
