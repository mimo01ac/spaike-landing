import { formaterDato, naesteRaadgivningspulje, puljeStatus } from "@/lib/tilskud/puljer";

/**
 * Smal bjælke øverst på forsiden, der peger på /tilskud, mens en
 * SMV:Digital-pulje med kendt lukkedato er på vej eller åben. Forsvinder af
 * sig selv efter lukning (forsiden revalideres hver time).
 */
export default function TilskudBjaelke() {
  const p = naesteRaadgivningspulje();
  if (!p?.lukker) return null;
  const aaben = puljeStatus(p) === "aaben";
  const tekst = aaben
    ? `SMV:Digital-puljen er åben til ${formaterDato(p.lukker)}.`
    : `SMV:Digital-puljen åbner ${formaterDato(p.aabner)}.`;
  return (
    <a
      href="/tilskud"
      data-track-event="tilskud_bjaelke_click"
      className="block bg-ink text-cream hover:bg-ink/90 transition-colors"
    >
      <div className="max-w-editorial mx-auto px-6 md:px-14 py-2.5 font-sans text-[13px] flex flex-wrap items-center justify-center gap-x-2 text-center">
        <span>{tekst}</span>
        <span className="text-amber underline underline-offset-2">Tjek gratis, om I kan søge →</span>
      </div>
    </a>
  );
}
