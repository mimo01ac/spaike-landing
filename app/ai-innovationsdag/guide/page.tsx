import type { Metadata } from "next";
import Logo from "../../components/Logo";
import PrintButton from "../_components/PrintButton";

export const metadata: Metadata = {
  title: "Gør det selv: Sådan holder du din egen AI-innovationsdag | SpAIke",
  description:
    "Den ærlige, gratis guide til at køre en AI-innovationsdag selv: vælg case, værktøjer, 2-ugers forberedelse, køreplan time-for-time, demo, og vejen til værdi efter dagen.",
  alternates: { canonical: "https://www.spaike.dk/ai-innovationsdag/guide" },
  openGraph: {
    title: "Sådan holder du din egen AI-innovationsdag",
    description:
      "Hele opskriften, gratis: case-valg, værktøjer, forberedelse, køreplan og vejen til værdi.",
    type: "article",
    locale: "da_DK",
    url: "https://www.spaike.dk/ai-innovationsdag/guide",
  },
};

const TOC: { id: string; titel: string }[] = [
  { id: "s1", titel: "1. Hvad en innovationsdag er (og ikke er)" },
  { id: "s2", titel: "2. Format og hold" },
  { id: "s3", titel: "3. Vælg den rigtige case" },
  { id: "s4", titel: "4. Værktøjer" },
  { id: "s5", titel: "5. Forberedelse: 2-ugers nedtælling" },
  { id: "s6", titel: "6. Køreplanen time-for-time" },
  { id: "s7", titel: "7. Roller på dagen" },
  { id: "s8", titel: "8. Demo og bedømmelse" },
  { id: "s9", titel: "9. Efter dagen: vejen til værdi" },
  { id: "s10", titel: "10. Typiske faldgruber" },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="font-serif text-2xl md:text-3xl text-ink leading-tight mt-12 mb-4 scroll-mt-24"
    >
      {children}
    </h2>
  );
}

