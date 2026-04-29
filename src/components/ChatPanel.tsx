"use client";

import { useEffect, useRef, useState } from "react";

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
  const [sending, setSending] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [draft]);

  // Auto-scroll to latest
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  const isEmpty = messages.length === 0;

  function send(text: string) {
    const t = text.trim();
    if (!t || sending) return;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setDraft("");
    setSending(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text:
            "(Demo) The advisor would now consult Qdrant and Mistral, then respond grounded in retrieved context.",
          sources: [
            "job_chunks#812 — Frontend Engineer @ BlueLeaf",
            "cv_chunks#41 — your CV v3",
          ],
        },
      ]);
      setSending(false);
    }, 600);
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(draft);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] min-h-[560px]">
      <div className="flex items-center justify-end gap-2 mb-2">
        <span className="badge-green">Mistral · local</span>
        <span className="badge-muted">{retrievalLabel}</span>
      </div>

      <div ref={scrollerRef} className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <EmptyState onPick={(s) => send(s)} suggestions={suggestions} />
        ) : (
          <div className="mx-auto max-w-3xl px-2 py-4">
            {messages.map((m, i) => (
              <MessageRow key={i} msg={m} />
            ))}
            {sending && <TypingRow />}
          </div>
        )}
      </div>

      <div className="border-t border-navy-100 bg-white">
        <div className="mx-auto max-w-3xl px-2 py-4">
          <form
            className="relative"
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <textarea
              ref={taRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKey}
              rows={1}
              placeholder="Send a message…  (Enter to send · Shift+Enter for newline)"
              className="w-full resize-none rounded-2xl border border-navy-200 bg-white pl-5 pr-14 py-4 text-base leading-relaxed
                         focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500 shadow-official"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!draft.trim() || sending}
              aria-label="Send"
              className="absolute right-2 bottom-2 inline-flex h-10 w-10 items-center justify-center rounded-xl
                         bg-navy-800 text-white hover:bg-navy-900 disabled:bg-navy-200 disabled:text-navy-400 transition"
            >
              <SendIcon />
            </button>
          </form>
          <div className="mt-2 text-center text-xs text-navy-700/70">
            Answers are grounded in your documents and the live listing pool.
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  suggestions,
  onPick,
}: {
  suggestions: string[];
  onPick: (s: string) => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-2 py-16">
      <h2 className="font-serif text-4xl md:text-5xl text-navy-900 text-center tracking-tight">
        How can I help?
      </h2>
      <p className="mt-3 text-center text-lg text-ink-soft">
        Ask about your CV, the Cebu market, or how to apply.
      </p>
      {suggestions.length > 0 && (
        <div className="mt-10 grid sm:grid-cols-2 gap-3">
          {suggestions.slice(0, 4).map((s) => (
            <button
              key={s}
              onClick={() => onPick(s)}
              className="text-left rounded-xl border border-navy-100 bg-white px-5 py-4 text-base text-navy-800
                         hover:border-navy-300 hover:bg-parchment transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MessageRow({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div className="py-5 border-b border-navy-100/60 last:border-0">
      <div className="flex gap-4">
        <div
          className={
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold " +
            (isUser ? "bg-navy-800 text-white" : "bg-gold-500 text-navy-900")
          }
          aria-hidden
        >
          {isUser ? "You" : "SM"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-navy-700">
            {isUser ? "You" : "Advisor"}
          </div>
          <div className="mt-1 whitespace-pre-wrap text-base leading-relaxed text-ink">
            {msg.text}
          </div>
          {msg.sources && msg.sources.length > 0 && (
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer text-navy-700 hover:text-navy-900 select-none">
                Sources ({msg.sources.length})
              </summary>
              <ul className="mt-2 space-y-1 font-mono text-xs text-navy-700">
                {msg.sources.map((s, j) => (
                  <li key={j}>· {s}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingRow() {
  return (
    <div className="py-5 border-b border-navy-100/60">
      <div className="flex gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500 text-navy-900 text-xs font-semibold">
          SM
        </div>
        <div className="flex items-center gap-1.5 pt-3">
          <Dot />
          <Dot delay="150ms" />
          <Dot delay="300ms" />
        </div>
      </div>
    </div>
  );
}

function Dot({ delay = "0ms" }: { delay?: string }) {
  return (
    <span
      className="inline-block h-2 w-2 rounded-full bg-navy-400 animate-pulse"
      style={{ animationDelay: delay }}
    />
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12 L20 4 L13 20 L11 13 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
