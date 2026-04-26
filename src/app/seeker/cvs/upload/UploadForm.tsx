"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function UploadForm() {
  const router = useRouter();
  const [specialization, setSpecialization] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!specialization.trim()) return setError("Specialization is required.");
    if (!file && text.trim().length < 100) {
      return setError("Provide a PDF or paste at least 100 characters of CV text.");
    }
    setBusy(true);
    try {
      const form = new FormData();
      form.set("specialization", specialization.trim());
      if (file) form.set("file", file);
      else form.set("text", text);

      const res = await fetch("/api/seeker/cvs", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }
      router.push(`/seeker/matches?cv=${data.cv_id}`);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 space-y-5">
      <div>
        <label className="label">Specialization</label>
        <input
          className="input"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          placeholder="e.g. Frontend Development"
        />
        <p className="text-[11px] text-navy-700 mt-1">
          Reuse an existing specialization to keep CVs grouped.
        </p>
      </div>
      <div>
        <label className="label">CV File (PDF)</label>
        <div className="rounded-sm border-2 border-dashed border-navy-200 bg-parchment p-8 text-center">
          <div className="font-serif text-lg text-navy-900">
            {file ? file.name : "Drop your PDF here"}
          </div>
          <div className="text-xs text-ink-soft mt-1">
            {file ? `${(file.size / 1024).toFixed(1)} KB` : "or click to browse"}
          </div>
          <input
            type="file"
            accept=".pdf"
            className="mt-4 mx-auto block text-xs"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>
      <div className="text-center text-xs text-navy-700 uppercase tracking-wider">— or —</div>
      <div>
        <label className="label">Paste CV Text</label>
        <textarea
          className="textarea min-h-[180px]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the full content of your CV here…"
          disabled={!!file}
        />
      </div>
      {error && <p className="text-sm text-seal-700">{error}</p>}
      <div className="flex items-center justify-between">
        <Link href="/seeker/cvs" className="btn-ghost">← Back to CVs</Link>
        <button type="submit" disabled={busy} className="btn-primary">
          {busy ? "Ingesting…" : "Ingest & Match"}
        </button>
      </div>
    </form>
  );
}
