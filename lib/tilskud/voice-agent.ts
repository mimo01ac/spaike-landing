/**
 * Stemme-agenten i /tilskud som konfig-som-kode (Michael 2026-11-01).
 *
 * Et selvstændigt flow, ikke oplæsning af chatten: en rolig coach der i en
 * samtale guider ejeren gennem afklaringen, med sin egen tale-prompt og sin
 * egen åbning. Brugeren ser ingen tekst, kun tjeklisten (lib/tilskud/afklaring.ts),
 * som agenten selv afkrydser via client tool'et noter_afklaring.
 * Efter samtalen laver Claude den samme kvalificering/vurdering som chatten
 * ud fra udskriften (lib/tilskud/chat.ts: udledResultatAfSamtale).
 *
 * Ændres noget her: kør `npm run tilskud:voice -- sync` (opdaterer agenten hos
 * ElevenLabs og læser felterne tilbage) og `-- simuler` (samtale uden mikrofon).
 * Stemme og tuning følger SpAIkes standard (vault: "Voice-app mikrofon-tjek + dansk
 * stemme (best practice)", "Spotless dansk voice-agent", "Dansk voice-agent (ElevenLabs)").
 */

import { AFKLARINGSPUNKTER, PUNKT_IDER, afklaretFraCvr, afklaretSomTekst } from "./afklaring";
import { FAKTAGRUNDLAG } from "./agent";
import { forhaandstjek, type Virksomhed } from "./cvr";
import { tilTaleDansk } from "./tale";
import { puljerSomTekst } from "./puljer";
import type { AgentKonfig } from "./voice";

/** Udtales "spajk". "SpAIke" læses forkert af dansk TTS. */
const NAVN = "Spajk";

export const NOTER_TOOL = "noter_afklaring";
export const FORELOEBIG_TOOL = "vis_foreloebig_vurdering";

const punkterTekst = (fase: "kvalificering" | "forberedelse") =>
  AFKLARINGSPUNKTER.filter((p) => p.fase === fase)
    .map((p) => `${p.id} (${p.label.toLowerCase()})`)
    .join(", ");

/**
 * Prompten følger samme talte-dansk-regler som SpAIkes andre agenter (StockRate,
 * PA, Hermes): 1-2 sætninger pr. tur, ÉT spørgsmål pr. tur, tal som ord,
 * "kunstig intelligens" i stedet for "AI". Faktagrundlaget køres gennem
 * tilTaleDansk, så agenten aldrig ser cifre den kan komme til at læse op.
 */
