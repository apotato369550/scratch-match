"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type NavItem = { href: string; label: string; hint?: string };

export function TopNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [indicator, setIndicator] = useState<{ left: number; width: number; ready: boolean }>({
    left: 0,
    width: 0,
    ready: false,
  });

  const activeIdx = items.findIndex(
    (it) => pathname === it.href || pathname.startsWith(it.href + "/")
  );

  useLayoutEffect(() => {
    const el = activeIdx >= 0 ? itemRefs.current[activeIdx] : null;
    const wrap = containerRef.current;
    if (!el || !wrap) {
      setIndicator((s) => ({ ...s, ready: false }));
      return;
    }
    const elRect = el.getBoundingClientRect();
    const wrapRect = wrap.getBoundingClientRect();
    setIndicator({
      left: elRect.left - wrapRect.left + wrap.scrollLeft,
      width: elRect.width,
      ready: true,
    });
  }, [pathname, activeIdx, items.length]);

  useEffect(() => {
    function onResize() {
      const el = activeIdx >= 0 ? itemRefs.current[activeIdx] : null;
      const wrap = containerRef.current;
      if (!el || !wrap) return;
      const elRect = el.getBoundingClientRect();
      const wrapRect = wrap.getBoundingClientRect();
      setIndicator((s) => ({
        ...s,
        left: elRect.left - wrapRect.left + wrap.scrollLeft,
        width: elRect.width,
      }));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeIdx]);

  return (
    <div className="border-b border-navy-100 bg-white">
      <div
        ref={containerRef}
        className="relative mx-auto max-w-7xl px-6 flex items-center gap-1 overflow-x-auto whitespace-nowrap"
      >
        {items.map((it, i) => {
          const active = i === activeIdx;
          return (
            <Link
              key={it.href}
              href={it.href}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className={
                "relative px-4 py-4 text-base transition-colors " +
                (active
                  ? "text-navy-900 font-semibold"
                  : "text-navy-700 hover:text-navy-900")
              }
            >
              {it.label}
            </Link>
          );
        })}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-[3px] bg-gold-500 rounded-full"
          style={{
            transform: `translateX(${indicator.left}px)`,
            width: indicator.width,
            opacity: indicator.ready ? 1 : 0,
            transition: "transform 250ms ease, width 250ms ease, opacity 200ms ease",
          }}
        />
      </div>
    </div>
  );
}
