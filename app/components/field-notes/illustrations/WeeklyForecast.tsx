export default function WeeklyForecast() {
  return (
    <svg
      viewBox="0 0 700 280"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Forecast aggregation flow"
      className="w-full h-auto block"
    >
      <defs>
        <marker
          id="arrow-wf"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="5"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="#0f1a2e" />
        </marker>
      </defs>

      <g fontFamily="Inter, sans-serif" fontSize="11" fill="#0f1a2e">
        <text x="60" y="30" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#6b6650" letterSpacing="0.1em">REPS · THU 5PM</text>
        <g>
          <rect x="20" y="40" width="100" height="34" fill="#f3eee2" stroke="#d8d3c7" rx="2" />
          <text x="32" y="56" fontSize="11">AE 1 · commit $</text>
          <text x="32" y="68" fontSize="10" fill="#6b6650">+ best case</text>
        </g>
        <g>
          <rect x="20" y="82" width="100" height="34" fill="#f3eee2" stroke="#d8d3c7" rx="2" />
          <text x="32" y="98" fontSize="11">AE 2 · commit $</text>
          <text x="32" y="110" fontSize="10" fill="#6b6650">+ best case</text>
        </g>
        <g>
          <rect x="20" y="124" width="100" height="34" fill="#f3eee2" stroke="#d8d3c7" rx="2" />
          <text x="32" y="140" fontSize="11">AE 3 · commit $</text>
          <text x="32" y="152" fontSize="10" fill="#6b6650">+ best case</text>
        </g>
        <text x="60" y="180" fontSize="14" fontStyle="italic" fill="#6b6650">…</text>

        <rect x="20" y="200" width="100" height="34" fill="#f3eee2" stroke="#d8d3c7" rx="2" />
        <text x="32" y="216" fontSize="11">CRM data</text>
        <text x="32" y="228" fontSize="10" fill="#6b6650">opps · stages</text>
      </g>

      <line x1="120" y1="56" x2="250" y2="135" stroke="#0f1a2e" strokeWidth="1" markerEnd="url(#arrow-wf)" />
      <line x1="120" y1="98" x2="250" y2="137" stroke="#0f1a2e" strokeWidth="1" markerEnd="url(#arrow-wf)" />
      <line x1="120" y1="140" x2="250" y2="139" stroke="#0f1a2e" strokeWidth="1" markerEnd="url(#arrow-wf)" />
      <line x1="120" y1="216" x2="250" y2="143" stroke="#0f1a2e" strokeWidth="1" markerEnd="url(#arrow-wf)" />

      <g>
        <text x="180" y="20" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#c0413c" letterSpacing="0.1em" textDecoration="line-through">TRANSFER TAX · 2-3 HRS MANUAL</text>
      </g>

      <g>
        <rect x="260" y="120" width="140" height="50" fill="#0f1a2e" rx="3" />
        <text x="330" y="142" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#d4a857" fontWeight="500" letterSpacing="0.08em">AGGREGATE</text>
        <text x="330" y="158" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fill="#f3eee2">in leader&apos;s format</text>
      </g>

      <line x1="400" y1="145" x2="460" y2="145" stroke="#0f1a2e" strokeWidth="1.2" markerEnd="url(#arrow-wf)" />

      <g fontFamily="Inter, sans-serif" fill="#0f1a2e">
        <rect x="470" y="40" width="210" height="210" fill="#f3eee2" stroke="#0f1a2e" strokeWidth="1.5" rx="3" />
        <text x="575" y="64" textAnchor="middle" fontFamily="Source Serif 4, serif" fontStyle="italic" fontSize="14">Weekly forecast</text>
        <text x="575" y="80" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#6b6650" letterSpacing="0.1em">FRIDAY · 08:00</text>
        <line x1="490" y1="92" x2="660" y2="92" stroke="#d8d3c7" />

        <text x="490" y="112" fontSize="11" fontWeight="500">Commit</text>
        <text x="660" y="112" textAnchor="end" fontSize="11" fontFamily="JetBrains Mono, monospace">$2.4M</text>

        <text x="490" y="132" fontSize="11" fontWeight="500">Most likely</text>
        <text x="660" y="132" textAnchor="end" fontSize="11" fontFamily="JetBrains Mono, monospace">$3.1M</text>

        <text x="490" y="152" fontSize="11" fontWeight="500">Best case</text>
        <text x="660" y="152" textAnchor="end" fontSize="11" fontFamily="JetBrains Mono, monospace">$3.8M</text>

        <line x1="490" y1="168" x2="660" y2="168" stroke="#d8d3c7" />

        <text x="490" y="186" fontSize="10" fontWeight="500" fill="#6b6650" letterSpacing="0.06em">RISKS &amp; MOVERS</text>
        <text x="490" y="202" fontSize="10" fill="#0f1a2e">· Helix slipping (CTO PTO)</text>
        <text x="490" y="218" fontSize="10" fill="#0f1a2e">· Stratify silent 21d</text>
        <text x="490" y="234" fontSize="10" fill="#0f1a2e">· Northbeam pulled up</text>
      </g>
    </svg>
  );
}
