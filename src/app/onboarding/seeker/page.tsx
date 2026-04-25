import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function SeekerOnboarding() {
  return (
    <>
      <PageHeader
        eyebrow="Step 1 of 1"
        title="Job Seeker Onboarding"
        description="Tell the service who you are. This information helps us tailor matches and advisor responses."
        crumbs={[{ label: "Home", href: "/" }, { label: "Register", href: "/signup" }, { label: "Seeker Onboarding" }]}
      />
      <section className="mx-auto max-w-4xl px-4 py-10 grid md:grid-cols-3 gap-6">
        <aside className="card p-5 self-start">
          <div className="text-[11px] uppercase tracking-[0.18em] text-navy-700">Why we ask</div>
          <p className="text-sm text-ink-soft mt-2">
            Onboarding fields are stored locally and used to scope matches and advisor context. You can
            edit them later from your dashboard.
          </p>
          <div className="divider-rule my-4" />
          <ul className="text-xs text-navy-800 space-y-2">
            <li>· Specializations drive your CV upload limits.</li>
            <li>· Municipality narrows location-based matching.</li>
            <li>· "Why you're here" is fed into the advisor's system context.</li>
          </ul>
        </aside>
        <form className="card p-6 md:col-span-2 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" placeholder="Juan dela Cruz" />
            </div>
            <div>
              <label className="label">Years of Experience</label>
              <input type="number" min={0} className="input" placeholder="3" />
            </div>
            <div>
              <label className="label">Municipality</label>
              <select className="select">
                <option>Cebu City</option><option>Mandaue City</option><option>Lapu-Lapu City</option>
                <option>Talisay City</option><option>Toledo City</option><option>Other (Cebu)</option>
              </select>
            </div>
            <div>
              <label className="label">Highest Education</label>
              <select className="select">
                <option>Senior High School</option><option>Vocational / TESDA</option>
                <option>Bachelor's Degree</option><option>Master's Degree</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Specializations</label>
            <input className="input" placeholder="e.g. Frontend Development, Customer Support, Bookkeeping" />
            <p className="text-[11px] text-navy-700 mt-1">Comma-separated. Up to 5 CVs may be uploaded per specialization.</p>
          </div>
          <div>
            <label className="label">About You</label>
            <textarea className="textarea" placeholder="Brief professional summary." />
          </div>
          <div>
            <label className="label">Why are you here?</label>
            <textarea className="textarea" placeholder="What kind of role are you looking for? Any constraints (schedule, on-site, salary)?" />
          </div>
          <div className="flex items-center justify-between">
            <Link href="/signup" className="btn-ghost">← Back</Link>
            <Link href="/seeker/dashboard" className="btn-primary">Finish onboarding</Link>
          </div>
        </form>
      </section>
    </>
  );
}
