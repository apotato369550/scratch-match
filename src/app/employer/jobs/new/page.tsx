import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Workspace, employerNav } from "@/components/Workspace";

export default function NewJob() {
  return (
    <>
      <PageHeader
        eyebrow="Employer"
        title="Post a Job"
        description="Fill the form, or upload a JD PDF — both are parsed and embedded for matching."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Employer", href: "/employer/dashboard" },
          { label: "Postings", href: "/employer/jobs" },
          { label: "New" },
        ]}
      />
      <Workspace navTitle="Employer Workspace" nav={employerNav}>
        <form className="card p-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Job Title</label>
              <input className="input" placeholder="e.g. Frontend Engineer" />
            </div>
            <div>
              <label className="label">Municipality</label>
              <select className="select">
                <option>Cebu City</option><option>Mandaue</option><option>Lapu-Lapu</option>
                <option>Talisay</option><option>Other (Cebu)</option>
              </select>
            </div>
            <div>
              <label className="label">Salary Range</label>
              <input className="input" placeholder="₱25k–₱45k or SG-11" />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="textarea" placeholder="What the role does, day-to-day responsibilities, team context." />
          </div>
          <div>
            <label className="label">Requirements</label>
            <textarea className="textarea" placeholder="Hard skills, technologies, certifications." />
          </div>
          <div>
            <label className="label">Qualifications</label>
            <textarea className="textarea" placeholder="Education, residency, soft skills." />
          </div>
          <div className="rounded-sm border border-dashed border-navy-200 bg-parchment p-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-navy-700">Optional — Upload JD PDF</div>
            <input type="file" accept=".pdf" className="mt-2 block text-xs" />
            <div className="text-xs text-ink-soft mt-1">If provided, the PDF is parsed and used to populate fields above.</div>
          </div>
          <div className="flex items-center justify-between">
            <Link href="/employer/jobs" className="btn-ghost">← Back</Link>
            <button className="btn-primary">Publish posting</button>
          </div>
        </form>
      </Workspace>
    </>
  );
}