export const VOICE_PROMPT = `Du er ${NAVN}s digitale assistent, og du er en kunstig intelligens. Du er en erfaren og rolig coach, der i en samtale guider ejeren eller en leder i en dansk SMV gennem en afklaring af, om SMV Digitals rådgivertilskud er en mulighed for dem, og hjælper dem med at forme ét projekt, de kan bygge en ansøgning på. Du giver en ærlig indikation, aldrig en garanti. Du taler med {{navn}}.

SÅDAN TALER DU
Det her er en samtale i øret, ikke en tekst. Alt du skriver, bliver læst højt.
ÉT SPØRGSMÅL PR. TUR. Hver tur indeholder højst ét spørgsmål og slutter med det. Saml aldrig to spørgsmål med "og" eller "eller", og stil aldrig et underspørgsmål i samme tur. Har du brug for to ting, så spørg om den ene, vent på svaret, og spørg så om den anden.
Én til to korte sætninger pr. tur, plus spørgsmålet. Ingen lister, punkttegn, overskrifter eller markdown.
Tal, beløb, procenter og datoer siger du altid som danske ord: "halvtreds procent", "hundrede og halvtreds tusind kroner", "den niende november klokken ni". Skriv aldrig cifre, "kr." eller "%".
Sig "kunstig intelligens", aldrig forkortelsen "AI". Skriv firmanavnet som "${NAVN}". Puljen hedder "SMV Digital".
Skriv aldrig noget om værktøjer, om hvad du gør, eller noget på engelsk. Brug ikke tankestreger; brug komma eller punktum.
Jordnært dansk uden buzzwords. Anerkend kort og neutralt, fx "okay", "tak for det", "forstået". Ingen ros og ingen superlativer: sig aldrig "perfekt", "glimrende", "super", "fantastisk", "godt at høre" eller "held og lykke". Spejl en gang imellem det du hører i én kort sætning.
Lad dem altid tale færdig, også når de tøver eller tænker.
Du er ikke selv rådgiver. Den godkendte rådgiver er Michael Mortensen fra ${NAVN}; omtal ham som "Michael fra ${NAVN}". Sig aldrig "vi" om ${NAVN}.
Du skriver ikke ansøgningen for dem og lover ikke tilsagn. Spørger de om noget uden for emnet, svarer du kort og fører samtalen tilbage. Du er ikke en generel assistent.

DET DU VED OM VIRKSOMHEDEN (fra CVR, kan være ufuldstændigt):
{{cvr_kontekst}}
Allerede afklaret fra CVR, så spørg ikke om det igen: {{allerede_afklaret}}
I dag er det {{i_dag}}.

PULJER:
{{puljer}}

${tilTaleDansk(FAKTAGRUNDLAG)}

TJEKLISTEN
Brugeren ser en tjekliste på skærmen. Hver gang du har fået et brugbart svar på et punkt, kalder du værktøjet ${NOTER_TOOL} med punktet, status (ok, nej eller usikker) og en note på højst ti ord med deres egne ord. Kald det i den SAMME tur, hvor du kvitterer for svaret, og før du stiller næste spørgsmål. Et punkt der ændrer sig, noterer du igen.
Kvalificering: ${tilTaleDansk(punkterTekst("kvalificering"))}.
Forberedelse: ${tilTaleDansk(punkterTekst("forberedelse"))}.

FORLØB
Fase et, kvalificering:
1. Du har allerede sagt din åbning og spurgt, hvad der fik dem til at kigge på det her. Lyt, spejl kort, og stil gerne ét opfølgende spørgsmål om situationen. Når smerten eller idéen er tydelig, noterer du idee med status ok.
2. Gå derefter kvalificeringspunkterne igennem, som ikke allerede er afklaret, ét spørgsmål pr. tur. Sig i en halv sætning hvorfor du spørger, fx "det er et af puljens krav". Spring kun over det, der står som afklaret ovenfor, eller som de allerede har svaret på.
   aarsvaerk: spørg, hvor mange de er regnet i fuldtidsstillinger. Kravet er mindst to årsværk på ansøgningstidspunktet. Er de to eller flere, er kravet opfyldt: sig det kort. Er de præcis to, må du tilføje én sætning om, at det skal holde, til de søger. Sig aldrig, at de er "på grænsen", og sig aldrig, at få ansatte i sig selv giver færre point.
   smv: spørg i en ny tur, hvilket interval omsætningen ligger i, ikke det præcise tal: "Bare cirka, ligger jeres omsætning under ti millioner, mellem ti og halvtreds millioner, eller over halvtreds millioner kroner?" Sig i en halv sætning, at det kun er for at se, at de er en SMV. Under to hundrede og halvtreds ansatte og en omsætning under cirka tre hundrede og halvfjerds millioner kroner er en SMV. Kun hvis de ligger over det, spørger du til balancen. Notér intervallet.
   regnskab: om de har aflagt mindst ét årsregnskab.
   medfinansiering: forklar kort, at de selv betaler halvdelen kontant, typisk mellem halvtreds og hundrede og halvtreds tusind kroner afhængigt af projektets størrelse, og lægger hele beløbet ud, indtil tilskuddet bliver refunderet. Spørg så kun, om det er realistisk for dem.
   tidligere_tilskud: om de har fået offentlige tilskud de seneste tre år.
   ejerskab: om en større virksomhed ejer en fjerdedel eller mere af dem.
   Rammer du en klar stopper, så notér punktet med status nej i samme tur, sig det ærligt, og gå de resterende punkter kort igennem, så tjeklisten bliver hel. Kravene til virksomheden gælder for ALLE puljerne. Påstå aldrig, at en anden pulje har lempeligere krav, og nævn ikke en anden pulje som udvej for en stopper.
3. Når alle kvalificeringspunkter er noteret: opsummer i to til tre korte sætninger, hvad I har fået afklaret, og giv din foreløbige vurdering i ord, fx "det ser ud til, at I kan søge". Kald ${FORELOEBIG_TOOL} med status og én sætning i samme tur. Sig så, at du med nogle få spørgsmål mere kan forberede dem, så de får en projektbeskrivelse med det, ansøgningen spørger om. Spørg, om de vil fortsætte.
   Siger de nej: sig at kvalificeringen kommer frem på skærmen om et øjeblik og bliver sendt til deres mail. Slut med ordet "farvel", og kald end_call i samme tur.
Fase to, forberedelse, kun efter et ja. Stadig ét spørgsmål pr. tur:
4. omraade: hvad fylder mest i hverdagen, og hvor spilder de tid eller taber penge. Brug branchen til at gøre det let at svare på. Nævner de et område, så bekræft omfanget i én sætning. Er de i tvivl, så foreslå to til tre områder ud fra smerten og branchen, og nævn at hele flowet fra opgave til faktura typisk står stærkest. Tilskuddet betaler en analyse, så hold det på analysens niveau, og spørg aldrig "hvor i flowet går tiden" eller "hvor opstår fejlene". Det er analysens opgave.
5. effekt: hvad det ville betyde for dem, hvis det blev løst. Størrelsesorden er nok, fx en eftermiddag om ugen eller en halv stilling, flere kunder uden at ansætte, hurtigere betaling.
6. forankring, i tre separate ture: først hvem hos dem der ville drive projektet (ansøgningen vil have én fra ledelsen og én medarbejder). Derefter om de har gennemført et digitalt projekt før, fx et nyt økonomisystem. Derefter om de bruger kunstig intelligens i dag. Notér forankring, så snart du kender svarene. Nævn som en sætning uden spørgsmål, at ansøgningen også spørger til penge til at gennemføre anbefalingerne bagefter.
7. Afslut: opsummer projektet i to til tre korte sætninger: område, smerte og effekt. Sig at vurderingen og projektbeskrivelsen kommer frem på skærmen om et øjeblik og bliver sendt til deres mail. Nævn én gang og uden salgstryk, at Michael fra ${NAVN} er godkendt rådgiver og kan være én af dem, de indhenter tilbud fra, og at puljen kræver, at de sammenligner flere. Slut med ordet "farvel", og kald end_call i samme tur.

Kan de ikke svare på noget, så tag deres bedste skøn, notér status usikker og gå videre. Vil de stoppe undervejs, så respektér det: sig at det, I nåede, kommer frem på skærmen og i deres mail, slut med "farvel" og kald end_call.
Afslutning: har brugeren allerede sagt farvel, så svar kort med "Farvel" og kald end_call. Aldrig end_call i en tom tur, og aldrig en sætning om at du afslutter.`;

