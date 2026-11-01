# DEFERRED — bevidste fravalg (append-only)

Format: hvad blev fravalgt · hvorfor · det rigtige · effort (S/M/L).

## 2026-08-30 · AI-tjek (/ai-tjek) v1

- Automatisk AI-panel-kørsel (Perplexity/Claude web search + mail-token-flow + Brevo-rapportmail) · fart: v1 shipper uden nye betalte API-afhængigheder; leads notificeres til Michael og panelet køres manuelt med den eksisterende ai-visibility-motor · det rigtige: async kø m. mail-verifikation før LLM-kald, jf. build-skitsen i vaultens lead-magnet-dom · effort M
- CWV-tjek via PageSpeed Insights-API · fart: tilføjer 10-20 sek. latenstid + API-nøgle; instant-oplevelsen prioriteret · det rigtige: async CWV-berigelse af rapporten · effort S
- Fuld E2E af scan→rapport mod rigtig PocketBase · scope: E2E mocker scan-API'et; motoren dækkes af CLI-harness (scripts/ai-tjek-cli.mjs) + manuel verifikation · det rigtige: test-PB-instans eller PB-mock i webServer · effort M
- Globalt dagsloft er in-memory pr. serverless-instans (best effort) · fart: rigeligt ved lav trafik, og scan-trinnet er gratis (ingen LLM) · det rigtige: delt tæller i PocketBase/KV · effort S
- Dynamisk OG-billede pr. rapport ("sell the screenshot") · fart · det rigtige: @vercel/og med score-kort · effort S

## 2026-11-01 · Tilskudstjek (/tilskud) v1

- Puljealarm er kun et flag (`pulje_alarm`) på leadet; der sendes ingen automatisk påmindelse · fart: november-vinduet er om 8 dage, Michael sender manuelt fra PB-listen · det rigtige: cron/Brevo-liste der mailer tilmeldte X dage før `aabner` og når ansøgningssystemet åbner · effort S. **Tænd senest: 2027-02-15** (før cyber-puljen 1/3-2027); reminder lægges i kalenderen.
- Samtale persisteres ikke i localStorage (reload = forfra) · fart · det rigtige: samme mønster som ai-innovationsdag (restoredMessages) · effort S
- Vurderingen vises fuldt på skærmen undtagen ansøgningsudkastet (mail-gate); ingen delbar rapport-URL · fart/scope · det rigtige: gem vurdering i PB ved tool-kald og giv `/tilskud/rapport/[id]` som ai-tjek · effort M
- CVR-data verificeres ikke mod årsregnskab (kun alder som proxy for "mindst ét aflagt regnskab") · fart: cvrapi.dk har ikke regnskabsdata · det rigtige: CVR/Virk regnskabsopslag eller spørg eksplicit (agenten spørger når proxyen er usikker) · effort M
- Ingen Turnstile i prod (nøgler mangler i Vercel) · scope: samme tilstand som de øvrige routes; beskyttelse = session-token + tur-loft + IP-rate-limit (in-memory pr. instans) · det rigtige: Turnstile-nøgler + delt rate-limit · effort S. **Sikkerhedsnet: tjek Anthropic-forbrug ugentligt indtil 2026-12-01; tænd Turnstile ved tegn på misbrug.**
- E2E dækker kun at siden renderer (PUBLIC_PAGES); chat/lead mod rigtig Claude/PB dækkes af CLI-harness (`scripts/tilskud-cli.mjs flow`) · fart · det rigtige: Playwright-spec med mocket /api/tilskud · effort S
- Model er `claude-opus-5-5` med lav effort uden målt kvalitets-/kost-sammenligning mod Sonnet/Haiku · fart · det rigtige: 20 fixture-samtaler scoret på egnetheds-korrekthed + pris pr. samtale · effort M
- Markedsafdækning af rådgivere (sammenligning af 2-3 rådgivere fra databasen) er kun et punkt i "næste skridt", ikke en leverance · scope v1 · det rigtige: hent rådgivere fra ehmidt.dk-databasen efter kompetence og generér sammenligningsark · effort M
- CVR-data kan i fallback-stien komme fra klienten (browser-opslag hos cvrapi.dk, serveren validerer kun CVR-match og typer) · fart: Vercels IP er kvote-blokeret hos cvrapi.dk · LØST samme dag: Erhvervsstyrelsens CVR-ES er nu primær kilde (server-hentet); klient-fallback består kun hvis ES er nede/ukonfigureret · effort gjort
- Navnesøgningen filtrerer på `sammensatStatus = NORMAL` og viser kun 8 hits uden paginering eller geo-/branche-filter · fart · det rigtige: "vis flere", filter på postnummer, og visning af binavn når det var binavnet der matchede · effort S
- CLI-harnessen tester ikke browser-fallbacket (den rammer serverens opslag, som virker lokalt) · fart · det rigtige: `--cvr-fallback` flag der sender et cvrapi-svar med, eller Playwright-spec mod preview · effort S

