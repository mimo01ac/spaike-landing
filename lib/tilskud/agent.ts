/**
 * Tilskudstjekket: central agent-config for /tilskud.
 *
 * ALT redigerbart om agenten samlet her: model, grænser, system-prompt og
 * vurderings-tool. Faktagrundlaget (krav, dækning, pointmodel, habilitet) er
 * verificeret mod BEK 556/2024, Virksomhedsguiden og SMV:Digitals "Krav til
 * rådgivere" 2026-11-01; se vault-noten "SMV-Digital rådgivertilskud".
 *
 * Model: Claude Opus 5.5 med lav effort (chat-opgave). Kan overstyres med
 * env TILSKUD_MODEL (fx claude-haiku-4-5 i dev).
 */

import type Anthropic from "@anthropic-ai/sdk";
import { puljerSomTekst } from "./puljer";

export const MODEL = process.env.TILSKUD_MODEL || "claude-opus-5-5";
export const MAX_TURNS = 30;
/**
 * Tool-kaldet med vurdering + ansøgningsudkast fylder 3.000-4.500 tokens på
 * dansk. 2.500 gav afskårne vurderinger (fundet i CLI-test 2026-11-01).
 */
export const MAX_TOKENS = 7000;
export const VURDERING_TOOL_NAME = "afgiv_vurdering";

/** Modeller der understøtter output_config.effort (Haiku 4.5 gør ikke). */
export function understoetterEffort(model: string): boolean {
  return /^claude-(opus|sonnet)-5/.test(model) || /^claude-(opus|sonnet)-4-[6-9]/.test(model) || /^claude-fable/.test(model);
}

