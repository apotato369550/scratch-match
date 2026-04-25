import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function EmployerOnboarding() {
  return (
    <>
      <PageHeader
        eyebrow="Step 1 of 1"
        title="Employer Onboarding"
        description="Register your company or office. Information is used to scope candidate searches and the hiring assistant."
        crumbs={[{ label: "Home", href: "/" }, { label: "Register", href: "/signup" }, { label: "Employer Onboarding" }]}
      />
      <section className="mx-auto max-w-4xl px-4 py-10 grid md:grid-cols-3 gap-6">
        <aside className="card p-5 self-start">
          <div className="text-[11px] uppercase tracking-[0.18em] text-navy-700">Eligibility</div>
          <p className="text-sm text-ink-soft mt-2">
            This service registers employers operating within the Province of Cebu. Listings are
            limited to 5 active postings per employer for the prototype.
          </p>
          <div className="divider-rule my-4" />
          <ul className="text-xs text-navy-800 space-y-2">
            <li>· Government, educational, and private sectors are all welcome.</li>
            <li>· Misuse will result in admin removal.</li>
          </ul>
        </aside>
        <form className="card p-6 md:col-span-2 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Company / Office Name</label>
              <input className="input" placeholder="Acme Cebu Corp." />
            </div>
            <div>
              <label className="label">Sector</label>
              <select className="select">
                <option>Private</option><option>Government</option><option>Educational</option>
                <option>Non-Profit</option>
              </select>
            </div>
            <div>
              <label className="label">Industry</label>
              <input className="input" placeholder="e.g. BPO, Manufacturing, Hospitality" />
            </div>
            <div>
              <label className="label">Municipality</label>
              <select className="select">
                <option>Cebu City</option><option>Mandaue City</option><option>Lapu-Lapu City</option>
                <option>Talisay City</option><option>Other (Cebu)</option>
              </select>
            </div>
            <div>
              <label className="label">Website</label>
              <input className="input" placeholder="https://" />
            </div>
            <div>
              <label className="label">Contact Email</label>
              <input type="email" className="input" placeholder="hr@example.ph" />
            </div>
          </div>
          <div>
            <label className="label">About the organization</label>
            <textarea className="textarea" placeholder="What does your organization do? Mission, size, notable projects." />
          </div>
          <div>
            <label className="label">What are you hiring for?</label>
            <textarea className="textarea" placeholder="Roles you intend to post, ideal candidate profiles, hiring timeline." />
          </div>
          <div className="flex items-center justify-between">
            <Link href="/signup" className="btn-ghost">← Back</Link>
            <Link href="/employer/dashboard" className="btn-primary">Finish onboarding</Link>
          </div>
        </form>
      </section>
    </>
  );
}
