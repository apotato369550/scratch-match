import { PageHeader } from "@/components/PageHeader";
import { Workspace, adminNav } from "@/components/Workspace";
import { Stat } from "@/components/Stat";

export default function AdminConsole() {
  return (
    <>
      <PageHeader
        eyebrow="Administrator"
        title="Service Console"
        description="Single seeded administrator account. Use this console to oversee users, jobs, and CVs."
        crumbs={[{ label: "Home", href: "/" }, { label: "Admin" }]}
      />
      <Workspace navTitle="Admin Console" nav={adminNav}>
        <div className="grid sm:grid-cols-4 gap-4">
          <Stat label="Users" value={128} hint="seekers + employers" />
          <Stat label="Open Jobs" value={36} tone="gold" />
          <Stat label="CVs Indexed" value={241} />
          <Stat label="Match Records" value={87} tone="seal" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-6">
            <h3 className="font-serif text-lg text-navy-900">System health</h3>
            <ul className="mt-3 text-sm space-y-2">
              <li className="flex items-center justify-between">
                <span>Qdrant</span><span className="badge-green">Reachable · 6333</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Ollama (Mistral)</span><span className="badge-green">Loaded</span>
              </li>
              <li className="flex items-center justify-between">
                <span>SQLite</span><span className="badge-green">data/app.db · 12.4 MB</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Embedding model</span><span className="badge-muted">nomic-embed-text · 768d</span>
              </li>
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="font-serif text-lg text-navy-900">Recent activity</h3>
            <ul className="mt-3 text-sm space-y-2 text-ink-soft">
              <li>· 2026-04-25 09:14 — Employer "BlueLeaf Tech" posted "Frontend Engineer".</li>
              <li>· 2026-04-25 08:51 — Seeker "Juan dela Cruz" uploaded CV v3.</li>
              <li>· 2026-04-24 17:02 — Match recorded: Job #1 ↔ CV #14.</li>
            </ul>
          </div>
        </div>
      </Workspace>
    </>
  );
}