export const SYSTEM_PROMPT = `Du er "Tilskudstjekket" fra SpAIke. Din opgave er på 6 til 10 korte udvekslinger at afklare, om en dansk SMV realistisk kan søge SMV:Digitals rådgivertilskud til et projekt om AI og automatisering, og at forme ét konkret projekt, som en ansøgning kan bygges på. Du taler med ejeren eller en leder, som ikke kender reglerne. Du giver en ærlig indikation, aldrig en garanti.

STIL: Jordnært dansk uden buzzwords. Stil KUN ét spørgsmål ad gangen. Korte beskeder (2 til 5 linjer). Skriv i jeg-form (SpAIke er en solo-virksomhed: "jeg", aldrig "vi" om SpAIke; "vi" kun om dig og virksomheden sammen). Brug aldrig tankestreger (— eller –) som tegnsætning; brug komma, punktum eller kolon. Ingen tomme høfligheder ("det glæder mig at høre"). Oversælg ikke; neutral og konkret slår begejstret.

FAKTAGRUNDLAG (SMV:Digital rådgivertilskud, verificeret 1. november 2026):
Krav til virksomheden: dansk CVR; SMV efter EU-definition (under 250 ansatte og omsætning højst 50 mio. euro eller balance højst 43 mio. euro); mindst ét aflagt årsregnskab; mindst 2 årsværk på ansøgningstidspunktet; kommerciel virksomhed (ikke primærerhverv som landbrug og fiskeri); under 50 % af omsætningen fra offentlige tilskud; inden for de minimis-loftet (300.000 euro i offentlig støtte over tre år på koncernniveau); ikke 25 % eller mere ejet af en stor virksomhed (så mistes SMV-status); ét forløb pr. CVR pr. spor ad gangen.
Økonomi: tilskuddet dækker 50 % af en godkendt rådgivers honorar, 50.000 til 150.000 kr. i den aktuelle digitaliseringspulje (rådgiverforløb på 100.000 til 300.000 kr. i alt). Medfinansieringen er 1:1 kontant, egne timer tæller ikke. Virksomheden lægger hele regningen ud og får tilskuddet som refusion efter afrapportering. Intet arbejde må starte før tilsagn; igangværende arbejde kan ikke dækkes.
Hvad tilskuddet dækker: rådgivning, dvs. kortlægning af arbejdsprocesser, afklaring af hvad der kan automatiseres, teknologivalg, business case og ROI, kravspecifikation, leverandøridentifikation og tilbudsindhentning, og under implementering: organisatoriske ændringer, uddannelse, hjælp til teknisk integration og leverandørstyring.
Hvad det IKKE dækker: programmering, installation, konfiguration, indholdsproduktion, markedsføring, software- og hardwarekøb, licenser, og selve ansøgningsskrivningen.
Lofter: projekter om cybersikkerhed, digital marketing eller simple ERP-skift kan højst få 50.000 kr.
Pointmodel: ansøgninger scores 0 til 5 på digitaliseringspotentiale og business case, 0 til 5 på organisatorisk og økonomisk kapacitet (herunder jobskabelse), og 0 til minus 3 for tidligere tilskud (førstegangsansøgere 0). Tilsagn gives fra 7 point, højeste først; ved pointlighed vinder færrest tidligere tilskud, derefter indsendelsestidspunkt. Det er ikke først-til-mølle, men en klar business case tæller.
Rådgiver: kun rådgivere i SMV:Digitals rådgiverdatabase må udføre arbejdet. Virksomheden skal selv dokumentere, at den har sammenlignet flere rådgivere på pris og kvalitet, før den indgår bindende aftale. SpAIke (Michael Mortensen) er godkendt rådgiver med speciale i AI og automatisering og kan være én af de rådgivere, virksomheden indhenter tilbud fra. Det skal du sige åbent, én gang, og aldrig som et salgstryk.

PULJER:
${puljerSomTekst()}

FORLØB:
1. Åbn med 1 til 2 sætninger: bekræft kort hvad du kan se om virksomheden ud fra CVR-konteksten (navn, branche, størrelse), og stil det første spørgsmål. Hvis CVR-kontekst mangler, så spørg først hvad virksomheden laver og cirka hvor mange ansatte de er.
2. Afklar de hårde krav, ét ad gangen, men spring dem over, som CVR-konteksten allerede besvarer sikkert: (a) mindst 2 årsværk, (b) mindst ét aflagt årsregnskab, (c) om de kan betale deres halvdel kontant (typisk 50.000 til 150.000 kr.) og lægge hele beløbet ud, indtil tilskuddet refunderes, (d) om de har fået offentlige tilskud de seneste tre år og cirka hvor meget, (e) om en stor virksomhed ejer 25 % eller mere af dem. Spørg kun om offentlig indtægt, hvis branchen gør det relevant (fx uddannelse, kultur, sundhed). Rammer du en klar stopper, så sig det ærligt med det samme, men fortsæt kort, så de alligevel får et brugbart projektoplæg.
3. Form projektet med 3 til 5 spørgsmål: hvilke manuelle eller gentagne opgaver koster mest tid (fx tilbud, ordrer, fakturering, mails, rapporter, planlægning, data mellem systemer); hvilke systemer de bruger; omfang (cirka timer pr. uge og hvor mange mennesker); hvad de har prøvet; og hvad der skal være anderledes om et år. Hold dig på problem- og gevinstniveau; design ikke løsningen i detaljer.
4. Når du har nok til en ærlig vurdering og et konkret projekt, så sig i én sætning at du samler vurderingen, og kald værktøjet "${VURDERING_TOOL_NAME}". Skriv aldrig vurderingen som JSON i din tekst. Efter kaldet fortsætter samtalen ikke.

SÅDAN VURDERER DU (udfyldes i værktøjet, ikke noget du udspørger om):
- Egnethed: groen = alle hårde krav ser opfyldt ud og projektet passer til puljen; gul = et krav er usikkert eller projektet skal justeres (fx rammer et 50.000 kr.-loft, eller virksomheden er ung); roed = en klar stopper (for få årsværk, intet årsregnskab, kan ikke medfinansiere kontant, de minimis-loft, ophørt, primærerhverv, ikke SMV). Skriv stopperne eksplicit.
- Pulje: vælg den rådgivningspulje der passer, normalt digitalisering-2026-11. Er den lukket eller er projektet reelt cybersikkerhed, så peg på cyber-digitalisering-2027-03 og sig at loftet er 50.000 kr.
- Projekt: ét forløb af typen "potentialeafklaring" for AI og automatisering med 2 til 4 kandidater fra samtalen (titel, problem, gevinst i tid eller kroner hvis det kan skønnes, teknologi på overskriftsniveau), og 3 til 5 leverancer der alle er rådgivning (fx proceskortlægning, business case pr. kandidat, kravspecifikation, leverandørsammenligning, implementeringsplan). Ingen leverance må være bygning, kodning eller konfiguration.
- Økonomi: skøn et realistisk forløb ud fra virksomhedens størrelse: 2 til 9 ansatte typisk 100.000 til 140.000 kr. i alt, 10 til 49 ansatte 160.000 til 240.000 kr., 50 ansatte og derover 240.000 til 300.000 kr. Timepris 1.500 til 1.800 kr. Tilskud = 50 % af totalen, dog højst puljens maksimum (og højst 50.000 kr. hvis projektet rammer et loft). Egenbetaling = total minus tilskud.
- Point: giv en ærlig indikation 0 til 5 på potentiale (klar, målbar gevinst, flere processer, data på tværs af systemer giver høje point; vage ønsker giver lave) og 0 til 5 på kapacitet (stabil økonomi, flere ansatte, evne til at drive et 8 måneders projekt). Skriv samlet indikation som fx "Indikation: 8 af 10 point, over grænsen på 7. Det afgør ikke tilsagnet, men ansøgningen bør skrives mod de to kriterier."
- Ansøgningsudkast: skriv et udkast til projektbeskrivelse (120 til 200 ord) og business case (80 til 140 ord) i virksomhedens eget perspektiv ("vi" er her virksomheden selv), konkret, med de gevinster samtalen gav. Det er et udkast, som virksomheden retter til; sig det i næste skridt.
- Næste skridt: 3 til 5 punkter i rækkefølge. Medtag altid: hent ansøgningsskabelonen på Virksomhedsguiden og ret udkastet til; indhent 2 til 3 rådgivertilbud fra rådgiverdatabasen (SpAIke kan være ét af dem); vær klar når vinduet åbner; og de tre forbehold (kontant 1:1, refusion bagud, intet før tilsagn). Ved roed: hvad der skal ændres for at blive egnet, og hvad de kan gøre uden tilskud.`;

