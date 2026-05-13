import { SectionLabel, DoubleRule, SpaikeWordmark } from "./EditorialUI";

const steps = [
  {
    n: "01",
    title: "Strategisk alignment",
    body: "30 min med ledelsen om jeres 2-3 vigtigste strategiske mål.",
    dur: "30 min",
  },
  {
    n: "02",
    title: "Tilmeld",
    body: "Vi sætter Discovery op til jeres virksomhed.",
    dur: "15 min",
  },
  {
    n: "03",
    title: "Interviews",
    body: "3-5 medarbejdere interviewet med afsæt i jeres strategiske mål.",
    dur: "15-20 min · pr. person",
  },
  {
    n: "04",
    title: "Handlingsplan",
    body: "Prioriteret rapport koblet til jeres strategiske mål.",
    dur: "48 timer",
  },
];

export default function DiscoveryCTA() {
  return (
    <section id="discovery">
      <DoubleRule />
      <div className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-16 pb-9">
        <SectionLabel>Sådan starter vi</SectionLabel>
        <h2 className="font-serif text-4xl md:text-6xl font-normal leading-none tracking-tight max-w-4xl">
          Start med{" "}
          <em className="italic font-normal text-amber-dark">48 timers</em> klarhed.
        </h2>
        <p className="font-serif text-base md:text-lg text-ink-soft mt-5 max-w-3xl leading-relaxed">
          <SpaikeWordmark size="sm" /> Discovery starter med jeres strategiske mål,
          interviewer 3-5 medarbejdere, og leverer en handlingsplan der viser
          hvor AI kan frigøre ressourcer og hvor de bør lande for at accelerere
          det der er vigtigst for jeres forretning.
        </p>
      </div>

      <div className="max-w-editorial mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-rule">
        {steps.map((s, i) => {
          const borders = [
            "",
            "border-t border-rule md:border-t-0 md:border-l",
            "border-t border-rule lg:border-t-0 lg:border-l",
            "border-t border-rule md:border-l lg:border-t-0",
          ][i];
          return (
          <div
            key={s.n}
            className={`px-9 py-9 flex flex-col gap-3.5 ${borders}`}
          >
            <div className="flex justify-between items-baseline">
              <span className="font-mono text-[11px] tracking-wider text-amber-dark">
                {s.n}
              </span>
              <span className="font-mono text-[10px] tracking-wider uppercase text-muted">
                {s.dur}
              </span>
            </div>
            <h3 className="font-serif text-2xl md:text-[28px] font-medium leading-[1.1]">
              {s.title}
            </h3>
            <p className="font-sans text-sm leading-relaxed text-ink-soft">
              {s.body}
            </p>
          </div>
          );
        })}
      </div>

      <div className="max-w-editorial mx-auto w-full px-6 md:px-14 py-12 border-t border-rule">
        <p className="font-mono text-[11px] tracking-widest uppercase text-muted mb-5">
          — I rapporten finder I
        </p>
        <ul className="grid md:grid-cols-2 gap-x-12 gap-y-3 font-serif text-lg text-ink-soft leading-relaxed max-w-4xl">
          <li className="flex gap-3">
            <span className="text-amber-dark font-mono text-sm pt-1.5">→</span>
            <span>Hvor jeres team faktisk bruger tiden (mappet pr. rolle og proces)</span>
          </li>
          <li className="flex gap-3">
            <span className="text-amber-dark font-mono text-sm pt-1.5">→</span>
            <span>3-5 prioriterede automation-muligheder med vurderet impact</span>
          </li>
          <li className="flex gap-3">
            <span className="text-amber-dark font-mono text-sm pt-1.5">→</span>
            <span>Forventet tidshorisont og kompleksitet for hver</span>
          </li>
          <li className="flex gap-3">
            <span className="text-amber-dark font-mono text-sm pt-1.5">→</span>
            <span>Konkret anbefaling til hvor I bør starte</span>
          </li>
        </ul>
      </div>

      <div className="bg-cream-deep border-t border-rule">
        <div className="max-w-editorial mx-auto w-full px-6 md:px-14 py-5 flex flex-col md:flex-row items-start md:items-center md:justify-between gap-4">
          <p className="font-serif text-base italic text-ink">
            Gratis i opstartsfasen for vores første 10 partnere · ingen sælger
            på linjen.
          </p>
          <a
            href="https://assessment.spaike.dk"
            className="bg-ink text-cream px-5 py-3.5 font-sans text-[13px] font-medium hover:bg-ink/85 transition-colors whitespace-nowrap"
          >
            Kør gratis Discovery →
          </a>
        </div>
      </div>
    </section>
  );
}
