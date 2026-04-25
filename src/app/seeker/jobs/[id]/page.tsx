import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Workspace, seekerNav } from "@/components/Workspace";

export default function JobDetail({ params }: { params: { id: string } }) {
  return (
    <>
      <PageHeader
        eyebrow={`Posting #${params.id}`}
        title="Frontend Engineer"
        description="BlueLeaf Tech · Cebu City · ₱35k–₱55k · Full-time"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Seeker", href: "/seeker/dashboard" },
          { label: "Search Jobs", href: "/seeker/jobs" },
          { label: `Posting #${params.id}` },
        ]}
        actions={<Link href="/seeker/chat" className="btn-primary">Ask advisor</Link>}
      />
      <Workspace navTitle="Seeker Workspace" nav={seekerNav}>
        <div className="card p-6 space-y-4">
          <span className="badge-gold">Match 91%</span>
          <h2 className="section-title">Description</h2>
          <p className="text-sm text-ink-soft">
            BlueLeaf is hiring a frontend engineer to build customer dashboards in React + Tailwind.
            Hybrid Cebu City office, two days on-site.
          </p>
          <h2 className="section-title">Requirements</h2>
          <ul className="text-sm text-ink-soft list-disc list-inside space-y-1">
            <li>2+ years professional React experience</li>
            <li>TypeScript and modern build tooling</li>
            <li>Comfortable with REST and basic auth flows</li>
          </ul>
          <h2 className="section-title">Qualifications</h2>
          <ul className="text-sm text-ink-soft list-disc list-inside space-y-1">
            <li>Bachelor's degree or equivalent industry experience</li>
            <li>Resident or willing to relocate to Cebu</li>
          </ul>
          <div className="divider-rule" />
          <div className="text-xs text-navy-700">Posted 2026-04-10 · Reference SM-{params.id}</div>
        </div>
      </Workspace>
    </>
  );
}
