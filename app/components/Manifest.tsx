import { SectionLabel, DoubleRule } from "./EditorialUI";

const points = [
  {
    n: "01",
    title: "AI er ikke magi — det er infrastruktur.",
    body: "ROI først, hype senere. Vi bygger det der virker, ikke det der lyder smart.",
  },
  {
    n: "02",
    title: "Start med data, ikke meninger.",
    body: "Ingen seks-ugers discovery før vi kan levere værdi. Assessment kører på 48 timer.",
  },
  {
    n: "03",
    title: "Commercial-first, ikke tech-first.",
    body: "Løsningen tjener forretningen, ikke omvendt. 15 år på den kommercielle side bag os.",
  },
  {
    n: "04",
    title: "Vi bygger med jer, ikke til jer.",
    body: "I skal kunne drive det selv bagefter. Ingen leverandør-lock-in.",
  },
  {
    n: "05",
    title: "Ærlighed om hvad AI kan og ikke kan.",
    body: '"Det duer ikke her" lige så ofte som "det her kan vi løse".',
  },
];

export default function Manifest() {
  return (
    <section id="manifest" className="bg-ink text-cream">
      <DoubleRule />
      <div className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-16 pb-9">
        <SectionLabel inverted>Hvad vi tror på</SectionLabel>
        <h2 className="font-serif text-5xl md:text-7xl lg:text-[72px] font-normal leading-none tracking-tight max-w-5xl">
          Spiken er i{" "}
          <em className="italic font-normal text-amber">kombinationen.</em>
        </h2>
        <p className="font-mono text-xs md:text-sm tracking-widest uppercase text-amber/80 mt-6">
          AI + Commercial
        </p>
      </div>

      <div className="max-w-editorial mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-rule-dark">
        {points.map((p, i) => (
          <div
            key={p.n}
            className={`px-6 py-8 flex flex-col gap-3.5 ${
              i > 0 ? "border-t md:border-t-0 md:border-l border-rule-dark" : ""
            } ${i >= 3 ? "lg:border-t lg:border-rule-dark" : "lg:border-t-0"}`}
          >
            <div className="font-mono text-[11px] text-amber tracking-wider">
              {p.n}
            </div>
            <h3 className="font-serif text-xl md:text-[22px] font-medium leading-[1.2]">
              {p.title}
            </h3>
            <p className="font-sans text-[13px] leading-relaxed text-cream/65 mt-auto">
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
