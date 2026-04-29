import { PageHeader } from "@/components/PageHeader";
import { Workspace, seekerNav } from "@/components/Workspace";
import { JobListClient } from "@/components/showcase/JobListClient";
import { getShowcaseJobs } from "@/lib/showcase";

export default function SearchJobs() {
  const jobs = getShowcaseJobs().filter((j) => j.status === "open");
  return (
    <>
      <PageHeader
        eyebrow="Job Seeker"
        title="Search Job Postings"
        description="Browse open postings within Cebu. Toggle semantic search to use embeddings."
        crumbs={[{ label: "Home", href: "/" }, { label: "Seeker", href: "/seeker/dashboard" }, { label: "Search Jobs" }]}
      />
      <Workspace nav={seekerNav}>
        <form className="card p-5 grid md:grid-cols-[1fr_auto_auto_auto] gap-3 items-end">
          <div>
            <label className="label">Keywords</label>
            <input className="input" placeholder="e.g. frontend, government, bookkeeping" />
          </div>
          <div>
            <label className="label">Municipality</label>
            <select className="select">
              <option>All</option><option>Cebu City</option><option>Mandaue</option>
              <option>Lapu-Lapu</option><option>Talisay</option><option>Carcar</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-navy-800 mb-2">
            <input type="checkbox" className="accent-navy-700" /> Semantic
          </label>
          <button className="btn-primary mb-0">Search</button>
        </form>

        <JobListClient jobs={jobs} />
      </Workspace>
    </>
  );
}
