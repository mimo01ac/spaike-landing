export default function ThreeLevels() {
  return (
    <svg
      viewBox="0 0 700 260"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Tre niveauer i at bruge AI: chat, derefter agenter, derefter nye arbejdsgange"
      className="w-full h-auto block"
    >
      <defs>
        <marker
          id="arrow-tl"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="5"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="#0f1a2e" />
        </marker>
      </defs>

      {/* Niveau 1 — Chat */}
      <g>
        <rect x="18" y="64" width="192" height="104" fill="#f3eee2" stroke="#0f1a2e" strokeWidth="1.5" rx="3" />
        <text x="34" y="92" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#b88f3f" fontWeight="500" letterSpacing="0.08em">01 · CHAT</text>
        <text x="34" y="118" fontFamily="Source Serif 4, serif" fontSize="17" fill="#0f1a2e" fontWeight="600">Du spørger, den svarer</text>
        <text x="34" y="140" fontFamily="Inter, sans-serif" fontSize="11.5" fill="#6b6650">Et udkast, et resumé,</text>
        <text x="34" y="156" fontFamily="Inter, sans-serif" fontSize="11.5" fill="#6b6650">en omskrevet mail.</text>
        <text x="34" y="196" fontFamily="Inter, sans-serif" fontSize="10.5" fill="#6b6650" fontStyle="italic">Her stopper de fleste</text>
      </g>

      <line x1="214" y1="116" x2="246" y2="116" stroke="#0f1a2e" strokeWidth="1.3" markerEnd="url(#arrow-tl)" />

      {/* Niveau 2 — Agenter */}
      <g>
        <rect x="254" y="48" width="192" height="136" fill="#0f1a2e" stroke="#0f1a2e" strokeWidth="1.5" rx="3" />
        <text x="270" y="78" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#d4a857" fontWeight="500" letterSpacing="0.08em">02 · AGENTER</text>
        <text x="270" y="104" fontFamily="Source Serif 4, serif" fontSize="17" fill="#f3eee2" fontWeight="600">Et fast job, gjort</text>
        <text x="270" y="122" fontFamily="Source Serif 4, serif" fontSize="17" fill="#f3eee2" fontWeight="600">igen og igen</text>
        <text x="270" y="146" fontFamily="Inter, sans-serif" fontSize="11.5" fill="#cbc6b6">En gemt instruktion med</text>
        <text x="270" y="162" fontFamily="Inter, sans-serif" fontSize="11.5" fill="#cbc6b6">adgang til jeres værktøjer.</text>
        <text x="270" y="206" fontFamily="Inter, sans-serif" fontSize="10.5" fill="#b88f3f" fontWeight="500">Dagens hovedfokus</text>
      </g>

      <line x1="450" y1="116" x2="482" y2="116" stroke="#0f1a2e" strokeWidth="1.3" markerEnd="url(#arrow-tl)" />

      {/* Niveau 3 — Arbejdsgange */}
      <g>
        <rect x="490" y="64" width="192" height="104" fill="#f3eee2" stroke="#0f1a2e" strokeWidth="1.5" rx="3" />
        <text x="506" y="92" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#b88f3f" fontWeight="500" letterSpacing="0.08em">03 · ARBEJDSGANGE</text>
        <text x="506" y="118" fontFamily="Source Serif 4, serif" fontSize="17" fill="#0f1a2e" fontWeight="600">Arbejdet ændrer sig</text>
        <text x="506" y="140" fontFamily="Inter, sans-serif" fontSize="11.5" fill="#6b6650">En del af jobbet kører</text>
        <text x="506" y="156" fontFamily="Inter, sans-serif" fontSize="11.5" fill="#6b6650">nu af sig selv.</text>
        <text x="506" y="196" fontFamily="Inter, sans-serif" fontSize="10.5" fill="#6b6650" fontStyle="italic">Retningen</text>
      </g>
    </svg>
  );
}
