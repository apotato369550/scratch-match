"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/Modal";
import { JobModalBody } from "./JobModalBody";
import type { ShowcaseJob, ShowcaseCv, ShowcaseMatch } from "@/lib/showcase";

type Row = { match: ShowcaseMatch; job: ShowcaseJob; cv: ShowcaseCv };

export function MatchListClient({ rows }: { rows: Row[] }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const open = rows.find((r) => r.job.id === openId) ?? null;

  return (
    <>
      <ul className="space-y-3">
        {rows.map(({ match, job, cv }) => (
          <li key={`${match.cv_id}-${match.job_id}`} className="card p-6 flex flex-wrap items-start gap-4 justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-xl text-navy-900">{job.title}</h3>
                <span className="badge-gold">Match {(match.score * 100).toFixed(0)}%</span>
              </div>
              <div className="text-sm text-ink-soft mt-0.5">
                {job.company} · {job.location} · {job.salary_range}
              </div>
              <p className="text-sm mt-2 text-ink-soft leading-relaxed">{job.summary}</p>
              <p className="text-xs mt-2 text-navy-700">
                <span className="font-semibold">Matched against:</span> {cv.filename}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setOpenId(job.id)} className="btn-secondary">View posting</button>
              <Link href="/seeker/chat" className="btn-primary">Ask advisor</Link>
            </div>
          </li>
        ))}
      </ul>

      <Modal
        open={!!open}
        onClose={() => setOpenId(null)}
        title={open?.job.title ?? ""}
        subtitle={open ? `${open.job.company} · ${open.job.location}` : undefined}
        size="lg"
        footer={
          <>
            <button onClick={() => setOpenId(null)} className="btn-ghost">Close</button>
            <Link href="/seeker/chat" className="btn-primary">Ask the advisor</Link>
          </>
        }
      >
        {open && (
          <>
            <div className="mb-5 rounded-md border border-gold-500/40 bg-gold-400/10 px-4 py-3">
              <div className="text-xs uppercase tracking-wider text-gold-600 mb-1">
                Why this matches
              </div>
              <p className="text-sm text-navy-900 leading-relaxed">{open.match.rationale}</p>
            </div>
            <JobModalBody job={open.job} score={open.match.score} />
          </>
        )}
      </Modal>
    </>
  );
}