export default function GuidePage() {
  return (
    <main className="bg-cream text-ink min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-rule no-print">
        <div className="max-w-editorial mx-auto px-6 md:px-12 py-5 flex items-center justify-between gap-6">
          <a href="/ai-innovationsdag" aria-label="SpAIke" className="flex items-baseline gap-3.5">
            <Logo size="md" />
            <span className="hidden md:inline font-mono text-[10px] tracking-widest uppercase text-muted">
              AI advisory
            </span>
          </a>
          <a
            href="/ai-innovationsdag#vaerktoej"
            className="bg-ink text-cream px-4 py-2.5 font-sans text-[12px] font-medium tracking-wider uppercase hover:bg-ink/85 transition-colors"
          >
            Find jeres case →
          </a>
        </div>
      </header>

      <div className="max-w-editorial mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[230px_1fr] gap-10 lg:gap-14">
          {/* Indholdsfortegnelse */}
          <aside className="no-print lg:sticky lg:top-24 lg:self-start">
            <p className="font-mono text-[10px] tracking-widest uppercase text-muted mb-3">
              Indhold
            </p>
            <nav className="space-y-2">
              {TOC.map((t) => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  className="block text-[13px] text-ink-soft hover:text-amber-dark transition-colors leading-snug"
                >
                  {t.titel}
                </a>
              ))}
            </nav>
          </aside>

          {/* Artikel (brief-print = den eneste region der kommer med på PDF) */}
          <article className="brief-print max-w-2xl">
            <div className="flex items-start justify-between gap-4 mb-3">
              <p className="font-mono text-[11px] tracking-widest uppercase text-amber-dark">
                Gør det selv
              </p>
              <PrintButton />
            </div>

            <h1 className="font-serif text-3xl md:text-4xl leading-[1.1] text-ink mb-3">
              Sådan holder du din egen AI-innovationsdag
            </h1>
            <p className="font-serif text-lg md:text-xl text-ink-soft leading-snug mb-6">
              Den ærlige guide til et hands-on byg-event hvor dit team løser et rigtigt problem med
              AI på én dag
            </p>
            <p className="text-ink-soft leading-relaxed italic border-l-2 border-amber-dark pl-4 mb-2">
              Jeg har samlet alt det jeg selv bruger til at facilitere en AI-innovationsdag i denne
              guide. Du kan bruge den til at køre din egen. Jeg holder ikke noget tilbage, for jeg
              tror på, at jo flere der oplever hvad AI faktisk kan i deres egen hverdag, jo bedre.
              Vil du have hjælp, er jeg kun en besked væk, men du kan komme langt selv med det her.
            </p>

            {/* 1 */}
            <H2 id="s1">Først: vær ærlig om hvad en innovationsdag er (og ikke er)</H2>
            <p className="text-ink-soft leading-relaxed mb-4">
              En innovationsdag er en byg-dag: et lille team tager ét konkret problem fra jeres egen
              hverdag og bygger en fungerende prototype på det med AI-værktøjer i løbet af en dag.
              Med vibe coding når I længere end de fleste tror. I går ikke fra dagen med en skitse,
              men med en demo-bar løsning på én værdifuld feature, I kan se virke. En reel andel af
              de cases der bygges på den slags dage, ender med at komme i drift bagefter.
            </p>
            <p className="text-ink-soft leading-relaxed mb-4">
              Vær samtidig ærlig om hvad det ikke er: ikke et færdigt, produktionsklart system fra
              dag ét. I står med en prototype af én feature plus en klar vej videre, ikke en hærdet
              løsning. Den ærlighed fjerner presset der ellers skræmmer ikke-tekniske deltagere væk,
              uden at I behøver at tale dagen ned.
            </p>
            <p className="text-ink-soft leading-relaxed mb-4">
              <strong className="text-ink font-semibold">Den vigtigste indsigt i hele guiden:</strong>{" "}
              succes afgøres FØR og EFTER dagen, ikke på selve dagen. Bruger I ikke tid på
              forberedelse, går de første timer med adgangs-bøvl i stedet for at bygge. Aftaler I
              ikke en vej videre, dør prototyperne stille i ugerne efter. Begge dele kan I designe
              væk fra start, og resten af guiden viser hvordan.
            </p>

            {/* 2 */}
            <H2 id="s2">Format og hold</H2>
            <ul className="space-y-2.5 text-ink-soft leading-relaxed mb-4 list-disc pl-5">
              <li>
                <strong className="text-ink font-semibold">Fuld dag (ca. 7 timer, 09 til 17).</strong>{" "}
                Ikke halv dag (for lidt tid til at lære værktøjet og bygge), ikke to dage (for tungt
                til en førstegang).
              </li>
              <li>
                <strong className="text-ink font-semibold">Hold på 3 til 5 personer</strong>, mindst
                én ikke-teknisk pr. hold. De ikke-tekniske former ofte casen bedre end den tekniske
                udførelse gør.
              </li>
              <li>
                <strong className="text-ink font-semibold">8 til 20 deltagere</strong> i alt er en
                god ramme.
              </li>
              <li>
                <strong className="text-ink font-semibold">Facilitering:</strong> i jeres skala kan
                én facilitator klare dagen, hvis builds holdes enkle (se punkt 4) og adgang og data
                er sat op på forhånd. Hav jeres egen IT på standby på dagen. Først ved større hold
                eller meget tekniske cases giver en ekstra mentor mening.
              </li>
            </ul>

            {/* 3 */}
            <H2 id="s3">Vælg den rigtige case (det her er 80% af slaget)</H2>
            <p className="text-ink-soft leading-relaxed mb-4">
              Når AI skriver koden, er flaskehalsen ikke længere at kode, men at vide præcis hvad der
              skal bygges. Brug derfor god tid på at ramme den ene rigtige feature.
            </p>
            <ul className="space-y-2.5 text-ink-soft leading-relaxed mb-4 list-disc pl-5">
              <li>
                <strong className="text-ink font-semibold">One-User, One-Problem.</strong> Kollaps
                et vagt tema til én bruger + ét problem + én løsning. Ikke &laquo;vi har
                data-rod&raquo;, men &laquo;en travl sagsbehandler ved ikke hvilke mails der haster,
                så hun skal bruge en app der scorer og sorterer indbakken&raquo;.
              </li>
              <li>
                <strong className="text-ink font-semibold">Gør det SMART:</strong> specifikt,
                målbart, opnåeligt, relevant, tidsbundet.
              </li>
              <li>
                <strong className="text-ink font-semibold">&laquo;If the judge can&apos;t see it,
                don&apos;t build it.&raquo;</strong>{" "}
                Vælg én synlig, demo-bar kerne-feature der løser hovedsmerten. Drop alt andet.
              </li>
              <li>
                <strong className="text-ink font-semibold">10-minutters feasibility-tjek før I
                committer:</strong>{" "}
                (1) Kan vi demo&apos;e det visuelt? (2) Kræver det data vi ikke har? (3) Kan vi
                bygge &laquo;the magic moment&raquo; med no-code/AI? Og beslut eksplicit hvad I IKKE
                bygger (fx &laquo;ingen login-skærm&raquo;).
              </li>
            </ul>

            {/* Inline CTA efter sektion 3 */}
            <div className="no-print border border-amber-dark rounded bg-cream-deep p-5 my-7">
              <p className="text-[15px] text-ink leading-relaxed mb-3">
                Usikker på hvad der er en god case hos jer? Jeg har bygget et lille værktøj der
                hjælper jer med at finde og skærpe 1 til 3 konkrete cases på 10 minutter.
              </p>
              <a
                href="/ai-innovationsdag#vaerktoej"
                className="inline-block bg-ink text-cream px-5 py-2.5 font-sans text-[12px] font-medium tracking-wider uppercase hover:bg-ink/85 transition-colors"
              >
                Prøv guiden →
              </a>
            </div>

            {/* 4 */}
            <H2 id="s4">Værktøjer (vælg nul-installations-værktøjer)</H2>
            <p className="text-ink-soft leading-relaxed mb-4">
              Vælg browser-baserede vibe coding-værktøjer, så der intet er at installere, og så et
              hold af ikke-udviklere kan få en fungerende app (ikke bare en pæn skærm) på få timer.
            </p>
            <ul className="space-y-2.5 text-ink-soft leading-relaxed mb-4 list-disc pl-5">
              <li>
                <strong className="text-ink font-semibold">Lovable</strong> = default, &laquo;alle
                starter her&raquo;. Pæneste UI for nul-kodere, indbygget database + auth + 1-klik
                hosting.
              </li>
              <li>
                <strong className="text-ink font-semibold">Bolt.new</strong> = hurtigt alternativ
                til en delbar demo.
              </li>
              <li>
                Hold udvikler-IDE&apos;er som Cursor og Claude Code <strong className="text-ink font-semibold">ude</strong>{" "}
                af ikke-dev-sporet.
              </li>
            </ul>
            <p className="text-ink-soft leading-relaxed mb-4">
              <strong className="text-ink font-semibold">Den dyreste begynderfælde: credits.</strong>{" "}
              Alle værktøjer måler på credits/tokens, og det mest almindelige sted folk går i stå er
              midt i et build fordi gratis-tieren er brugt op.{" "}
              <strong className="text-ink font-semibold">Pre-provisionér mindst én betalt seat pr.
              hold</strong>{" "}
              (Lovable Starter ca. $20). Undgå Replit til ukontrolleret brug, hvor prisen lydløst
              kan løbe op i $200+. Tjek aktuelle priser på værktøjets egen side ugen før, for de
              ændrer sig ofte.
            </p>

            {/* 5 */}
            <H2 id="s5">Forberedelse: 2-ugers nedtælling (hackathonet starter før hackathonet)</H2>
            <p className="text-ink-soft leading-relaxed mb-4">
              Alt det tekniske (adgang, data, værktøjer og API&apos;er) skal være sat op og testet
              fra ende til anden ca. 2 uger før. Den hyppigste fejl er at undervurdere adgang:{" "}
              <strong className="text-ink font-semibold">tilladelser tager altid længere end man
              tror.</strong>
            </p>
            <p className="font-mono text-[11px] tracking-wider uppercase text-muted mb-3">
              Checkliste, ca. 2 uger før
            </p>
            <ul className="space-y-2.5 text-ink-soft leading-relaxed mb-4">
              {[
                ["Lås temaerne / kvalificér casene", "med deltagerne. Specifikke processer, ikke teknologi. Hver case skal have en ejer."],
                ["Opret konti", "pr. hold (Lovable/Bolt), mindst én betalt seat pr. hold."],
                ["Byg starter-skabeloner + 1 til 2 eksempel-projekter", "så ingen starter på en blank side."],
                ["Klargør 3 til 5 anonymiserede eller syntetiske datasæt", "pr. tema i en sandbox, med en data-ordbog i klart sprog. Default til syntetisk/anonymiseret data af hensyn til GDPR. (Tip: tal med jeres IT om hvordan et typisk datasæt for problemet ser ud, og lav et lille script der genererer syntetisk data i samme form, så I aldrig rører rigtige følsomme data på dagen.)"],
                ["Sæt 2 til 4 API'er op", "med simpel nøgle-auth (aldrig OAuth), med spend-caps på nøgle-niveau. Test alle nøgler 24 til 48 timer før."],
                ["Skriv bedømmelses-rubrikken", "og del den med deltagerne på forhånd."],
                ["Aftal vejen videre + en navngiven ejer", "hos jer FØR dagen."],
                ["Send én briefing-pakke 48 timer før", "alle links, logins, skema og FAQ i én besked."],
                ["Lås 2 til 3 godkendte værktøjer/modeller", "ikke «brug hvad I vil» (det giver spredte, usammenlignelige resultater)."],
              ].map(([t, rest], i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-amber-dark mt-0.5 shrink-0">☐</span>
                  <span>
                    <strong className="text-ink font-semibold">{t}</strong> {rest}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-ink-soft leading-relaxed mb-4">
              Deltagerne, før dagen: medbring én konkret proces fra eget arbejde, få adgang/logins
              på forhånd, læs rubrikken, og tag relevante data-eksempler eller før-tal med.
            </p>

            {/* 6 */}
            <H2 id="s6">Køreplanen time-for-time</H2>
            <div className="overflow-x-auto mb-2">
              <table className="w-full text-[14px] border-collapse">
                <thead>
                  <tr className="border-b border-rule text-left">
                    <th className="py-2 pr-3 font-mono text-[10px] tracking-wider uppercase text-muted font-medium">Tid</th>
                    <th className="py-2 pr-3 font-mono text-[10px] tracking-wider uppercase text-muted font-medium">Blok</th>
                    <th className="py-2 font-mono text-[10px] tracking-wider uppercase text-muted font-medium">Pointe</th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  {[
                    ["09:00", "Ankomst, kaffe, login-tjek", "Verificér wifi + alle tool-logins virker FØR start"],
                    ["09:30", "Kickoff & framing", "Udfordring, normer, «hvem er ny?», rubrik vist op front"],
                    ["10:00", "Undervisning: live vibe coding-demo", "Vis værktøjet + prompting-mønstre. Show, don't lecture"],
                    ["10:45", "Holddannelse + 1-min case-pitch", "Hvert hold definerer deres ene proces"],
                    ["11:00", "Build-sprint 1 (mentorer roterer)", "Scoping til ÉN feature; mentorer tvinger narrowing"],
                    ["12:30", "Frokost", "Let mad (tungt brød gør folk søvnige)"],
                    ["13:15", "Build-sprint 2 + mentor-tjek", "Byg den ene flow end-to-end"],
                    ["15:30", "Build-freeze nærmer sig", "Forbered hvad I viser + fallback-demo (skærmoptagelse)"],
                    ["16:00", "Demos / showcase", "3 til 4 min pr. hold, live demo frem for slides"],
                    ["16:45", "Anerkendelse + «hvad nu?»", "Rut vindende cases mod en rigtig pilot"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-rule/60">
                      <td className="py-2.5 pr-3 font-mono text-amber-dark whitespace-nowrap">{r[0]}</td>
                      <td className="py-2.5 pr-3 text-ink">{r[1]}</td>
                      <td className="py-2.5 text-ink-soft">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-ink-soft leading-relaxed mb-4">
              Undervisning FØR build er bevidst: deltagerne skal se &laquo;the magic moment&raquo;
              før de selv kan ramme den.
            </p>

            {/* 7 */}
            <H2 id="s7">Roller på dagen</H2>
            <ul className="space-y-2.5 text-ink-soft leading-relaxed mb-4 list-disc pl-5">
              <li>
                <strong className="text-ink font-semibold">Facilitator (én person er nok):</strong>{" "}
                rammesætter dagen, introducerer værktøjet, går rundt og hjælper holdene i gang,
                tvinger scoping til én feature, og holder energien. Det er rollen du selv kan stå i.
              </li>
              <li>
                <strong className="text-ink font-semibold">Deltagerne er domæne-eksperterne:</strong>{" "}
                de kender problemet og former casen. I behøver ikke en separat forretnings-mentor.
              </li>
              <li>
                <strong className="text-ink font-semibold">IT på standby:</strong> aftal med jeres
                egen IT, at de kan give hurtig adgang på dagen, så ingen blokeres af en
                adgangs-ticket. Det aftales på forhånd, det er ikke en bemandet rolle.
              </li>
            </ul>

            {/* 8 */}
            <H2 id="s8">Demo og bedømmelse</H2>
            <ul className="space-y-2.5 text-ink-soft leading-relaxed mb-4 list-disc pl-5">
              <li>
                3 til 4 minutter pr. hold, <strong className="text-ink font-semibold">live demo
                frem for pitch.</strong> I bedømmes på hvad I byggede, ikke hvor god jeres pitch er.
              </li>
              <li>
                Rubrik (vis ved kickoff): forretnings-impact · fungerer end-to-end · vej til
                adoption (pilot inden 90 dage) · risiko-profil · demo-klarhed for en ikke-teknisk
                sponsor.
              </li>
            </ul>

            {/* 9 */}
            <H2 id="s9">Efter dagen: vejen til værdi (her fejler de fleste)</H2>
            <p className="text-ink-soft leading-relaxed mb-4">
              Prototyper dør uden en sponsor og en vej fremad. Design det ind fra start:
            </p>
            <ul className="space-y-2.5 text-ink-soft leading-relaxed mb-4 list-disc pl-5">
              <li>
                <strong className="text-ink font-semibold">Navngiven ejer</strong> hos jer,
                ansvarlig for opfølgning, aftalt før dagen.
              </li>
              <li>
                <strong className="text-ink font-semibold">Beslutningstager/budget-ejer involveret
                allerede i idé-fasen</strong>, så der er en sponsor på dag ét.
              </li>
              <li>
                <strong className="text-ink font-semibold">Behandl al kode som en prototype, ikke
                som færdig produktionskode.</strong> 62% af AI-byggede apps har kritiske
                sårbarheder. Intet i produktion uden et sikkerhedsreview. Ingen hardcodede nøgler.
              </li>
              <li>
                <strong className="text-ink font-semibold">Rut 1 til 2 vindende cases</strong> ind i
                et rigtigt pilot-forløb.
              </li>
              <li>
                <strong className="text-ink font-semibold">Lever en kort efter-rapport:</strong>{" "}
                hvad blev bygget, hvad er det værd, anbefalet næste skridt.
              </li>
            </ul>

            {/* 10 */}
            <H2 id="s10">De typiske faldgruber, og hvordan du undgår dem</H2>
            <div className="overflow-x-auto mb-2">
              <table className="w-full text-[14px] border-collapse">
                <thead>
                  <tr className="border-b border-rule text-left">
                    <th className="py-2 pr-4 font-mono text-[10px] tracking-wider uppercase text-muted font-medium">Faldgrube</th>
                    <th className="py-2 font-mono text-[10px] tracking-wider uppercase text-muted font-medium">Modtræk</th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  {[
                    ["Vage mål / tema", "Specifikt proces-tema pr. hold, låst før alt andet"],
                    ["«Intet sker bagefter»", "Aftalt vej videre + navngiven ejer FØR dagen"],
                    ["Over-scoping", "Facilitatorens kernejob: tving narrowing til én feature"],
                    ["Usynlige builds", "Push mod noget visuelt; krav om live-demo"],
                    ["AI-sikkerhed", "Behandl koden som en prototype: ingen hardcodede nøgler, review før drift"],
                    ["Falsk følelse af «done»", "Vær tydelig: det er en prototype af én feature, ikke et færdigt produkt"],
                    ["Værktøj fejler midt i build", "Mentor on-call + fallback-demo klar"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-rule/60">
                      <td className="py-2.5 pr-4 text-ink">{r[0]}</td>
                      <td className="py-2.5 text-ink-soft">{r[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bund-CTA */}
            <div className="no-print border-t border-rule mt-12 pt-8">
              <p className="font-mono text-[11px] tracking-widest uppercase text-amber-dark mb-3">
                Sådan kan jeg hjælpe
              </p>
              <p className="text-ink-soft leading-relaxed italic mb-6">
                Det her er hele opskriften, og du kan køre den selv. Vil du hellere have, at jeg står
                for forberedelsen, faciliteringen og mentorerne, så I bare skal møde op og bygge, så
                hjælper jeg gerne. Lige nu søger jeg 1 til 2 pilotvirksomheder, jeg kan køre en
                gratis AI-innovationsdag med, for at finpudse processen og bygge rigtige cases
                sammen.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/ai-innovationsdag#vaerktoej"
                  className="inline-block bg-ink text-cream px-5 py-3 font-sans text-[12px] font-medium tracking-wider uppercase hover:bg-ink/85 transition-colors text-center"
                >
                  Søg om en gratis innovationsdag →
                </a>
                <a
                  href="/ai-innovationsdag#vaerktoej"
                  className="inline-block border border-ink text-ink px-5 py-3 font-sans text-[12px] font-medium tracking-wider uppercase hover:bg-ink hover:text-cream transition-colors text-center"
                >
                  Find jeres case med guiden →
                </a>
              </div>
              <p className="text-[12px] text-muted leading-relaxed mt-6">
                Baseret på AngelHack (450+ events), MIT Sloan (5 pitfalls fra 48 hackathons),
                hackathon.guide, Manychat Engineering, 1337 Ventures, OX Security m.fl.
              </p>
            </div>
          </article>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-rule no-print">
        <div className="max-w-editorial mx-auto px-6 md:px-12 py-10 flex flex-col sm:flex-row justify-between gap-4">
          <Logo size="md" />
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted self-end">
            © {new Date().getFullYear()} SpAIke ApS ·{" "}
            <a href="/ai-innovationsdag" className="hover:text-amber-dark transition-colors">
              AI-innovationsdag
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
