"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/Modal";
import { JobModalBody } from "./JobModalBody";
import type { ShowcaseJob } from "@/lib/showcase";

export function JobListClient({ jobs, askHref = "/seeker/chat" }: { jobs: ShowcaseJob[]; askHref?: string }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const open = jobs.find((j) => j.id === openId) ?? null;

  return (
    <>
      <ul className="grid md:grid-cols-2 gap-5">
        {jobs.map((j) => (
          <li key={j.id} className="card p-6 flex flex-col">
            <h3 className="font-serif text-xl text-navy-900">{j.title}</h3>
            <div className="text-sm text-ink-soft mt-1">
              {j.company} · {j.location} · {j.salary_range}
            </div>
            <p className="mt-3 text-sm text-ink-soft leading-relaxed flex-1">{j.summary}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {j.tags.map((t) => (
                <span key={t} className="badge-muted">{t}</span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={() => setOpenId(j.id)} className="btn-primary">View posting</button>
              <Link href={askHref} className="btn-ghost">How should I apply?</Link>
            </div>
          </li>
        ))}
      </ul>

      <Modal
        open={!!open}
        onClose={() => setOpenId(null)}
        title={open?.title ?? ""}
        subtitle={open ? `${open.company} · ${open.location} · ${open.salary_range}` : undefined}
        size="lg"
        footer={
          <>
            <button onClick={() => setOpenId(null)} className="btn-ghost">Close</button>
            <Link href={askHref} className="btn-primary">Ask the advisor</Link>
          </>
        }
      >
        {open && <JobModalBody job={open} />}
      </Modal>
    </>
  );
}
