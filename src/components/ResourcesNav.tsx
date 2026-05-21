"use client";

import { useState } from "react";
import { Modal } from "./Modal";

type Resource = "brochure" | "tarpaulin" | null;

export function ResourcesNav() {
  const [open, setOpen] = useState<Resource>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen("brochure")}
        className="btn-ghost"
      >
        Brochure
      </button>
      <button
        type="button"
        onClick={() => setOpen("tarpaulin")}
        className="btn-ghost"
      >
        Tarpaulin
      </button>

      <Modal
        open={open === "brochure"}
        onClose={() => setOpen(null)}
        title="View the Brochure"
        subtitle="Tri-fold · A4 landscape · designed for the presentation"
        size="md"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setOpen(null)}>
              Cancel
            </button>
            <a
              href="/brochure/brochure.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              onClick={() => setOpen(null)}
            >
              Open brochure →
            </a>
          </>
        }
      >
        <p className="text-sm text-ink-soft leading-relaxed">
          The full Scratch Match pitch in three folds — the problem, the four personas,
          how the matcher actually works, the tech stack, FAQ, and contact details.
          Print-ready, designed for the showcase.
        </p>
        <p className="text-sm text-ink-soft leading-relaxed mt-3">
          Opens in a new tab as a styled HTML brochure.
        </p>
      </Modal>

      <Modal
        open={open === "tarpaulin"}
        onClose={() => setOpen(null)}
        title="View the Tarpaulin"
        subtitle="Project poster · 2ft × 6ft standee · HTML"
        size="md"
        footer={
          <>
            <button className="btn-ghost" onClick={() => setOpen(null)}>
              Cancel
            </button>
            <a
              href="/tarpaulin/tarpaulin.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              onClick={() => setOpen(null)}
            >
              Open tarpaulin →
            </a>
          </>
        }
      >
        <p className="text-sm text-ink-soft leading-relaxed">
          One-glance summary of the project — the why, the SDG-8 alignment, and the
          call for feedback. The poster we are bringing to the design showcase.
        </p>
        <p className="text-sm text-ink-soft leading-relaxed mt-3">
          Opens the styled HTML standee in a new tab.
        </p>
      </Modal>
    </>
  );
}
