"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/Modal";
import type { ShowcaseCv } from "@/lib/showcase";

export function CvListClient({ cvs }: { cvs: ShowcaseCv[] }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const open = cvs.find((c) => c.id === openId) ?? null;

  return (
    <>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 text-navy-800">
            <tr className="text-left">
              <th className="px-5 py-3 font-semibold">File</th>
              <th className="px-5 py-3 font-semibold">Specialization</th>
              <th className="px-5 py-3 font-semibold">Uploaded</th>
              <th className="px-5 py-3 font-semibold">Chunks</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {cvs.map((cv) => (
              <tr key={cv.id} className="align-middle">
                <td className="px-5 py-4 font-mono text-xs">{cv.filename}</td>
                <td className="px-5 py-4">
                  <span className="badge-navy">{cv.specialization}</span>
                </td>
                <td className="px-5 py-4 text-ink-soft">{cv.uploaded_at}</td>
                <td className="px-5 py-4 text-ink-soft">{cv.chunks}</td>
                <td className="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => setOpenId(cv.id)} className="btn-secondary">
                    View
                  </button>
                  <Link href="/seeker/matches" className="btn-ghost">
                    Matches
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!open}
        onClose={() => setOpenId(null)}
        title={open?.seeker_name ?? ""}
        subtitle={open ? `${open.specialization} · ${open.filename}` : undefined}
        size="lg"
        footer={
          <>
            <button onClick={() => setOpenId(null)} className="btn-ghost">Close</button>
            <Link href="/seeker/matches" className="btn-primary">See matches</Link>
          </>
        }
      >
        {open && <CvBody cv={open} />}
      </Modal>
    </>
  );
}

function CvBody({ cv }: { cv: ShowcaseCv }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-wider text-gold-600">Headline</div>
        <p className="mt-1 text-lg text-navy-900 leading-relaxed">{cv.headline}</p>
      </div>

      <Section title="Summary">
        <p className="text-base text-ink-soft leading-relaxed">{cv.summary}</p>
      </Section>

      <Section title="Skills">
        <div className="flex flex-wrap gap-2">
          {cv.skills.map((s) => (
            <span key={s} className="badge-muted">{s}</span>
          ))}
        </div>
      </Section>

      <Section title="Experience">
        <ul className="space-y-4">
          {cv.experience.map((e, i) => (
            <li key={i} className="border-l-2 border-gold-500 pl-4">
              <div className="font-semibold text-navy-900">
                {e.title} — {e.company}
              </div>
              <div className="text-xs text-navy-700">{e.location} · {e.period}</div>
              <p className="mt-1.5 text-sm text-ink-soft leading-relaxed">{e.details}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Education">
        <ul className="space-y-1.5 text-sm text-ink-soft">
          {cv.education.map((e, i) => (
            <li key={i}>
              <span className="font-medium text-navy-900">{e.degree}</span> · {e.school} ({e.year})
            </li>
          ))}
        </ul>
      </Section>

      {cv.languages.length > 0 && (
        <Section title="Languages">
          <p className="text-sm text-ink-soft">{cv.languages.join(" · ")}</p>
        </Section>
      )}

      <Section title="Full text (as ingested)">
        <pre className="whitespace-pre-wrap font-sans text-sm text-ink-soft leading-relaxed bg-parchment border border-navy-100 rounded-md p-4">
          {cv.full_text}
        </pre>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-gold-600 mb-2">{title}</div>
      {children}
    </div>
  );
}
