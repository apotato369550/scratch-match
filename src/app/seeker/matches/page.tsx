import { PageHeader } from "@/components/PageHeader";
import { Workspace, seekerNav } from "@/components/Workspace";
import { MatchListClient } from "@/components/showcase/MatchListClient";
import { getMatchesForSeeker } from "@/lib/showcase";

export default function Matches() {
  const rows = getMatchesForSeeker(1);
  return (
    <>
      <PageHeader
        eyebrow="Job Seeker"
        title="Your Matches"
        description="Auto-ranked from your most recent CV in each specialization."
        crumbs={[{ label: "Home", href: "/" }, { label: "Seeker", href: "/seeker/dashboard" }, { label: "Matches" }]}
      />
      <Workspace nav={seekerNav}>
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
          <span className="ml-auto text-sm text-navy-700">{rows.length} results</span>
        </div>
        <MatchListClient rows={rows} />
      </Workspace>
    </>
  );
}
