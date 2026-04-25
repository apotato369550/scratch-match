import Link from "next/link";
import { Seal } from "@/components/Seal";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-navy-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold-600">
              <span className="inline-block h-1.5 w-6 bg-gold-500" /> Public Service Notice
            </div>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl text-navy-900 tracking-tight leading-tight">
              Match your work to the people who need it — within Cebu.
            </h1>
            <p className="mt-4 text-base text-ink-soft max-w-xl">
              Scratch Match is a locally-bound, AI-assisted employment matching service for job
              seekers and employers in the Province of Cebu. Upload your CV, post a vacancy, or
              consult our advisor — all data is stored on-premise.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-primary">Register for the Service</Link>
              <Link href="/login" className="btn-secondary">Sign in</Link>
              <Link href="/sitemap" className="btn-ghost">View all pages →</Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="badge-navy">SDG 8</span>
              <span className="badge-gold">Prototype POC</span>
              <span className="badge-muted">Cebu-only</span>
              <span className="badge-muted">On-premise AI</span>
            </div>
          </div>
          <div className="card p-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 opacity-10"><Seal size={220} /></div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-navy-700">Three roles · One service</div>
            <div className="mt-4 space-y-3">
              <RoleRow
                title="Job Seekers"
                desc="Upload up to 5 CVs per specialization. Get matched. Talk to an advisor."
                href="/seeker/dashboard"
              />
              <RoleRow
                title="Employers"
                desc="Post up to 5 openings. Surface candidates. Ask the hiring assistant."
                href="/employer/dashboard"
              />
              <RoleRow
                title="Administrators"
                desc="Single seeded account. Moderates listings, users and records."
                href="/admin"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service pillars */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-gold-600">How the service works</div>
            <h2 className="section-title mt-1">Three pillars</h2>
          </div>
          <div className="hidden md:block h-px flex-1 mx-6 bg-navy-100" />
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <Pillar n="01" title="Vectorized Matching"
            body="CVs and job descriptions are parsed, chunked and embedded with a local model. Qdrant powers the semantic match." />
          <Pillar n="02" title="Retrieval-Augmented Advice"
            body="A local Mistral model answers career and hiring questions, grounded in your own documents and the live listing pool." />
          <Pillar n="03" title="Local & Private"
            body="Storage is SQLite on disk; embeddings live in a Qdrant container; nothing leaves the host machine." />
        </div>
      </section>

      {/* Notice strip */}
      <section className="border-t border-b border-navy-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 grid md:grid-cols-3 gap-6 text-sm">
          <NoticeItem label="Issued by" value="Scratch Match Service · Cebu" />
          <NoticeItem label="Effective" value="Prototype POC · 2026" />
          <NoticeItem label="Coverage" value="All municipalities of the Province of Cebu" />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="card p-8 md:p-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl text-navy-900">Ready to begin?</h3>
            <p className="text-sm text-ink-soft mt-1">Choose your role and we will guide you through onboarding.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/onboarding/seeker" className="btn-secondary">I am a Job Seeker</Link>
            <Link href="/onboarding/employer" className="btn-primary">I am an Employer</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function RoleRow({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="block rounded-sm border border-navy-100 bg-white/60 hover:bg-parchment transition p-4">
      <div className="flex items-center justify-between">
        <div className="font-serif text-lg text-navy-900">{title}</div>
        <span className="text-gold-600 text-sm">Open →</span>
      </div>
      <p className="text-sm text-ink-soft mt-1">{desc}</p>
    </Link>
  );
}

function Pillar({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="card p-6 relative">
      <div className="font-mono text-xs text-gold-600">{n}</div>
      <h3 className="font-serif text-xl text-navy-900 mt-2">{title}</h3>
      <p className="mt-2 text-sm text-ink-soft">{body}</p>
      <div className="mt-4 divider-rule" />
    </div>
  );
}

function NoticeItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.18em] text-navy-700">{label}</div>
      <div className="mt-0.5 text-ink">{value}</div>
    </div>
  );
}
