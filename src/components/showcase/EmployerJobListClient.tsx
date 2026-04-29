"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/Modal";
import { JobModalBody } from "./JobModalBody";
import type { ShowcaseJob } from "@/lib/showcase";

export function EmployerJobListClient({ jobs }: { jobs: ShowcaseJob[] }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const open = jobs.find((j) => j.id === openId) ?? null;

  return (
    <>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy-50 text-navy-800">
            <tr className="text-left">
              <th className="px-5 py-3 font-semibold">Title</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Posted</th>
              <th className="px-5 py-3 font-semibold">Applicants</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {jobs.map((j) => (
              <tr key={j.id}>
                <td className="px-5 py-4 font-medium text-navy-900">{j.title}</td>
                <td className="px-5 py-4">
                  {j.status === "open" ? (
                    <span className="badge-green">Open</span>
                  ) : (
                    <span className="badge-muted">Closed</span>
                  )}
                </td>
                <td className="px-5 py-4 text-ink-soft">{j.posted_at}</td>
                <td className="px-5 py-4 text-ink-soft">{j.applicants}</td>
                <td className="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => setOpenId(j.id)} className="btn-secondary">View</button>
                  <Link href="/employer/candidates" className="btn-ghost">Candidates</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!open}
        onClose={() => setOpenId(null)}
        title={open?.title ?? ""}
        subtitle={open ? `${open.company} · ${open.location} · ${open.salary_range}` : undefined}
        size="lg"
        footer={
          <>
            <button onClick={() => setOpenId(null)} className="btn-ghost">Close</button>
            <Link href="/employer/candidates" className="btn-primary">View candidates</Link>
          </>
        }
      >
        {open && <JobModalBody job={open} />}
      </Modal>
    </>
  );
}
