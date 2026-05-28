export default function AccountScoring() {
  const dotRows = Array.from({ length: 14 }, (_, r) => 40 + r * 15);
  const dotCols = Array.from({ length: 16 }, (_, c) => 30 + c * 10);

  return (
    <svg
      viewBox="0 0 700 280"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Account scoring funnel"
      className="w-full h-auto block"
    >
      <defs>
        <marker
          id="arrow-as"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="5"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="#0f1a2e" />
        </marker>
      </defs>

      <g fill="#0f1a2e" opacity="0.4">
        {dotRows.map((y) =>
          dotCols.map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" />)
        )}
      </g>

      <text x="30" y="262" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#6b6650" letterSpacing="0.08em">4,000 ACCOUNTS</text>

      <line x1="200" y1="140" x2="260" y2="140" stroke="#0f1a2e" strokeWidth="1.2" markerEnd="url(#arrow-as)" />

      <g fontFamily="Inter, sans-serif" fontSize="11" fill="#0f1a2e">
        <rect x="270" y="40" width="170" height="200" fill="#0f1a2e" rx="3" />
        <text x="355" y="64" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#d4a857" letterSpacing="0.12em">OVERNIGHT SCORE</text>
        <line x1="290" y1="76" x2="420" y2="76" stroke="#6b6650" />

        <text x="290" y="96" fontSize="11" fill="#f3eee2">Agent opportunity</text>
        <text x="290" y="118" fontSize="11" fill="#f3eee2">Internal transformation</text>
        <text x="290" y="140" fontSize="11" fill="#f3eee2">AI commitment</text>
        <text x="290" y="162" fontSize="11" fill="#f3eee2">White space</text>
        <text x="290" y="184" fontSize="11" fill="#f3eee2">Industry fit</text>

        <line x1="290" y1="198" x2="420" y2="198" stroke="#6b6650" />
        <text x="355" y="218" textAnchor="middle" fontFamily="Source Serif 4, serif" fontStyle="italic" fontSize="12" fill="#d4a857">weighted · 0–50</text>
      </g>

      <line x1="440" y1="140" x2="500" y2="140" stroke="#0f1a2e" strokeWidth="1.2" markerEnd="url(#arrow-as)" />

      <g fontFamily="Inter, sans-serif" fontSize="11" fill="#0f1a2e">
        <rect x="510" y="60" width="170" height="160" fill="#f3eee2" stroke="#0f1a2e" strokeWidth="1.5" rx="3" />
        <text x="595" y="84" textAnchor="middle" fontFamily="Source Serif 4, serif" fontStyle="italic" fontSize="13">Top focus accounts</text>
        <line x1="530" y1="96" x2="660" y2="96" stroke="#d8d3c7" />

        <circle cx="530" cy="116" r="4" fill="#d4a857" />
        <text x="544" y="120" fontSize="11">Acme Bank · 47</text>

        <circle cx="530" cy="138" r="4" fill="#d4a857" />
        <text x="544" y="142" fontSize="11">Sentinel Care · 44</text>

        <circle cx="530" cy="160" r="4" fill="#d4a857" />
        <text x="544" y="164" fontSize="11">Vantage Legal · 41</text>

        <circle cx="530" cy="182" r="4" fill="#d4a857" />
        <text x="544" y="186" fontSize="11">Northstar HR · 39</text>

        <text x="530" y="208" fontSize="10" fill="#6b6650" fontFamily="JetBrains Mono, monospace" letterSpacing="0.08em">→ 20 ACCOUNTS PER REP</text>
      </g>
    </svg>
  );
}
