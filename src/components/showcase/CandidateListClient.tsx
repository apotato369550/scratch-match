"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/Modal";
import type { ShowcaseCv, ShowcaseSeeker, ShowcaseMatch } from "@/lib/showcase";

type Row = { match: ShowcaseMatch; cv: ShowcaseCv; seeker: ShowcaseSeeker };

export function CandidateListClient({ rows }: { rows: Row[] }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const open = rows.find((r) => r.cv.id === openId) ?? null;

  return (
    <>
      <ul className="space-y-3">
        {rows.map(({ match, cv, seeker }) => (
          <li key={cv.id} className="card p-6 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-xl text-navy-900">{seeker.name}</h3>
                <span className="badge-gold">Fit {(match.score * 100).toFixed(0)}%</span>
              </div>
              <div className="text-sm text-ink-soft mt-0.5">
                {cv.specialization} · {seeker.location} · {seeker.years_experience} yrs experience
              </div>
              <p className="text-sm mt-2 text-ink-soft leading-relaxed">{cv.headline}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setOpenId(cv.id)} className="btn-secondary">View profile</button>
              <Link href="/employer/chat" className="btn-primary">Ask assistant</Link>
            </div>
          </li>
        ))}
      </ul>

      <Modal
        open={!!open}
        onClose={() => setOpenId(null)}
        title={open?.seeker.name ?? ""}
        subtitle={
          open ? `${open.cv.specialization} · ${open.seeker.location} · ${open.seeker.years_experience} yrs experience` : undefined
        }
        size="lg"
        footer={
          <>
            <button onClick={() => setOpenId(null)} className="btn-ghost">Close</button>
            <button className="btn-primary">Record match</button>
          </>
        }
      >
        {open && (
          <div className="space-y-6">
            <div className="rounded-md border border-gold-500/40 bg-gold-400/10 px-4 py-3">
              <div className="text-xs uppercase tracking-wider text-gold-600 mb-1">
                Why this candidate
              </div>
              <p className="text-sm text-navy-900 leading-relaxed">{open.match.rationale}</p>
            </div>
            <Sec title="Bio">
              <p className="text-base text-ink-soft leading-relaxed">{open.seeker.bio}</p>
            </Sec>
            <Sec title="CV summary">
              <p className="text-base text-ink-soft leading-relaxed">{open.cv.summary}</p>
            </Sec>
            <Sec title="Skills">
              <div className="flex flex-wrap gap-2">
                {open.cv.skills.map((s) => <span key={s} className="badge-muted">{s}</span>)}
              </div>
            </Sec>
            <Sec title="Experience">
              <ul className="space-y-4">
                {open.cv.experience.map((e, i) => (
                  <li key={i} className="border-l-2 border-gold-500 pl-4">
                    <div className="font-semibold text-navy-900">{e.title} — {e.company}</div>
                    <div className="text-xs text-navy-700">{e.location} · {e.period}</div>
                    <p className="mt-1.5 text-sm text-ink-soft leading-relaxed">{e.details}</p>
                  </li>
                ))}
              </ul>
            </Sec>
            <Sec title="Education">
              <ul className="space-y-1.5 text-sm text-ink-soft">
                {open.cv.education.map((e, i) => (
                  <li key={i}><span className="font-medium text-navy-900">{e.degree}</span> · {e.school} ({e.year})</li>
                ))}
              </ul>
            </Sec>
          </div>
        )}
      </Modal>
    </>
  );
}

function Sec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-gold-600 mb-2">{title}</div>
      {children}
    </div>
  );
}
