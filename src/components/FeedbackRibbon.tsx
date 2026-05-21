"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "sm:feedback-ribbon-dismissed";
const FORM_URL = "https://forms.gle/Ho1yqDs8PZTxikxq6";

export function FeedbackRibbon() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setHidden(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  if (hidden) return null;

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setHidden(true);
  };

  return (
    <div className="bg-gold-500 text-navy-900 border-b border-gold-600">
      <div className="mx-auto max-w-7xl px-6 py-2.5 flex items-center gap-4 text-sm">
        <span className="font-semibold uppercase tracking-wider text-xs hidden sm:inline">
          Prototype feedback
        </span>
        <span className="flex-1 leading-snug">
          Help us shape v2 — we have 12 of 30 responses so far. Two minutes,
          anonymous, directly informs our final presentation.
        </span>
        <a
          href={FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 bg-navy-900 text-gold-400 px-3 py-1.5 rounded font-semibold whitespace-nowrap hover:bg-navy-700"
        >
          Send feedback →
        </a>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="text-navy-800 hover:text-navy-900 text-lg leading-none px-1"
        >
          ×
        </button>
      </div>
    </div>
  );
}
