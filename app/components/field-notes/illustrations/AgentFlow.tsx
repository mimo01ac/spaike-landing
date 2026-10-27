export default function AgentFlow() {
  return (
    <svg
      viewBox="0 0 700 300"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="How an agent works: input feeds a saved instruction, which produces a draft, which a person reviews and sends"
      className="w-full h-auto block"
    >
      <defs>
        <marker
          id="arrow-af"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="5"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="#0f1a2e" />
        </marker>
      </defs>

      {/* Inputs */}
      <g fontFamily="Inter, sans-serif" fontSize="12" fill="#0f1a2e">
        <rect x="18" y="30" width="150" height="44" fill="#f3eee2" stroke="#0f1a2e" strokeWidth="1.5" rx="3" />
        <text x="93" y="50" textAnchor="middle" fontWeight="500">Mail &amp; calendar</text>
        <text x="93" y="66" textAnchor="middle" fontSize="10" fill="#6b6650">what was asked, promised</text>

        <rect x="18" y="104" width="150" height="44" fill="#f3eee2" stroke="#0f1a2e" strokeWidth="1.5" rx="3" />
        <text x="93" y="124" textAnchor="middle" fontWeight="500">Files &amp; notes</text>
        <text x="93" y="140" textAnchor="middle" fontSize="10" fill="#6b6650">the house&apos;s own material</text>

        <rect x="18" y="178" width="150" height="44" fill="#f3eee2" stroke="#0f1a2e" strokeWidth="1.5" rx="3" />
        <text x="93" y="198" textAnchor="middle" fontWeight="500">The instruction</text>
        <text x="93" y="214" textAnchor="middle" fontSize="10" fill="#6b6650">what good looks like</text>
      </g>

      <line x1="168" y1="52" x2="252" y2="120" stroke="#0f1a2e" strokeWidth="1.2" markerEnd="url(#arrow-af)" />
      <line x1="168" y1="126" x2="252" y2="126" stroke="#0f1a2e" strokeWidth="1.2" markerEnd="url(#arrow-af)" />
      <line x1="168" y1="200" x2="252" y2="132" stroke="#0f1a2e" strokeWidth="1.2" markerEnd="url(#arrow-af)" />

      {/* Agent */}
      <g>
        <rect x="260" y="98" width="130" height="56" fill="#0f1a2e" rx="3" />
        <text x="325" y="123" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#d4a857" fontWeight="500" letterSpacing="0.08em">AGENT</text>
        <text x="325" y="141" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10.5" fill="#f3eee2">a fixed job</text>
      </g>

      <line x1="390" y1="126" x2="446" y2="126" stroke="#0f1a2e" strokeWidth="1.2" markerEnd="url(#arrow-af)" />

      {/* Draft */}
      <g fontFamily="Inter, sans-serif" fill="#0f1a2e">
        <rect x="454" y="98" width="110" height="56" fill="#f3eee2" stroke="#0f1a2e" strokeWidth="1.5" rx="3" />
        <text x="509" y="123" textAnchor="middle" fontFamily="Source Serif 4, serif" fontSize="15" fontWeight="600">Draft</text>
        <text x="509" y="141" textAnchor="middle" fontSize="10" fill="#6b6650">not sent yet</text>
      </g>

      <line x1="564" y1="126" x2="600" y2="126" stroke="#0f1a2e" strokeWidth="1.2" markerEnd="url(#arrow-af)" />

      {/* You */}
      <g>
        <rect x="594" y="92" width="88" height="68" fill="#f3eee2" stroke="#d4a857" strokeWidth="2.5" rx="3" />
        <text x="638" y="118" textAnchor="middle" fontFamily="Source Serif 4, serif" fontSize="15" fill="#0f1a2e" fontWeight="600">You</text>
        <text x="638" y="136" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9.5" fill="#6b6650">review, decide,</text>
        <text x="638" y="149" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9.5" fill="#6b6650">hit send</text>
      </g>

      {/* Nothing sent automatically band */}
      <g>
        <line x1="260" y1="250" x2="682" y2="250" stroke="#d8d3c7" strokeWidth="1" strokeDasharray="4 4" />
        <text x="260" y="276" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#b88f3f" fontWeight="500" letterSpacing="0.04em">The agent drafts. It does not send on its own.</text>
      </g>
    </svg>
  );
}
