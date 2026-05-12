import { SectionLabel, DoubleRule } from "./EditorialUI";

const cases = [
  {
    num: "01",
    title: "Kundeservice der ikke kræver flere ansættelser",
    company: "Hos JUC Service ApS",
    sector: "Juridisk uddannelse",
    before: "Syv parallelle kundeservice-indbakker hvor admin og kategorisering tog halvdelen af medarbejdernes dag. Når én var syg, byggede arbejdet sig op.",
    after: "AI håndterer kategorisering, prioritering og udkast på alle syv. Teamet fokuserer på de samtaler der reelt kræver et menneske.",
    metric: "7",
    metricLabel: "parallelle indbakker automatiseret",
  },
  {
    num: "02",
    title: "Fra papirbestillinger til scan-og-bekræft",
    company: "Hos Audiovox Hørecenter",
    sector: "Audio & hørerprodukter",
    before: "Papirbaserede bestillinger med manuel dataoverførsel mellem formularer, CRM og produktion. Fejl-spredning, ingen sporbarhed fra bestilling til levering.",
    after: "QR-baseret web-app der samler hele flowet. Kunden scanner, data flyder automatisk gennem hele kæden — fra ordre til produktion til leverance.",
    metric: "8 → 2",
    metricLabel: "manuelle trin pr. ordre",
  },
  {
    num: "03",
    title: "Når de samme spørgsmål rammer support igen og igen",
    company: "Hos JUC Service ApS",
    sector: "Juridisk uddannelse",
    before: "Kunder kontaktede support på simple spørgsmål om kursusdatoer, tilmeldinger og certificeringer — selv om svarene fandtes på website. Support-tid gik til at gentage de samme svar.",
    after: "AI-chatbot på website besvarer typiske kunde-spørgsmål direkte fra eget content. Kunder får svar instant. Support-teamet får tid til de samtaler der reelt kræver et menneske.",
    metric: "24/7",
    metricLabel: "selvbetjening uden ventetid",
  },
];

export default function Cases() {
  return (
    <section id="cases">
      <DoubleRule />
      <div className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-16 pb-9">
        <SectionLabel>Cases</SectionLabel>
        <h2 className="font-serif text-4xl md:text-6xl font-normal leading-none tracking-tight max-w-4xl">
          Tre virksomheder der gik{" "}
          <em className="italic font-normal">fra manuelt til målbart.</em>
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

            <div>
              <h3 className="font-serif text-2xl md:text-[28px] font-medium leading-[1.15]">
                {c.title}
              </h3>
              <p className="font-sans text-[13px] text-ink-soft mt-2">
                {c.company}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-mono text-[10px] tracking-wider uppercase text-muted mb-1.5">Før</p>
                <p className="font-serif text-base leading-relaxed text-ink-soft">{c.before}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-wider uppercase text-amber-dark mb-1.5">Efter</p>
                <p className="font-serif text-base leading-relaxed text-ink">{c.after}</p>
              </div>
            </div>

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
    </section>
  );
}
