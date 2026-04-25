import { PageHeader } from "@/components/PageHeader";
import { Workspace, adminNav } from "@/components/Workspace";

const cvs = [
  { id: 14, file: "JuanDelaCruz_Frontend_v3.pdf", seeker: "juan.delacruz@example.ph", spec: "Frontend Development", chunks: 14 },
  { id: 13, file: "JuanDelaCruz_Frontend_v2.pdf", seeker: "juan.delacruz@example.ph", spec: "Frontend Development", chunks: 13 },
  { id: 12, file: "MariaSantos_Frontend.pdf", seeker: "maria.santos@example.ph", spec: "Frontend Development", chunks: 11 },
  { id: 11, file: "PedroReyes_Support.pdf", seeker: "pedro.reyes@example.ph", spec: "Customer Support", chunks: 9 },
];

export default function AdminCVs() {
  return (
    <>
      <PageHeader
        eyebrow="Administrator"
        title="CVs"
        description="Indexed CV documents across all seekers."
        crumbs={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "CVs" }]}
      />
      <Workspace navTitle="Admin Console" nav={adminNav}>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-navy-50 text-navy-800">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">File</th>
                <th className="px-4 py-3 font-semibold">Seeker</th>
                <th className="px-4 py-3 font-semibold">Specialization</th>
                <th className="px-4 py-3 font-semibold">Chunks</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {cvs.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-mono text-xs">{c.id}</td>
                  <td className="px-4 py-3 font-mono text-xs">{c.file}</td>
                  <td className="px-4 py-3 font-mono text-xs">{c.seeker}</td>
                  <td className="px-4 py-3"><span className="badge-navy">{c.spec}</span></td>
                  <td className="px-4 py-3 text-ink-soft">{c.chunks}</td>
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
