"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/Modal";
import type { ShowcaseSeeker, ShowcaseCv } from "@/lib/showcase";

export function SeekerListClient({
  seekers,
  cvsBySeeker,
}: {
  seekers: ShowcaseSeeker[];
  cvsBySeeker: Record<number, ShowcaseCv[]>;
}) {
  const [openId, setOpenId] = useState<number | null>(null);
  const open = seekers.find((s) => s.id === openId) ?? null;
  const openCvs = open ? cvsBySeeker[open.id] ?? [] : [];

  return (
    <>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 text-navy-800">
            <tr className="text-left">
              <th className="px-5 py-3 font-semibold">Name</th>
              <th className="px-5 py-3 font-semibold">Specialization</th>
              <th className="px-5 py-3 font-semibold">Location</th>
              <th className="px-5 py-3 font-semibold">Experience</th>
              <th className="px-5 py-3 font-semibold">CVs</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {seekers.map((s) => (
              <tr key={s.id}>
                <td className="px-5 py-4 font-medium text-navy-900">{s.name}</td>
                <td className="px-5 py-4">
                  <span className="badge-navy">{s.primary_specialization}</span>
                </td>
                <td className="px-5 py-4 text-ink-soft">{s.location}</td>
                <td className="px-5 py-4 text-ink-soft">{s.years_experience} yrs</td>
                <td className="px-5 py-4 text-ink-soft">{s.cv_count}</td>
                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <button onClick={() => setOpenId(s.id)} className="btn-secondary">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!open}
        onClose={() => setOpenId(null)}
        title={open?.name ?? ""}
        subtitle={open ? `${open.primary_specialization} · ${open.location} · ${open.years_experience} yrs` : undefined}
        size="lg"
        footer={
          <>
            <button onClick={() => setOpenId(null)} className="btn-ghost">Close</button>
            <Link href="/employer/chat" className="btn-primary">Ask the assistant</Link>
          </>
        }
      >
        {open && (
          <div className="space-y-6">
            <Sec title="Headline">
              <p className="text-lg text-navy-900 leading-relaxed">{open.headline}</p>
            </Sec>
            <Sec title="Bio">
              <p className="text-base text-ink-soft leading-relaxed">{open.bio}</p>
            </Sec>
            {openCvs.length > 0 && (
              <Sec title={`CVs on file (${openCvs.length})`}>
                <ul className="space-y-3">
                  {openCvs.map((cv) => (
                    <li key={cv.id} className="border border-navy-100 rounded-md p-4">
                      <div className="font-mono text-xs text-navy-700">{cv.filename}</div>
                      <div className="mt-1 text-sm font-semibold text-navy-900">{cv.specialization}</div>
                      <p className="mt-1.5 text-sm text-ink-soft leading-relaxed">{cv.summary}</p>
                    </li>
                  ))}
                </ul>
              </Sec>
            )}
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
