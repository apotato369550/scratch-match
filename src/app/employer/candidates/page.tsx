import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Workspace, employerNav } from "@/components/Workspace";

const candidates = [
  { id: 1, n: "Juan dela Cruz", spec: "Frontend Development", loc: "Cebu City", yrs: 3, s: 0.92, snippet: "React + TypeScript portfolio with 4 shipped dashboards." },
  { id: 2, n: "Maria Santos", spec: "Frontend Development", loc: "Mandaue", yrs: 4, s: 0.86, snippet: "Senior front-end at a local BPO; led a Tailwind migration." },
  { id: 3, n: "Pedro Reyes", spec: "Customer Support", loc: "Lapu-Lapu", yrs: 2, s: 0.81, snippet: "Tier-2 SaaS support; trilingual (Cebuano/English/Tagalog)." },
  { id: 4, n: "Anna Lim", spec: "Frontend Development", loc: "Talisay", yrs: 1, s: 0.74, snippet: "Bootcamp graduate, two strong open-source contributions." },
];

export default function Candidates() {
  return (
    <>
      <PageHeader
        eyebrow="Employer"
        title="Candidates"
        description="Auto-ranked seekers per posting. Contact information is revealed once you record a match."
        crumbs={[{ label: "Home", href: "/" }, { label: "Employer", href: "/employer/dashboard" }, { label: "Candidates" }]}
      />
      <Workspace navTitle="Employer Workspace" nav={employerNav}>
        <div className="card p-4 flex flex-wrap items-center gap-3">
          <select className="select max-w-xs">
            <option>For: Frontend Engineer</option>
            <option>For: QA Tester</option>
            <option>For: Office Assistant</option>
          </select>
          <select className="select max-w-xs">
            <option>Sort: Fit score</option>
            <option>Sort: Years of experience</option>
          </select>
          <span className="ml-auto text-xs text-navy-700">{candidates.length} surfaced</span>
        </div>
        <ul className="space-y-3">
          {candidates.map((c) => (
            <li key={c.id} className="card p-5 flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-lg text-navy-900">{c.n}</h3>
                  <span className="badge-gold">Fit {(c.s*100).toFixed(0)}%</span>
                </div>
                <div className="text-xs text-ink-soft mt-0.5">{c.spec} · {c.loc} · {c.yrs} yrs experience</div>
                <p className="text-sm mt-2 text-ink-soft">{c.snippet}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/employer/chat" className="btn-secondary">Ask assistant</Link>
                <button className="btn-primary">Record match</button>
              </div>
            </li>
          ))}
        </ul>
      </Workspace>
    </>
  );
}
