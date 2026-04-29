// Two-tone navy/gold mini-scenes for role cards.
// `currentColor` = navy outline; gold accents are explicit.

const GOLD = "#d4a017";

export function SeekerIcon({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" aria-hidden>
      <rect x="14" y="10" width="36" height="48" rx="2" fill="#fff" stroke="currentColor" strokeWidth="2" />
      <line x1="20" y1="22" x2="44" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="30" x2="40" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="38" x2="36" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="50" cy="50" r="10" fill="#fff" stroke={GOLD} strokeWidth="3" />
      <line x1="58" y1="58" x2="64" y2="64" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function EmployerIcon({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" aria-hidden>
      <rect x="10" y="22" width="52" height="34" rx="2" fill="#fff" stroke="currentColor" strokeWidth="2" />
      <path d="M26 22 V16 a2 2 0 0 1 2 -2 h16 a2 2 0 0 1 2 2 V22" stroke="currentColor" strokeWidth="2" fill="#fff" />
      <line x1="10" y1="34" x2="62" y2="34" stroke="currentColor" strokeWidth="2" />
      <rect x="32" y="32" width="8" height="6" fill={GOLD} />
      <path d="M30 46 l4 4 8 -8" stroke={GOLD} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function AdminIcon({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none" aria-hidden>
      <path
        d="M36 8 L58 16 V34 c0 14 -10 24 -22 30 C24 58 14 48 14 34 V16 Z"
        fill="#fff"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="36" cy="32" r="6" fill={GOLD} />
      <path
        d="M36 38 c-6 0 -10 4 -10 8 v2 h20 v-2 c0 -4 -4 -8 -10 -8 Z"
        fill={GOLD}
      />
    </svg>
  );
}
