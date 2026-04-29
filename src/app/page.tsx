import Link from "next/link";
import { SeekerIcon, EmployerIcon, AdminIcon } from "@/components/RoleIcon";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-navy-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="max-w-4xl">
            <h1 className="font-serif text-5xl md:text-6xl text-navy-900 tracking-tight leading-[1.1]">
              Match your work to the people who need it — within Cebu.
            </h1>
            <p className="mt-6 lead max-w-2xl">
              Scratch Match is a locally-bound, AI-assisted employment matching service for
              job seekers and employers in the Province of Cebu. Upload your CV, post a
              vacancy, or consult our advisor — all data stays on-premise.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-primary">Register for the Service</Link>
              <Link href="/login" className="btn-secondary">Sign in</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Role picker */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10">
          <h2 className="section-title">Choose your role</h2>
          <p className="mt-2 lead">Three roles. One service. Pick where you belong.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <RoleCard
            icon={<SeekerIcon />}
            title="Job Seekers"
            desc="Upload up to 5 CVs per specialization. Get matched. Talk to an advisor."
            href="/seeker/dashboard"
            cta="Open Job-Seeker portal"
          />
          <RoleCard
            icon={<EmployerIcon />}
            title="Employers"
            desc="Post up to 5 openings. Surface candidates. Ask the hiring assistant."
            href="/employer/dashboard"
            cta="Open Employer portal"
          />
          <RoleCard
            icon={<AdminIcon />}
            title="Administrators"
            desc="Single seeded account. Moderates listings, users and records."
            href="/admin"
            cta="Open Admin console"
          />
        </div>
      </section>

      {/* Service pillars */}
      <section className="border-t border-navy-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10">
            <h2 className="section-title">How the service works</h2>
            <p className="mt-2 lead">Three pillars hold the whole thing up.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Pillar
              n="01"
              title="Vectorized Matching"
              body="CVs and job descriptions are parsed, chunked, and embedded with a local model. Qdrant powers the semantic match."
            />
            <Pillar
              n="02"
              title="Retrieval-Augmented Advice"
              body="A live retrieval layer grounds every answer in your own documents and the current listing pool — no hallucinated jobs, no invented companies."
            />
            <Pillar
              n="03"
              title="Local LLM"
              body="A Mistral model runs entirely on the host via Ollama. No cloud inference, no per-token billing, no PII leaving the machine."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="card p-10 md:p-12 flex flex-wrap items-center justify-between gap-8">
          <div>
            <h3 className="font-serif text-3xl text-navy-900">Ready to begin?</h3>
            <p className="mt-2 text-lg text-ink-soft">Choose your role and we will guide you through onboarding.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/onboarding/seeker" className="btn-secondary">I am a Job Seeker</Link>
            <Link href="/onboarding/employer" className="btn-primary">I am an Employer</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function RoleCard({
  icon,
  title,
  desc,
  href,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="card p-8 flex flex-col text-navy-800">
      <div className="text-navy-800">{icon}</div>
      <h3 className="mt-5 font-serif text-2xl text-navy-900">{title}</h3>
      <p className="mt-3 text-base text-ink-soft leading-relaxed flex-1">{desc}</p>
      <Link href={href} className="btn-primary mt-6 self-start">
        {cta} →
      </Link>
    </div>
  );
}

function Pillar({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="card p-8">
      <div className="font-mono text-sm text-gold-600">{n}</div>
      <h3 className="font-serif text-2xl text-navy-900 mt-3">{title}</h3>
      <p className="mt-3 text-base text-ink-soft leading-relaxed">{body}</p>
      <div className="mt-6 divider-rule" />
    </div>
  );
}