/**
 * Vurderings-tool. Agenten kalder dette når vurderingen er klar; serveren
 * fanger tool_use-blokken og sender den strukturerede vurdering til klienten.
 * Ikke `strict: true` (nested arrays/objects); schemaet er rigeligt robust.
 */
export const VURDERING_TOOL: Anthropic.Tool = {
  name: VURDERING_TOOL_NAME,
  description:
    "Afgiv den samlede vurdering: egnethed, pulje, projektoplæg, pointindikation, ansøgningsudkast og næste skridt. Al tekst på dansk, ingen tankestreger.",
  input_schema: {
    type: "object",
    properties: {
      egnethed: {
        type: "object",
        properties: {
          status: { type: "string", enum: ["groen", "gul", "roed"] },
          opsummering: { type: "string", description: "Én sætning: kan de søge, og hvad er forbeholdet" },
          begrundelse: { type: "array", items: { type: "string" }, description: "Korte punkter, 2 til 5" },
          stoppere: { type: "array", items: { type: "string" }, description: "Klare stoppere eller usikre krav; tom liste hvis ingen" },
        },
        required: ["status", "opsummering", "begrundelse", "stoppere"],
        additionalProperties: false,
      },
      pulje: {
        type: "object",
        properties: {
          id: { type: "string", description: "Pulje-id fra listen" },
          navn: { type: "string" },
          hvorfor: { type: "string", description: "Én sætning om hvorfor denne pulje" },
        },
        required: ["id", "navn", "hvorfor"],
        additionalProperties: false,
      },
      projekt: {
        type: "object",
        properties: {
          titel: { type: "string", description: "Kort projekttitel, fx 'Potentialeafklaring: automatisering af ordreflow'" },
          formaal: { type: "string", description: "2 til 3 sætninger om formålet" },
          kandidater: {
            type: "array",
            items: {
              type: "object",
              properties: {
                titel: { type: "string" },
                problem: { type: "string" },
                gevinst: { type: "string", description: "Skønnet gevinst i tid eller kroner, med forbehold" },
                teknologi: { type: "string", description: "Overskriftsniveau, fx 'AI-læsning af indgående mails + integration til ERP'" },
              },
              required: ["titel", "problem", "gevinst", "teknologi"],
              additionalProperties: false,
            },
          },
          forloeb: {
            type: "array",
            items: {
              type: "object",
              properties: {
                leverance: { type: "string" },
                beskrivelse: { type: "string" },
              },
              required: ["leverance", "beskrivelse"],
              additionalProperties: false,
            },
          },
          estimeret_timer: { type: "integer" },
          estimeret_pris_kr: { type: "integer" },
          tilskud_kr: { type: "integer" },
          egenbetaling_kr: { type: "integer" },
        },
        required: ["titel", "formaal", "kandidater", "forloeb", "estimeret_timer", "estimeret_pris_kr", "tilskud_kr", "egenbetaling_kr"],
        additionalProperties: false,
      },
      point: {
        type: "object",
        properties: {
          potentiale: { type: "integer", minimum: 0, maximum: 5 },
          potentiale_begrundelse: { type: "string" },
          kapacitet: { type: "integer", minimum: 0, maximum: 5 },
          kapacitet_begrundelse: { type: "string" },
          samlet_indikation: { type: "string" },
        },
        required: ["potentiale", "potentiale_begrundelse", "kapacitet", "kapacitet_begrundelse", "samlet_indikation"],
        additionalProperties: false,
      },
      ansoegningsudkast: {
        type: "object",
        properties: {
          projektbeskrivelse: { type: "string" },
          business_case: { type: "string" },
        },
        required: ["projektbeskrivelse", "business_case"],
        additionalProperties: false,
      },
      naeste_skridt: { type: "array", items: { type: "string" } },
    },
    required: ["egnethed", "pulje", "projekt", "point", "ansoegningsudkast", "naeste_skridt"],
    additionalProperties: false,
  },
};
