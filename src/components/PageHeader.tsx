import Link from "next/link";

export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs = [],
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}) {
  return (
    <div className="border-b border-navy-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {crumbs.length > 0 && (
          <nav className="text-sm text-navy-700 mb-4" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1">
              {crumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-1">
                  {c.href ? (
                    <Link href={c.href} className="hover:text-navy-900 underline-offset-2 hover:underline">{c.label}</Link>
                  ) : (
                    <span className="text-navy-900">{c.label}</span>
                  )}
                  {i < crumbs.length - 1 && <span aria-hidden>›</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            {eyebrow && (
              <div className="text-xs uppercase tracking-[0.2em] text-gold-600 mb-3">{eyebrow}</div>
            )}
            <h1 className="font-serif text-4xl md:text-5xl text-navy-900 tracking-tight leading-tight">{title}</h1>
            {description && (
              <p className="mt-4 max-w-3xl text-lg text-ink-soft leading-relaxed">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
