import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Workspace, employerNav } from "@/components/Workspace";
import { CandidateListClient } from "@/components/showcase/CandidateListClient";
import { getCandidatesForJob } from "@/lib/showcase";

export default function Candidates() {
  // Showcase: show candidates for job_id=1 (Frontend Engineer @ BlueLeaf)
  const rows = getCandidatesForJob(1);
  return (
    <>
      <PageHeader
        eyebrow="Employer"
        title="Candidates"
        description="Auto-ranked seekers for your posting. Click a profile to read their CV summary."
        crumbs={[{ label: "Home", href: "/" }, { label: "Employer", href: "/employer/dashboard" }, { label: "Candidates" }]}
      />
      <Workspace nav={employerNav}>
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
          <span className="ml-auto text-sm text-navy-700">{rows.length} surfaced</span>
        </div>
        <CandidateListClient rows={rows} />
      </Workspace>
    </>
  );
}
