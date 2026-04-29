import { PageHeader } from "@/components/PageHeader";
import { Workspace, employerNav } from "@/components/Workspace";
import { SeekerListClient } from "@/components/showcase/SeekerListClient";
import { getShowcaseSeekers, getShowcaseCvs } from "@/lib/showcase";

export default function SearchSeekers() {
  const seekers = getShowcaseSeekers();
  const cvs = getShowcaseCvs();
  const cvsBySeeker: Record<number, typeof cvs> = {};
  for (const cv of cvs) {
    if (!cvsBySeeker[cv.seeker_id]) cvsBySeeker[cv.seeker_id] = [];
    cvsBySeeker[cv.seeker_id].push(cv);
  }

  return (
    <>
      <PageHeader
        eyebrow="Employer"
        title="Search Seekers"
        description="Discover candidates beyond your active postings. Click a row to read their profile and CV."
        crumbs={[{ label: "Home", href: "/" }, { label: "Employer", href: "/employer/dashboard" }, { label: "Search Seekers" }]}
      />
      <Workspace nav={employerNav}>
        <form className="card p-5 grid md:grid-cols-[1fr_auto_auto_auto] gap-3 items-end">
          <div>
            <label className="label">Specialization or keyword</label>
            <input className="input" placeholder="e.g. Frontend, bookkeeping" />
          </div>
          <div>
            <label className="label">Municipality</label>
            <select className="select">
              <option>All</option><option>Cebu City</option><option>Mandaue</option>
              <option>Lapu-Lapu</option><option>Talisay</option><option>Carcar</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-navy-800 mb-2">
            <input type="checkbox" className="accent-navy-700" /> Semantic CV search
          </label>
          <button className="btn-primary mb-0">Search</button>
        </form>
        <SeekerListClient seekers={seekers} cvsBySeeker={cvsBySeeker} />
      </Workspace>
    </>
  );
}
