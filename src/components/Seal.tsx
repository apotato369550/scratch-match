export function Seal({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#0e1f3f" stroke="#d4a017" strokeWidth="2" />
      <circle cx="32" cy="32" r="24" fill="none" stroke="#d4a017" strokeWidth="0.6" strokeDasharray="2 2" />
      <text x="32" y="28" textAnchor="middle" fontFamily="Times New Roman, serif" fontWeight="700" fontSize="11" fill="#d4a017">SM</text>
      <text x="32" y="40" textAnchor="middle" fontFamily="Times New Roman, serif" fontSize="6" fill="#f7f5ee" letterSpacing="1">CEBU · 2026</text>
      <path d="M32 47 l3 3 -3 -1.2 -3 1.2 z" fill="#d4a017" />
    </svg>
  );
}
