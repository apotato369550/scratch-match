"use client";

import { useState } from "react";

type Msg = { role: "user" | "assistant"; text: string; sources?: string[] };

export function ChatPanel({
  initialMessages,
  suggestions,
  retrievalLabel = "Retrieved context",
}: {
  initialMessages: Msg[];
  suggestions: string[];
  retrievalLabel?: string;
}) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [draft, setDraft] = useState("");

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { role: "user", text },
      {
        role: "assistant",
        text:
          "(Demo) The advisor would now consult Qdrant and Mistral, then respond grounded in retrieved context.",
        sources: ["job_chunks#812 — Frontend Engineer @ BlueLeaf", "cv_chunks#41 — your CV v3"],
      },
    ]);
    setDraft("");
  }

  return (
    <div className="card flex flex-col h-[70vh] min-h-[520px] overflow-hidden">
      <div className="px-5 py-3 border-b border-navy-100 flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-[0.18em] text-navy-700">Live Session</div>
        <div className="flex items-center gap-2">
          <span className="badge-green">Mistral · local</span>
          <span className="badge-muted">{retrievalLabel}</span>
        </div>
      </div>

      <ol className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((m, i) => (
          <li key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                "max-w-[80%] rounded-md px-4 py-3 text-sm shadow-sm " +
                (m.role === "user"
                  ? "bg-navy-800 text-white"
                  : "bg-parchment border border-navy-100 text-ink")
              }
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
              {m.sources && (
                <div className="mt-2 pt-2 border-t border-navy-100/60 text-[11px] text-navy-700">
                  <div className="uppercase tracking-wider">Retrieved</div>
                  <ul className="mt-1 space-y-0.5">
                    {m.sources.map((s, j) => <li key={j} className="font-mono">· {s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      {suggestions.length > 0 && (
        <div className="px-5 py-2 border-t border-navy-100 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-xs rounded-full border border-navy-200 bg-white px-3 py-1 hover:bg-parchment"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        className="border-t border-navy-100 p-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="input"
          placeholder="Type your question…"
        />
        <button className="btn-primary">Send</button>
      </form>
    </div>
  );
}
