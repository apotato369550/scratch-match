import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Workspace, employerNav } from "@/components/Workspace";

const seekers = [
  { id: 1, n: "Juan dela Cruz", spec: "Frontend Development", loc: "Cebu City", yrs: 3, cvs: 2 },
  { id: 2, n: "Maria Santos", spec: "Frontend Development", loc: "Mandaue", yrs: 4, cvs: 1 },
  { id: 3, n: "Pedro Reyes", spec: "Customer Support", loc: "Lapu-Lapu", yrs: 2, cvs: 3 },
  { id: 4, n: "Anna Lim", spec: "Frontend Development", loc: "Talisay", yrs: 1, cvs: 1 },
  { id: 5, n: "Joaquin Bautista", spec: "Bookkeeping", loc: "Carcar", yrs: 6, cvs: 2 },
];

export default function SearchSeekers() {
  return (
    <>
      <PageHeader
        eyebrow="Employer"
        title="Search Seekers"
        description="Discover candidates beyond your active postings. Contact info is gated until you record a match."
        crumbs={[{ label: "Home", href: "/" }, { label: "Employer", href: "/employer/dashboard" }, { label: "Search Seekers" }]}
      />
      <Workspace navTitle="Employer Workspace" nav={employerNav}>
        <form className="card p-4 grid md:grid-cols-[1fr_auto_auto_auto] gap-3 items-end">
          <div>
            <label className="label">Specialization or keyword</label>
            <input className="input" placeholder="e.g. Frontend, bookkeeping" />
          </div>
          <div>
            <label className="label">Municipality</label>
            <select className="select"><option>All</option><option>Cebu City</option><option>Mandaue</option></select>
          </div>
          <label className="flex items-center gap-2 text-xs text-navy-800 mb-2">
            <input type="checkbox" className="accent-navy-700" /> Semantic CV search
          </label>
          <button className="btn-primary mb-0">Search</button>
        </form>

        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-navy-50 text-navy-800">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Specialization</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Experience</th>
                <th className="px-4 py-3 font-semibold">CVs</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {seekers.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-medium text-navy-900">{s.n}</td>
                  <td className="px-4 py-3"><span className="badge-navy">{s.spec}</span></td>
                  <td className="px-4 py-3 text-ink-soft">{s.loc}</td>
                  <td className="px-4 py-3 text-ink-soft">{s.yrs} yrs</td>
                  <td className="px-4 py-3 text-ink-soft">{s.cvs}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link href="/employer/chat" className="btn-ghost">Ask</Link>
                    <Link href="/employer/candidates" className="btn-secondary">Profile</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Workspace>
    </>
  );
}
