import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-navy-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between gap-6">
        <Link href="/" className="leading-tight">
          <div className="font-serif text-2xl text-navy-900 tracking-tight">Scratch Match</div>
          <div className="text-xs text-navy-700">Cebu Employment Matching Service</div>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          <Link href="/seeker/dashboard" className="btn-ghost">Job Seekers</Link>
          <Link href="/employer/dashboard" className="btn-ghost">Employers</Link>
          <Link href="/admin" className="btn-ghost">Admin</Link>
          <span className="mx-2 h-6 w-px bg-navy-100" />
          <Link href="/login" className="btn-secondary">Sign in</Link>
          <Link href="/signup" className="btn-primary">Register</Link>
        </nav>
      </div>
    </header>
  );
}
