import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Workspace, seekerNav } from "@/components/Workspace";
import { Stat } from "@/components/Stat";

export default function SeekerDashboard() {
  return (
    <>
      <PageHeader
        eyebrow="Job Seeker"
        title="Welcome back, Juan"
        description="Your CVs, your matches, and your advisor — all in one place."
        crumbs={[{ label: "Home", href: "/" }, { label: "Seeker" }, { label: "Dashboard" }]}
        actions={
          <>
            <Link href="/seeker/cvs/upload" className="btn-secondary">Upload CV</Link>
            <Link href="/seeker/chat" className="btn-primary">Ask the Advisor</Link>
          </>
        }
      />
      <Workspace navTitle="Seeker Workspace" nav={seekerNav}>
        <div className="grid sm:grid-cols-3 gap-4">
          <Stat label="CVs Uploaded" value={3} hint="Across 2 specializations" />
          <Stat label="Active Matches" value={12} hint="Based on your latest CV" tone="gold" />
          <Stat label="Advisor Sessions" value={5} hint="This month" />
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Top matches this week</h2>
            <Link href="/seeker/matches" className="text-sm text-navy-800 underline">View all</Link>
          </div>
          <div className="divider-rule my-4" />
          <ul className="divide-y divide-navy-100">
            {[
              { t: "Frontend Engineer", c: "BlueLeaf Tech · Cebu City", s: 0.91 },
              { t: "Customer Success Officer", c: "MariaSoft · Mandaue", s: 0.84 },
              { t: "Junior Web Developer", c: "Province of Cebu — IT Office", s: 0.79 },
            ].map((m, i) => (
              <li key={i} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium text-navy-900">{m.t}</div>
                  <div className="text-xs text-ink-soft">{m.c}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge-gold">Match {(m.s * 100).toFixed(0)}%</span>
                  <Link href="/seeker/jobs" className="btn-secondary">View</Link>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-6">
            <h3 className="font-serif text-lg text-navy-900">Recent advisor questions</h3>
            <ul className="mt-3 text-sm space-y-2 text-ink-soft">
              <li>· "How should I tailor my CV for a BPO role?"</li>
              <li>· "What government positions are open in Talisay?"</li>
              <li>· "What does a Junior Frontend Engineer earn in Cebu?"</li>
            </ul>
            <div className="mt-4">
              <Link href="/seeker/chat" className="btn-secondary">Open advisor →</Link>
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-serif text-lg text-navy-900">Service notices</h3>
            <ul className="mt-3 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="badge-navy mt-0.5">Notice</span>
                <span className="text-ink-soft">CV upload limit per specialization is 5. You have used 3.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="badge-gold mt-0.5">Tip</span>
                <span className="text-ink-soft">Add a focused CV per specialization for better matches.</span>
              </li>
            </ul>
          </div>
        </div>
      </Workspace>
    </>
  );
}
