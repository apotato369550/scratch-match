import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-navy-100 bg-navy-900 text-navy-100">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="font-serif text-xl">Scratch Match</div>
          <p className="mt-3 text-sm text-navy-200/80 leading-relaxed max-w-md">
            A locally-bound, AI-assisted employment matching prototype serving
            Cebu City.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-gold-400 mb-3">Service</div>
          <ul className="space-y-1.5 text-sm">
            <li><Link href="/login" className="hover:text-gold-400">Sign in</Link></li>
            <li><Link href="/signup" className="hover:text-gold-400">Register</Link></li>
            <li><Link href="/admin" className="hover:text-gold-400">Admin Console</Link></li>
            <li><Link href="/sitemap" className="hover:text-gold-400">Sitemap</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-gold-400 mb-3">Resources</div>
          <ul className="space-y-1.5 text-sm">
            <li><a href="/brochure/brochure.html" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400">Brochure (HTML)</a></li>
            <li><a href="/tarpaulin/tarpaulin.html" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400">Tarpaulin (HTML)</a></li>
            <li><a href="https://forms.gle/Ho1yqDs8PZTxikxq6" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400">Send feedback →</a></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-gold-400 mb-3">Privacy</div>
          <p className="text-sm text-navy-200/80 leading-relaxed">
            Data stored locally. Models run on-premise. No PII leaves the host.
          </p>
        </div>
      </div>
      <div className="border-t border-navy-700/60">
        <div className="mx-auto max-w-7xl px-6 py-4 text-xs text-navy-200/70">
          © 2026 Scratch Match Prototype · Not affiliated with any government office.
        </div>
      </div>
    </footer>
  );
}
