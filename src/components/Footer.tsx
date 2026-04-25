import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-navy-100 bg-navy-900 text-navy-100">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="font-serif text-lg">Scratch Match</div>
          <p className="mt-2 text-sm text-navy-200/80">
            A locally-bound, AI-assisted employment matching prototype serving the
            Province of Cebu in alignment with UN SDG&nbsp;8.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-gold-400 mb-2">Job Seekers</div>
          <ul className="space-y-1 text-sm">
            <li><Link href="/seeker/dashboard" className="hover:text-gold-400">Dashboard</Link></li>
            <li><Link href="/seeker/cvs" className="hover:text-gold-400">My CVs</Link></li>
            <li><Link href="/seeker/cvs/upload" className="hover:text-gold-400">Upload CV</Link></li>
            <li><Link href="/seeker/matches" className="hover:text-gold-400">Matches</Link></li>
            <li><Link href="/seeker/jobs" className="hover:text-gold-400">Search Jobs</Link></li>
            <li><Link href="/seeker/chat" className="hover:text-gold-400">Career Advisor</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-gold-400 mb-2">Employers</div>
          <ul className="space-y-1 text-sm">
            <li><Link href="/employer/dashboard" className="hover:text-gold-400">Dashboard</Link></li>
            <li><Link href="/employer/jobs" className="hover:text-gold-400">My Postings</Link></li>
            <li><Link href="/employer/jobs/new" className="hover:text-gold-400">Post a Job</Link></li>
            <li><Link href="/employer/candidates" className="hover:text-gold-400">Candidates</Link></li>
            <li><Link href="/employer/seekers" className="hover:text-gold-400">Search Seekers</Link></li>
            <li><Link href="/employer/chat" className="hover:text-gold-400">Hiring Assistant</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-gold-400 mb-2">Service</div>
          <ul className="space-y-1 text-sm">
            <li><Link href="/login" className="hover:text-gold-400">Sign in</Link></li>
            <li><Link href="/signup" className="hover:text-gold-400">Register</Link></li>
            <li><Link href="/onboarding/seeker" className="hover:text-gold-400">Seeker Onboarding</Link></li>
            <li><Link href="/onboarding/employer" className="hover:text-gold-400">Employer Onboarding</Link></li>
            <li><Link href="/admin" className="hover:text-gold-400">Admin Console</Link></li>
            <li><Link href="/sitemap" className="hover:text-gold-400">Sitemap</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-700/60">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-navy-200/70 flex flex-col sm:flex-row justify-between gap-2">
          <span>© 2026 Scratch Match Prototype · Not affiliated with any government office.</span>
          <span>Data stored locally · Models run on-premise · No PII leaves the host.</span>
        </div>
      </div>
    </footer>
  );
}
