import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Workspace, seekerNav } from "@/components/Workspace";

const jobs = [
  { id: 1, t: "Frontend Engineer", c: "BlueLeaf Tech", loc: "Cebu City", sal: "₱35k–₱55k", tags: ["React", "TypeScript"] },
  { id: 2, t: "Bookkeeper", c: "Carcar Trading Co.", loc: "Carcar City", sal: "₱22k–₱28k", tags: ["QuickBooks", "PH Tax"] },
  { id: 3, t: "Junior Web Developer", c: "Province of Cebu — IT", loc: "Cebu City", sal: "SG-11", tags: ["Government", "PHP"] },
  { id: 4, t: "Hotel Front Desk Officer", c: "Mactan Bay Resort", loc: "Lapu-Lapu", sal: "₱18k–₱24k", tags: ["Hospitality", "English"] },
  { id: 5, t: "Math Teacher", c: "St. Lourdes Academy", loc: "Talisay", sal: "Per DepEd", tags: ["Education", "Senior High"] },
];

export default function SearchJobs() {
  return (
    <>
      <PageHeader
        eyebrow="Job Seeker"
        title="Search Job Postings"
        description="Browse open postings within Cebu. Toggle semantic search to use embeddings."
        crumbs={[{ label: "Home", href: "/" }, { label: "Seeker", href: "/seeker/dashboard" }, { label: "Search Jobs" }]}
      />
      <Workspace navTitle="Seeker Workspace" nav={seekerNav}>
        <form className="card p-4 grid md:grid-cols-[1fr_auto_auto_auto] gap-3 items-end">
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
          <label className="flex items-center gap-2 text-xs text-navy-800 mb-2">
            <input type="checkbox" className="accent-navy-700" /> Semantic
          </label>
          <button className="btn-primary mb-0">Search</button>
        </form>

        <ul className="grid md:grid-cols-2 gap-4">
          {jobs.map((j) => (
            <li key={j.id} className="card p-5">
              <h3 className="font-serif text-lg text-navy-900">{j.t}</h3>
              <div className="text-xs text-ink-soft">{j.c} · {j.loc} · {j.sal}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {j.tags.map((t) => <span key={t} className="badge-muted">{t}</span>)}
              </div>
              <div className="mt-4 flex gap-2">
                <Link href={`/seeker/jobs/${j.id}`} className="btn-secondary">Open</Link>
                <Link href="/seeker/chat" className="btn-ghost">How should I apply?</Link>
              </div>
            </li>
          ))}
        </ul>
      </Workspace>
    </>
  );
}