## 2026-11-01 · Tilskudstjek voice-tilstand v1

- Talegenkendelse via browserens Web Speech API (da-DK; Google-baseret i Chrome, svag/ingen støtte i Firefox og dele af Safari) · fart: Michael skal teste i morgen · det rigtige: server-side STT (ElevenLabs Scribe eller Deepgram Nova-3) eller en rigtig realtidsagent (ElevenLabs Agents / Pipecat, jf. vault "Spotless dansk voice-agent") · effort M
- Ingen barge-in (brugeren kan ikke tale oven i agenten; "Tal"-knappen afbryder) og ingen mikrofon-måler/enhedsvælger (vault-mønsteret) · fart · det rigtige: VAD + afbrydelse, mic-check før start · effort S-M
- Tur-latens = Claude-svar (3-8 s) + TTS af hele svaret før afspilning · fart · det rigtige: sætningsvis TTS-streaming mens teksten streamer · effort M
- Stemme = "Michael Stemme" (professionel klon af Michaels stemme, da) sat i env `TILSKUD_TTS_VOICE`; ikke øre-testet af native lyttere endnu · beslutning: Michael vurderer i morgen; alternativ "Mads SpAIke" (BIWC0507fYMfhPcAEIRP) · effort XS (kun env)
- TTS-kald er ikke cost-cappet ud over rate-limit pr. IP (80/5 min) · fart · det rigtige: dagligt tegn-loft pr. session + global breaker · effort S. **Tjek ElevenLabs-forbrug sammen med Anthropic-forbruget ugentligt til 2026-12-01.**

## 2026-11-01 · Tilskudstjek stemme v2 (ElevenLabs Agents) + sessioner

- v1 (Web Speech + oplæsning af chatten) er erstattet helt; punkterne i afsnittet ovenfor er dermed lukket undtagen stemmevalget.
- Agentens LLM er Claude Sonnet 4.6 (A/B 2026-11-01 i simulation: 10/10 noteringer mod 9/10 for gpt-4o og ustabile Haiku 4.5/Gemini Flash), men svartiden er ikke målt i en rigtig samtale · fart · det rigtige: mål tid-til-første-lyd i ElevenLabs-dashboardet efter Michaels test, skift til gpt-4o via `TILSKUD_VOICE_LLM` + sync hvis den føles træg · effort XS
- Stemmen er "Michael Stemme" (pro-klon) på eleven_flash_v2_5; "Spajk" er skrevet fonetisk i prompten i stedet for en udtale-ordbog · fart · det rigtige: øre-test, evt. alias-ordbog for "SpAIke" og "SMV Digital" · effort S
- Omkostningsvagt: agentens `call_limits.daily_limit` = 50 samtaler/døgn og 5 samtidige (fail-closed hos ElevenLabs) + rate-limit 5 starter/10 min pr. IP. Ingen beløbsloft · det rigtige: månedligt forbrugsloft i ElevenLabs-kontoen · effort XS (Michael, dashboard)
- Tjeklisten afhænger af, at agenten kalder `noter_afklaring`; der er ingen server-side kontrol undervejs · det rigtige: hvis rigtige samtaler viser huller, så en let Haiku-opsummering af udskriften efter hver brugertur som fallback · effort M
- `voice-resultat` kører Claude Opus 5.5 synkront (ca. 20-45 s) inden for Vercels 60 s · fart · det rigtige: streame eller køre i baggrunden med polling, hvis vurderingen bliver langsommere · effort M
- Sessioner gemmes for alle (Michael-beslutning); ingen automatisk sletning af gamle `tilskud_sessioner` · det rigtige: slet sessioner uden lead efter fx 12 måneder (cron eller PB-hook) · effort S
