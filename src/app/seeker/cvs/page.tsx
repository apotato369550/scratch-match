import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Workspace, seekerNav } from "@/components/Workspace";

const cvs = [
  { id: 1, name: "JuanDelaCruz_Frontend_v3.pdf", spec: "Frontend Development", uploaded: "2026-04-12", chunks: 14 },
  { id: 2, name: "JuanDelaCruz_Frontend_v2.pdf", spec: "Frontend Development", uploaded: "2026-03-30", chunks: 13 },
  { id: 3, name: "JuanDelaCruz_Support.pdf", spec: "Customer Support", uploaded: "2026-02-18", chunks: 11 },
];

export default function MyCVs() {
  return (
    <>
      <PageHeader
        eyebrow="Job Seeker"
        title="My CVs"
        description="Up to 5 CVs per specialization. Each is parsed, chunked, and embedded for matching."
        crumbs={[{ label: "Home", href: "/" }, { label: "Seeker", href: "/seeker/dashboard" }, { label: "CVs" }]}
        actions={<Link href="/seeker/cvs/upload" className="btn-primary">Upload CV</Link>}
      />
      <Workspace navTitle="Seeker Workspace" nav={seekerNav}>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-navy-50 text-navy-800">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold">File</th>
                <th className="px-4 py-3 font-semibold">Specialization</th>
                <th className="px-4 py-3 font-semibold">Uploaded</th>
                <th className="px-4 py-3 font-semibold">Chunks</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {cvs.map((cv) => (
                <tr key={cv.id}>
                  <td className="px-4 py-3 font-mono text-xs">{cv.name}</td>
                  <td className="px-4 py-3"><span className="badge-navy">{cv.spec}</span></td>
                  <td className="px-4 py-3 text-ink-soft">{cv.uploaded}</td>
                  <td className="px-4 py-3 text-ink-soft">{cv.chunks}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link href="/seeker/matches" className="btn-secondary">Matches</Link>
                    <button className="btn-ghost text-seal">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card p-5">
          <div className="text-[11px] uppercase tracking-[0.18em] text-navy-700">Quota</div>
          <div className="mt-2 grid sm:grid-cols-2 gap-3 text-sm">
            <Quota spec="Frontend Development" used={2} max={5} />
            <Quota spec="Customer Support" used={1} max={5} />
          </div>
        </div>
      </Workspace>
    </>
  );
}

function Quota({ spec, used, max }: { spec: string; used: number; max: number }) {
  const pct = (used / max) * 100;
  return (
    <div className="rounded-sm border border-navy-100 p-3">
      <div className="flex items-center justify-between">
        <div className="font-medium text-navy-900">{spec}</div>
        <div className="text-xs text-ink-soft">{used} / {max}</div>
      </div>
      <div className="mt-2 h-1.5 bg-navy-50 rounded">
        <div className="h-full bg-gold-500 rounded" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
