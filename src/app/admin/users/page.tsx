import { PageHeader } from "@/components/PageHeader";
import { Workspace, adminNav } from "@/components/Workspace";

const users = [
  { id: 1, email: "admin@scratchmatch.local", role: "admin", joined: "2026-01-04" },
  { id: 2, email: "juan.delacruz@example.ph", role: "seeker", joined: "2026-02-12" },
  { id: 3, email: "maria.santos@example.ph", role: "seeker", joined: "2026-02-21" },
  { id: 4, email: "hr@blueleaf.tech", role: "employer", joined: "2026-03-02" },
  { id: 5, email: "office@cebu.gov.ph", role: "employer", joined: "2026-03-18" },
];

export default function AdminUsers() {
  return (
    <>
      <PageHeader
        eyebrow="Administrator"
        title="Users"
        description="All registered accounts. Deactivate misuse; the admin account is protected."
        crumbs={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Users" }]}
      />
      <Workspace navTitle="Admin Console" nav={adminNav}>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-navy-50 text-navy-800">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-mono text-xs">{u.id}</td>
                  <td className="px-4 py-3 font-mono text-xs">{u.email}</td>
                  <td className="px-4 py-3">
                    {u.role === "admin" && <span className="badge-seal">Admin</span>}
                    {u.role === "seeker" && <span className="badge-navy">Seeker</span>}
                    {u.role === "employer" && <span className="badge-gold">Employer</span>}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{u.joined}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button className="btn-ghost">View</button>
                    <button className="btn-ghost text-seal" disabled={u.role === "admin"}>
                      Deactivate
                    </button>
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
