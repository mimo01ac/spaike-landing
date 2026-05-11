import { SectionLabel, Pager, DoubleRule } from "./EditorialUI";

const cases = [
  {
    num: "01",
    name: "JUC Service ApS",
    sector: "Juridisk uddannelse",
    lede: "Email Agent på 7 parallelle kundeservice-indbakker. Salgsportal i Microsoft Teams. AI-drevet søgning i 10+ års juridisk indhold.",
    metric: "7",
    metricLabel: "parallelle indbakker",
  },
  {
    num: "02",
    name: "Audiovox",
    sector: "Audio & elektronik",
    lede: "Digitaliseret reklamationsflow og hele ordreprocessen — fra produktionsgulvet til færdigvare. Eliminerer manuelle hand-offs.",
    metric: "End-to-end",
    metricLabel: "ordrekæde digitaliseret",
  },
  {
    num: "03",
    name: "WePlan",
    sector: "Rådgivende ingeniør",
    lede: "Sagsoprettelses-modul der parser indgående henvendelser og opretter sager automatisk i deres system.",
    metric: "0",
    metricLabel: "manuelle hand-offs",
  },
];

export default function Cases() {
  return (
    <section id="cases">
      <DoubleRule />
      <div className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-16 pb-9">
        <SectionLabel>Sektion III · Cases</SectionLabel>
        <h2 className="font-serif text-4xl md:text-6xl font-normal leading-none tracking-tight max-w-4xl">
          Tre aktive engagementer{" "}
          <em className="italic font-normal">på tværs af brancher.</em>
        </h2>
      </div>

      <div className="max-w-editorial mx-auto w-full grid grid-cols-1 md:grid-cols-3 border-t border-rule">
        {cases.map((c, i) => (
          <article
            key={c.num}
            className={`px-7 md:px-9 py-9 flex flex-col gap-4 ${
              i > 0 ? "border-t md:border-t-0 md:border-l border-rule" : ""
            }`}
          >
            <div className="flex justify-between items-baseline">
              <span className="font-mono text-[11px] tracking-wider text-amber-dark">
                {c.num}
              </span>
              <span className="font-mono text-[10px] tracking-wider uppercase text-muted">
                {c.sector}
              </span>
            </div>

            <h3 className="font-serif text-3xl md:text-[32px] font-medium leading-[1.1]">
              {c.name}
            </h3>

            <p className="font-serif text-base leading-relaxed text-ink-soft">
              {c.lede}
            </p>

            <div className="mt-auto pt-5 border-t border-rule">
              <div className="font-serif text-4xl md:text-5xl font-medium leading-none tracking-tight">
                {c.metric}
              </div>
              <div className="font-sans text-xs text-muted mt-1.5">
                {c.metricLabel}
              </div>
            </div>
          </article>
        ))}
      </div>

      <Pager n="03" of="06" next="Discovery" />
    </section>
  );
}
