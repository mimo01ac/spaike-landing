const beliefs = [
  {
    title: "AI er ikke magi — det er infrastruktur.",
    body: "ROI først, hype senere. Vi bygger det der virker, ikke det der lyder smart.",
  },
  {
    title: "Start med data, ikke meninger.",
    body: "Ingen seks-ugers discovery før vi kan levere værdi. Vores assessment kører på 48 timer.",
  },
  {
    title: "Commercial-first, ikke tech-first.",
    body: "Løsningen tjener forretningen, ikke omvendt. Vi har 15 år på den kommercielle side bag os.",
  },
  {
    title: "Vi bygger med jer, ikke til jer.",
    body: "I skal kunne drive det selv bagefter. Ingen leverandør-lock-in.",
  },
  {
    title: "Ærlighed om hvad AI kan og ikke kan.",
    body: "Du hører “det duer ikke her” lige så ofte som “det her kan vi løse”.",
  },
];

export default function Manifest() {
  return (
    <section
      id="manifest"
      className="bg-background-secondary py-20 md:py-28 border-y border-neutral-200"
    >
      <div className="max-w-content mx-auto px-6">
        <p className="text-sm font-medium text-neutral-500 tracking-widest uppercase mb-3">
          Hvad vi tror på
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12">
          Spiken er i kombinationen.
        </h2>

        <div className="bg-white border border-neutral-200 rounded-2xl p-8 md:p-10 mb-12 md:mb-16">
          <p className="text-lg md:text-xl text-neutral-700 leading-relaxed">
            <span className="font-semibold text-neutral-900">
              AI alene giver kapacitet. Forretningsforståelse alene giver retning.
            </span>{" "}
            Det er kombinationen der skaber målbart impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {beliefs.map((belief, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-spaike-blue font-bold text-sm tabular-nums">
                  0{i + 1}
                </span>
                <h3 className="text-lg md:text-xl font-semibold leading-tight">
                  {belief.title}
                </h3>
              </div>
              <p className="text-neutral-600 leading-relaxed pl-9">{belief.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
