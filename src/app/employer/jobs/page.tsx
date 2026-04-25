import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Workspace, employerNav } from "@/components/Workspace";

const jobs = [
  { id: 1, t: "Frontend Engineer", status: "open", posted: "2026-04-10", apps: 24 },
  { id: 2, t: "QA Tester", status: "open", posted: "2026-04-02", apps: 12 },
  { id: 3, t: "Office Assistant", status: "open", posted: "2026-03-22", apps: 11 },
  { id: 4, t: "Marketing Intern", status: "closed", posted: "2026-02-12", apps: 31 },
];

export default function MyPostings() {
  return (
    <>
      <PageHeader
        eyebrow="Employer"
        title="My Postings"
        description="Up to 5 active job postings per employer in the prototype."
        crumbs={[{ label: "Home", href: "/" }, { label: "Employer", href: "/employer/dashboard" }, { label: "Postings" }]}
        actions={<Link href="/employer/jobs/new" className="btn-primary">Post a Job</Link>}
      />
      <Workspace navTitle="Employer Workspace" nav={employerNav}>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-navy-50 text-navy-800">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Posted</th>
                <th className="px-4 py-3 font-semibold">Surfaced</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {jobs.map((j) => (
                <tr key={j.id}>
                  <td className="px-4 py-3 font-medium text-navy-900">{j.t}</td>
                  <td className="px-4 py-3">
                    {j.status === "open" ? <span className="badge-green">Open</span> : <span className="badge-muted">Closed</span>}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{j.posted}</td>
                  <td className="px-4 py-3 text-ink-soft">{j.apps}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link href="/employer/candidates" className="btn-secondary">Candidates</Link>
                    <button className="btn-ghost text-seal">Close</button>
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
