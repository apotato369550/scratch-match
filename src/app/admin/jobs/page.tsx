import { PageHeader } from "@/components/PageHeader";
import { Workspace, adminNav } from "@/components/Workspace";

const jobs = [
  { id: 1, t: "Frontend Engineer", emp: "BlueLeaf Tech", status: "open", chunks: 8 },
  { id: 2, t: "QA Tester", emp: "BlueLeaf Tech", status: "open", chunks: 6 },
  { id: 3, t: "Office Assistant", emp: "Province of Cebu — IT", status: "open", chunks: 5 },
  { id: 4, t: "Bookkeeper", emp: "Carcar Trading Co.", status: "open", chunks: 7 },
];

export default function AdminJobs() {
  return (
    <>
      <PageHeader
        eyebrow="Administrator"
        title="Jobs"
        description="All postings across employers. Deletion cascades to Qdrant chunk removal."
        crumbs={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Jobs" }]}
      />
      <Workspace navTitle="Admin Console" nav={adminNav}>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-navy-50 text-navy-800">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Employer</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Chunks</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {jobs.map((j) => (
                <tr key={j.id}>
                  <td className="px-4 py-3 font-mono text-xs">{j.id}</td>
                  <td className="px-4 py-3 font-medium text-navy-900">{j.t}</td>
                  <td className="px-4 py-3 text-ink-soft">{j.emp}</td>
                  <td className="px-4 py-3"><span className="badge-green">{j.status}</span></td>
                  <td className="px-4 py-3 text-ink-soft">{j.chunks}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button className="btn-ghost">View</button>
                    <button className="btn-ghost text-seal">Delete</button>
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
