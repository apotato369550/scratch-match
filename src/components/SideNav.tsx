"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; label: string; hint?: string };

export function SideNav({ title, items }: { title: string; items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <aside className="card p-2 sticky top-4 self-start">
      <div className="px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-navy-700 border-b border-navy-100">
        {title}
      </div>
      <nav className="p-1">
        {items.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + "/");
          return (
            <Link
              key={it.href}
              href={it.href}
              className={
                "block rounded-sm px-3 py-2 text-sm transition border-l-2 " +
                (active
                  ? "bg-navy-50 border-gold-500 text-navy-900 font-semibold"
                  : "border-transparent text-navy-800 hover:bg-parchment")
              }
            >
              <div>{it.label}</div>
              {it.hint && <div className="text-[11px] text-navy-700/80">{it.hint}</div>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