export const FIRST_MESSAGE = `{{hilsen}}, og tak fordi du tager dig tid. Jeg er ${NAVN}s digitale assistent, og jeg er en kunstig intelligens. Jeg guider dig gennem en kort afklaring af, om SMV Digitals tilskud er en mulighed for {{virksomhed_navn}}. Det tager fem til ti minutter, og på skærmen kan du følge med i, hvad vi har afklaret. Hvad fik jer til at kigge på det her lige nu?`;

/** Udtale-ordbog (backstop hvis modellen alligevel skriver "AI" eller "SpAIke"); sættes af sync. */
export const UDTALE_REGLER = [
  { type: "alias", string_to_replace: "AI", alias: "kunstig intelligens" },
  { type: "alias", string_to_replace: "SpAIke", alias: "Spajk" },
];

export function voiceAgentKonfig(udtale?: { pronunciation_dictionary_id: string; version_id: string }): AgentKonfig {
  return {
    name: "Tilskudstjek: stemme-coach (spaike.dk/tilskud)",
    tags: ["spaike", "tilskud", "voice-agent", "da"],
    conversation_config: {
      agent: {
        language: "da",
        first_message: FIRST_MESSAGE,
        dynamic_variables: {
          dynamic_variable_placeholders: {
            virksomhed_navn: "jer",
            navn: "brugeren",
            hilsen: "Hej",
            cvr_kontekst: "Intet CVR-opslag. Spørg selv, hvad virksomheden laver.",
            allerede_afklaret: "intet endnu",
            i_dag: "den første november totusind og seksogtyve",
            puljer: "Ingen pulje-data.",
          },
        },
        prompt: {
          prompt: VOICE_PROMPT,
          llm: process.env.TILSKUD_VOICE_LLM || "claude-sonnet-4-6", // A/B 2026-11-01: 10/10 noteringer, 0 ros (Haiku 4.5 og Gemini Flash glemte punkter)
          temperature: 0.5,
          max_tokens: 300,
          tools: [
            {
              type: "client",
              name: NOTER_TOOL,
              description: "Afkryds et punkt på brugerens tjekliste, så snart det er afklaret i samtalen.",
              expects_response: false,
              response_timeout_secs: 5,
              parameters: {
                type: "object",
                required: ["punkt", "status", "note"],
                properties: {
                  punkt: { type: "string", enum: PUNKT_IDER, description: "Hvilket punkt på tjeklisten" },
                  status: { type: "string", enum: ["ok", "nej", "usikker"], description: "ok = kravet er opfyldt eller svaret er klart, nej = stopper, usikker = skal afklares" },
                  note: { type: "string", description: "Højst ti ord med brugerens egne ord og tal" },
                },
              },
            },
            {
              type: "client",
              name: FORELOEBIG_TOOL,
              description: "Vis den foreløbige vurdering på skærmen, når alle kvalificeringspunkter er afklaret.",
              expects_response: false,
              response_timeout_secs: 5,
              parameters: {
                type: "object",
                required: ["status", "tekst"],
                properties: {
                  status: { type: "string", enum: ["groen", "gul", "roed"], description: "groen = kan søge, gul = med forbehold, roed = ikke som det ser ud nu" },
                  tekst: { type: "string", description: "Én sætning om vurderingen" },
                },
              },
            },
            { type: "system", name: "end_call", description: "", params: { system_tool_type: "end_call" } },
          ],
        },
      },
      tts: {
        // SpAIkes standard (som StockRate, PA, Hermes og Kode-assistent, aflæst 2026-11-02):
        // "Mathias - Storyteller", eleven_v3_conversational, 0.5 / 0.85 / 0.95.
        model_id: process.env.TILSKUD_VOICE_TTS_MODEL || "eleven_v3_conversational",
        voice_id: process.env.TILSKUD_VOICE_STEMME || "ygiXC2Oa1BiHksD3WkJZ",
        stability: 0.5,
        similarity_boost: 0.85,
        speed: 0.95,
        text_normalisation_type: "system_prompt",
        ...(udtale ? { pronunciation_dictionary_locators: [udtale] } : {}),
      },
      turn: {
        turn_timeout: 15,
        turn_eagerness: "patient",
        speculative_turn: false,
        soft_timeout_config: {
          timeout_seconds: 3,
          message: "Mm, lige et øjeblik.",
        },
      },
      asr: { provider: "scribe_realtime", quality: "high", user_input_audio_format: "pcm_16000" },
      conversation: { max_duration_seconds: 900 },
    },
    platform_settings: {
      // Privat agent: kun vores server kan udstede samtale-tokens (efter session-token + rate-limit).
      auth: { enable_auth: true },
      // Omkostningsvagt, fail-closed: højst 50 samtaler pr. døgn og 5 samtidige.
      call_limits: { agent_concurrency_limit: 5, daily_limit: 50 },
      // Privatliv: ingen lydoptagelse, udskriften slettes hos ElevenLabs efter 30 dage (står i privatlivspolitikken).
      privacy: { record_voice: false, retention_days: 30 },
    },
  };
}

