export function Stat({
  label,
  value,
  hint,
  tone = "navy",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "navy" | "gold" | "seal";
}) {
  const toneCls =
    tone === "gold" ? "border-l-gold-500" : tone === "seal" ? "border-l-seal" : "border-l-navy-700";
  return (
    <div className={`card p-5 border-l-4 ${toneCls}`}>
      <div className="text-[11px] uppercase tracking-[0.18em] text-navy-700">{label}</div>
      <div className="mt-1 font-serif text-3xl text-navy-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-ink-soft">{hint}</div>}
    </div>
  );
}
