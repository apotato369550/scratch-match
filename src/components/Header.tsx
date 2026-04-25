import Link from "next/link";
import { Seal } from "./Seal";

export function Header() {
  return (
    <header className="border-b border-navy-100 bg-white">
      <div className="gov-stripe" />
      <div className="bg-navy-900 text-navy-100/90 text-[11px]">
        <div className="mx-auto max-w-6xl px-4 py-1.5 flex items-center justify-between">
          <span className="tracking-wider uppercase">An Official Prototype · Province of Cebu</span>
          <span className="hidden sm:inline tracking-wider uppercase">SDG 8 · Decent Work & Economic Growth</span>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <Seal />
          <div className="leading-tight">
            <div className="font-serif text-xl text-navy-900">Scratch Match</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-navy-700">Cebu Employment Matching Service</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link href="/seeker/dashboard" className="btn-ghost">Job Seeker</Link>
          <Link href="/employer/dashboard" className="btn-ghost">Employer</Link>
          <Link href="/admin" className="btn-ghost">Admin</Link>
          <Link href="/sitemap" className="btn-ghost">Sitemap</Link>
          <span className="mx-2 h-6 w-px bg-navy-100" />
          <Link href="/login" className="btn-secondary">Sign in</Link>
          <Link href="/signup" className="btn-primary">Register</Link>
        </nav>
      </div>
    </header>
  );
}
