import { PageHeader } from "@/components/PageHeader";
import { Workspace, seekerNav } from "@/components/Workspace";
import { UploadForm } from "./UploadForm";

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
        <UploadForm />
        <div className="card p-5">
          <div className="text-[11px] uppercase tracking-[0.18em] text-navy-700">
            What happens after upload
          </div>
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
