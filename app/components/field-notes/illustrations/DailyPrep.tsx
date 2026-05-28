export default function DailyPrep() {
  return (
    <svg
      viewBox="0 0 700 320"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Three data sources feeding a morning briefing"
      className="w-full h-auto block"
    >
      <defs>
        <marker
          id="arrow-dp"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="5"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="#0f1a2e" />
        </marker>
      </defs>
      <g fontFamily="Inter, sans-serif" fontSize="13" fill="#0f1a2e">
        <rect x="20" y="30" width="160" height="48" fill="#f3eee2" stroke="#0f1a2e" strokeWidth="1.5" rx="3" />
        <text x="100" y="52" textAnchor="middle" fontWeight="500">CRM</text>
        <text x="100" y="68" textAnchor="middle" fontSize="10" fill="#6b6650">accounts &amp; opps</text>

        <rect x="20" y="110" width="160" height="48" fill="#f3eee2" stroke="#0f1a2e" strokeWidth="1.5" rx="3" />
        <text x="100" y="132" textAnchor="middle" fontWeight="500">Calendar &amp; inbox</text>
        <text x="100" y="148" textAnchor="middle" fontSize="10" fill="#6b6650">today&apos;s meetings · last 24h</text>

        <rect x="20" y="190" width="160" height="48" fill="#f3eee2" stroke="#0f1a2e" strokeWidth="1.5" rx="3" />
        <text x="100" y="212" textAnchor="middle" fontWeight="500">Usage signal</text>
        <text x="100" y="228" textAnchor="middle" fontSize="10" fill="#6b6650">product or activity</text>
      </g>

      <line x1="180" y1="54" x2="270" y2="155" stroke="#0f1a2e" strokeWidth="1.2" markerEnd="url(#arrow-dp)" />
      <line x1="180" y1="134" x2="270" y2="160" stroke="#0f1a2e" strokeWidth="1.2" markerEnd="url(#arrow-dp)" />
      <line x1="180" y1="214" x2="270" y2="170" stroke="#0f1a2e" strokeWidth="1.2" markerEnd="url(#arrow-dp)" />

      <g fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#0f1a2e">
        <rect x="280" y="138" width="120" height="50" fill="#0f1a2e" rx="3" />
        <text x="340" y="160" textAnchor="middle" fill="#d4a857" fontWeight="500" letterSpacing="0.08em">SCHEDULED</text>
        <text x="340" y="176" textAnchor="middle" fill="#f3eee2">06:00 every day</text>
      </g>

      <line x1="400" y1="163" x2="490" y2="163" stroke="#0f1a2e" strokeWidth="1.2" markerEnd="url(#arrow-dp)" />

      <g>
        <rect x="500" y="56" width="180" height="216" fill="#f3eee2" stroke="#0f1a2e" strokeWidth="1.5" rx="3" />
        <text x="590" y="80" fontFamily="Source Serif 4, serif" fontStyle="italic" fontSize="13" textAnchor="middle" fill="#0f1a2e">Daily briefing</text>
        <line x1="520" y1="92" x2="660" y2="92" stroke="#d8d3c7" />

        <circle cx="525" cy="115" r="5" fill="#c0413c" />
        <text x="540" y="119" fontFamily="Inter, sans-serif" fontSize="11" fill="#0f1a2e">Beacon · renewal Fri</text>

        <circle cx="525" cy="142" r="5" fill="#d4a857" />
        <text x="540" y="146" fontFamily="Inter, sans-serif" fontSize="11" fill="#0f1a2e">Stratify · silent 21d</text>

        <circle cx="525" cy="169" r="5" fill="#6b8e4e" />
        <text x="540" y="173" fontFamily="Inter, sans-serif" fontSize="11" fill="#0f1a2e">Voyager · expand closed</text>

        <line x1="520" y1="190" x2="660" y2="190" stroke="#d8d3c7" />

        <text x="525" y="210" fontFamily="Inter, sans-serif" fontSize="10" fill="#6b6650" fontWeight="500">PREP FOR TODAY</text>
        <text x="525" y="226" fontFamily="Inter, sans-serif" fontSize="11" fill="#0f1a2e">09:30 Acme — legal redlines</text>
        <text x="525" y="244" fontFamily="Inter, sans-serif" fontSize="11" fill="#0f1a2e">11:00 Northbeam — close push</text>
        <text x="525" y="262" fontFamily="Inter, sans-serif" fontSize="11" fill="#0f1a2e">14:00 internal forecast</text>
      </g>
    </svg>
  );
}
