import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Workspace, employerNav } from "@/components/Workspace";
import { EmployerJobListClient } from "@/components/showcase/EmployerJobListClient";
import { getShowcaseJobs } from "@/lib/showcase";

export default function MyPostings() {
  // Showcase: employer_id=1 owns jobs 1–3 (BlueLeaf Tech)
  const jobs = getShowcaseJobs().filter((j) => j.employer_id === 1);
  return (
    <>
      <PageHeader
        eyebrow="Employer"
        title="My Postings"
        description="Up to 5 active job postings per employer."
        crumbs={[{ label: "Home", href: "/" }, { label: "Employer", href: "/employer/dashboard" }, { label: "Postings" }]}
        actions={<Link href="/employer/jobs/new" className="btn-primary">Post a Job</Link>}
      />
      <Workspace nav={employerNav}>
        <EmployerJobListClient jobs={jobs} />
      </Workspace>
    </>
  );
}
