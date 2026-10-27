export default function ThreeLevels() {
  return (
    <svg
      viewBox="0 0 700 260"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Three levels of using AI: chat, then agents, then new workflows"
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

      {/* Level 1 — Chat */}
      <g>
        <rect x="18" y="64" width="192" height="104" fill="#f3eee2" stroke="#0f1a2e" strokeWidth="1.5" rx="3" />
        <text x="34" y="92" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#b88f3f" fontWeight="500" letterSpacing="0.08em">01 · CHAT</text>
        <text x="34" y="118" fontFamily="Source Serif 4, serif" fontSize="17" fill="#0f1a2e" fontWeight="600">You ask, it answers</text>
        <text x="34" y="140" fontFamily="Inter, sans-serif" fontSize="11.5" fill="#6b6650">A draft, a summary,</text>
        <text x="34" y="156" fontFamily="Inter, sans-serif" fontSize="11.5" fill="#6b6650">a rewritten mail.</text>
        <text x="34" y="196" fontFamily="Inter, sans-serif" fontSize="10.5" fill="#6b6650" fontStyle="italic">Where most teams stop</text>
      </g>

      <line x1="214" y1="116" x2="246" y2="116" stroke="#0f1a2e" strokeWidth="1.3" markerEnd="url(#arrow-tl)" />

      {/* Level 2 — Agents */}
      <g>
        <rect x="254" y="48" width="192" height="136" fill="#0f1a2e" stroke="#0f1a2e" strokeWidth="1.5" rx="3" />
        <text x="270" y="78" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#d4a857" fontWeight="500" letterSpacing="0.08em">02 · AGENTS</text>
        <text x="270" y="104" fontFamily="Source Serif 4, serif" fontSize="17" fill="#f3eee2" fontWeight="600">A fixed job, done</text>
        <text x="270" y="122" fontFamily="Source Serif 4, serif" fontSize="17" fill="#f3eee2" fontWeight="600">again and again</text>
        <text x="270" y="146" fontFamily="Inter, sans-serif" fontSize="11.5" fill="#cbc6b6">A saved instruction with</text>
        <text x="270" y="162" fontFamily="Inter, sans-serif" fontSize="11.5" fill="#cbc6b6">access to your tools.</text>
        <text x="270" y="206" fontFamily="Inter, sans-serif" fontSize="10.5" fill="#b88f3f" fontWeight="500">The focus of the session</text>
      </g>

      <line x1="450" y1="116" x2="482" y2="116" stroke="#0f1a2e" strokeWidth="1.3" markerEnd="url(#arrow-tl)" />

      {/* Level 3 — New workflows */}
      <g>
        <rect x="490" y="64" width="192" height="104" fill="#f3eee2" stroke="#0f1a2e" strokeWidth="1.5" rx="3" />
        <text x="506" y="92" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#b88f3f" fontWeight="500" letterSpacing="0.08em">03 · WORKFLOWS</text>
        <text x="506" y="118" fontFamily="Source Serif 4, serif" fontSize="17" fill="#0f1a2e" fontWeight="600">The work changes</text>
        <text x="506" y="140" fontFamily="Inter, sans-serif" fontSize="11.5" fill="#6b6650">Part of the job now</text>
        <text x="506" y="156" fontFamily="Inter, sans-serif" fontSize="11.5" fill="#6b6650">runs on its own.</text>
        <text x="506" y="196" fontFamily="Inter, sans-serif" fontSize="10.5" fill="#6b6650" fontStyle="italic">The direction</text>
      </g>
    </svg>
  );
}