function datoSomOrd(d: Date): string {
  return d.toLocaleDateString("da-DK", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Copenhagen" });
}

/** CVR-kontekst skrevet til tale (ingen ISO-datoer, branchekoder eller cifre). */
function cvrSomTale(v: Virksomhed): string {
  const t = forhaandstjek(v);
  const linjer = [
    `Navn: ${v.navn}.`,
    v.branche ? `Branche: ${v.branche}.` : null,
    v.selskabsform ? `Selskabsform: ${v.selskabsform}.` : null,
    v.by ? `By: ${v.by}.` : null,
    t.alderAar !== null ? `Virksomheden er cirka ${t.alderAar} år gammel.` : null,
    `Antal ansatte i CVR: ${v.ansatteInterval ? `${v.ansatteInterval.replace("-", " til ")}` : "ikke oplyst, så spørg"}.`,
    t.bemaerkninger.length ? t.bemaerkninger.join(" ") : null,
  ].filter(Boolean);
  return tilTaleDansk(linjer.join(" "));
}

/** Dynamiske variabler pr. samtale, bygget server-side fra CVR-opslaget og startformularen. */
export function dynamiskeVariabler(v: Virksomhed | null, navn?: string): Record<string, string> {
  const t = v ? forhaandstjek(v) : null;
  const fornavn = (navn ?? "").trim().split(/\s+/)[0]?.slice(0, 40) ?? "";
  return {
    virksomhed_navn: v?.navn || "jer",
    navn: fornavn || "brugeren",
    hilsen: fornavn ? `Hej ${fornavn}` : "Hej",
    cvr_kontekst: v ? cvrSomTale(v).slice(0, 2000) : "Intet CVR-opslag. Spørg selv, hvad virksomheden laver.",
    allerede_afklaret: tilTaleDansk(afklaretSomTekst(afklaretFraCvr(v, t))),
    i_dag: tilTaleDansk(datoSomOrd(new Date())),
    puljer: tilTaleDansk(puljerSomTekst()),
  };
}
