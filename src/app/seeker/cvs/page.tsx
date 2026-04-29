import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Workspace, seekerNav } from "@/components/Workspace";
import { CvListClient } from "@/components/showcase/CvListClient";
import { getShowcaseCvs } from "@/lib/showcase";

export default function MyCVs() {
  // Showcase: pretend the logged-in user is seeker_id=1 (Juan dela Cruz).
  const cvs = getShowcaseCvs().filter((c) => c.seeker_id === 1);
  const bySpec = new Map<string, number>();
  for (const c of cvs) bySpec.set(c.specialization, (bySpec.get(c.specialization) ?? 0) + 1);

  return (
    <>
      <PageHeader
        eyebrow="Job Seeker"
        title="My CVs"
        description="Up to 5 CVs per specialization. Each is parsed, chunked, and embedded for matching."
        crumbs={[{ label: "Home", href: "/" }, { label: "Seeker", href: "/seeker/dashboard" }, { label: "CVs" }]}
        actions={<Link href="/seeker/cvs/upload" className="btn-primary">Upload CV</Link>}
      />
      <Workspace nav={seekerNav}>
        <CvListClient cvs={cvs} />

        <div className="card p-6">
          <div className="text-xs uppercase tracking-[0.18em] text-navy-700">Quota</div>
          <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
            {Array.from(bySpec.entries()).map(([spec, used]) => (
              <Quota key={spec} spec={spec} used={used} max={5} />
            ))}
          </div>
        </div>
      </Workspace>
    </>
  );
}

function Quota({ spec, used, max }: { spec: string; used: number; max: number }) {
  const pct = (used / max) * 100;
  return (
    <div className="rounded-md border border-navy-100 p-4">
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
