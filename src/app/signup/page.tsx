import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export default function SignupPage() {
  return (
    <>
      <PageHeader
        eyebrow="New Registration"
        title="Register with Scratch Match"
        description="Choose the role that applies to you. Administrator accounts are not issued through this form."
        crumbs={[{ label: "Home", href: "/" }, { label: "Register" }]}
      />
      <section className="mx-auto max-w-3xl px-4 py-10">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <RoleCard
            title="Job Seeker"
            note="For individuals seeking employment in Cebu."
            href="/onboarding/seeker"
          />
          <RoleCard
            title="Employer"
            note="For private companies, schools, and government offices."
            href="/onboarding/employer"
          />
        </div>
        <form className="card p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Legal Name</label>
              <input className="input" placeholder="Juan dela Cruz" />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input type="email" className="input" placeholder="you@example.ph" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" placeholder="At least 12 characters" />
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input type="password" className="input" />
            </div>
            <div>
              <label className="label">Account Type</label>
              <select className="select">
                <option>Job Seeker</option>
                <option>Employer</option>
              </select>
            </div>
            <div>
              <label className="label">Municipality (Cebu)</label>
              <select className="select">
                <option>Cebu City</option><option>Mandaue City</option><option>Lapu-Lapu City</option>
                <option>Talisay City</option><option>Toledo City</option><option>Carcar City</option>
                <option>Danao City</option><option>Other</option>
              </select>
            </div>
          </div>
          <label className="flex items-start gap-2 text-xs text-navy-700">
            <input type="checkbox" className="mt-0.5 accent-navy-700" />
            I confirm I am a resident of, or operate within, the Province of Cebu and accept the
            terms of this prototype service.
          </label>
          <div className="flex items-center justify-between gap-3">
            <Link href="/login" className="text-xs text-navy-800 underline">Already registered?</Link>
            <button className="btn-primary">Continue to onboarding</button>
          </div>
        </form>
      </section>
    </>
  );
}

function RoleCard({ title, note, href }: { title: string; note: string; href: string }) {
  return (
    <Link href={href} className="card p-5 block hover:bg-parchment transition">
      <div className="flex items-center justify-between">
        <div className="font-serif text-lg text-navy-900">{title}</div>
        <span className="text-gold-600 text-sm">Begin →</span>
      </div>
      <p className="text-sm text-ink-soft mt-1">{note}</p>
    </Link>
  );
}
