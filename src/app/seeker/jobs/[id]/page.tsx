import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Workspace, seekerNav } from "@/components/Workspace";
import { JobModalBody } from "@/components/showcase/JobModalBody";
import { getShowcaseJob, getShowcaseMatches, getShowcaseCvs } from "@/lib/showcase";

export default function JobDetail({ params }: { params: { id: string } }) {
  const job = getShowcaseJob(Number(params.id));
  if (!job) notFound();

  const cvIds = new Set(getShowcaseCvs().filter((c) => c.seeker_id === 1).map((c) => c.id));
  const match = getShowcaseMatches().find(
    (m) => m.job_id === job.id && cvIds.has(m.cv_id)
  );

  return (
    <>
      <PageHeader
        eyebrow={`Posting #${job.id}`}
        title={job.title}
        description={`${job.company} · ${job.location} · ${job.salary_range} · ${job.employment_type}`}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Seeker", href: "/seeker/dashboard" },
          { label: "Search Jobs", href: "/seeker/jobs" },
          { label: job.title },
        ]}
        actions={<Link href="/seeker/chat" className="btn-primary">Ask advisor</Link>}
      />
      <Workspace nav={seekerNav}>
        <div className="card p-8 space-y-6">
          <JobModalBody job={job} score={match?.score} />
        </div>
      </Workspace>
    </>
  );
}
