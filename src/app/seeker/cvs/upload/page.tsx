import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Workspace, seekerNav } from "@/components/Workspace";

export default function UploadCV() {
  return (
    <>
      <PageHeader
        eyebrow="Job Seeker"
        title="Upload a CV"
        description="PDF or pasted text. Files are parsed locally — nothing is sent to a third-party service."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Seeker", href: "/seeker/dashboard" },
          { label: "CVs", href: "/seeker/cvs" },
          { label: "Upload" },
        ]}
      />
      <Workspace navTitle="Seeker Workspace" nav={seekerNav}>
        <form className="card p-6 space-y-5">
          <div>
            <label className="label">Specialization</label>
            <input className="input" placeholder="e.g. Frontend Development" />
            <p className="text-[11px] text-navy-700 mt-1">Reuse an existing specialization to keep CVs grouped.</p>
          </div>
          <div>
            <label className="label">CV File (PDF)</label>
            <div className="rounded-sm border-2 border-dashed border-navy-200 bg-parchment p-8 text-center">
              <div className="font-serif text-lg text-navy-900">Drop your PDF here</div>
              <div className="text-xs text-ink-soft mt-1">or click to browse — max 5 MB</div>
              <input type="file" accept=".pdf" className="mt-4 mx-auto block text-xs" />
            </div>
          </div>
          <div className="text-center text-xs text-navy-700 uppercase tracking-wider">— or —</div>
          <div>
            <label className="label">Paste CV Text</label>
            <textarea className="textarea min-h-[180px]" placeholder="Paste the full content of your CV here…" />
          </div>
          <div className="flex items-center justify-between">
            <Link href="/seeker/cvs" className="btn-ghost">← Back to CVs</Link>
            <Link href="/seeker/matches" className="btn-primary">Ingest & Match</Link>
          </div>
        </form>

        <div className="card p-5">
          <div className="text-[11px] uppercase tracking-[0.18em] text-navy-700">What happens after upload</div>
          <ol className="mt-3 text-sm text-ink-soft space-y-1 list-decimal list-inside">
            <li>The file is parsed and split into ~500-token chunks.</li>
            <li>Each chunk is embedded with a local model and stored in Qdrant.</li>
            <li>The system runs a match against currently open jobs and shows the top results.</li>
          </ol>
        </div>
      </Workspace>
    </>
  );
}
