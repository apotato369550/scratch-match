import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Workspace, seekerNav } from "@/components/Workspace";

const matches = [
  { id: 1, t: "Frontend Engineer", c: "BlueLeaf Tech", loc: "Cebu City", s: 0.91, sal: "₱35k–₱55k", snippet: "React, TypeScript, Tailwind. 2+ years exp." },
  { id: 2, t: "Customer Success Officer", c: "MariaSoft", loc: "Mandaue", s: 0.84, sal: "₱28k–₱40k", snippet: "B2B SaaS support, English fluency, shifting." },
  { id: 3, t: "Junior Web Developer", c: "Province of Cebu — IT Office", loc: "Cebu City", s: 0.79, sal: "SG-11", snippet: "Govt office, day shift, contract-of-service." },
  { id: 4, t: "QA Tester", c: "Reefside Labs", loc: "Lapu-Lapu", s: 0.74, sal: "₱25k–₱35k", snippet: "Manual + light Playwright automation." },
  { id: 5, t: "Helpdesk Associate", c: "Cebu Provincial Hospital", loc: "Talisay", s: 0.66, sal: "SG-6", snippet: "Tier-1 support, walk-in users, Mon–Sat." },
];

export default function Matches() {
  return (
    <>
      <PageHeader
        eyebrow="Job Seeker"
        title="Your Matches"
        description="Auto-ranked from your most recent CV in each specialization."
        crumbs={[{ label: "Home", href: "/" }, { label: "Seeker", href: "/seeker/dashboard" }, { label: "Matches" }]}
      />
      <Workspace navTitle="Seeker Workspace" nav={seekerNav}>
        <div className="card p-4 flex flex-wrap items-center gap-3">
          <select className="select max-w-xs">
            <option>All specializations</option>
            <option>Frontend Development</option>
            <option>Customer Support</option>
          </select>
          <select className="select max-w-xs">
            <option>Sort: Match score</option>
            <option>Sort: Most recent</option>
          </select>
          <span className="ml-auto text-xs text-navy-700">{matches.length} results</span>
        </div>

        <ul className="space-y-3">
          {matches.map((m) => (
            <li key={m.id} className="card p-5 flex flex-wrap items-start gap-4 justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-lg text-navy-900">{m.t}</h3>
                  <span className="badge-gold">Match {(m.s * 100).toFixed(0)}%</span>
                </div>
                <div className="text-xs text-ink-soft mt-0.5">{m.c} · {m.loc} · {m.sal}</div>
                <p className="text-sm mt-2 text-ink-soft">{m.snippet}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/seeker/jobs" className="btn-secondary">View posting</Link>
                <Link href="/seeker/chat" className="btn-primary">Ask advisor</Link>
              </div>
            </li>
          ))}
        </ul>
      </Workspace>
    </>
  );
}
