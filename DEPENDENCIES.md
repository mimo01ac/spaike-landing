# DEPENDENCIES — eksterne afhængigheder og adgange

Format: hvad · ejer · lead-time · "sæt i gang senest" · status (ikke-startet / afventer-3.-part / klar + testtidspunkt).

## /tilskud (Tilskudstjek, v1 2026-11-01)

- **SMV:Digital godkendt-rådgiver-status** · Michael · n/a · klar (bekræftet af Michael 2026-11-01; CV skal opdateres hver 6. måned i rådgiverdatabasen, næste tjek senest 2027-05-01).
- **CVR-opslag via cvrapi.dk** · SpAIke · ingen (åbent API) · **delvist klar**: lokalt `HTTP 200 @ 2026-11-01 10:30 UTC`, men fra Vercel `HTTP 403 QUOTA_EXCEEDED @ 2026-11-01 11:25 UTC` (gratis-kvoten er pr. IP og Vercels delte egress-IP'er er opbrugt af andre). Løst i v1 med browser-fallback (CORS, kvote følger den besøgendes IP; verificeret `200 @ 11:35 UTC` fra preview-siden). Det rigtige på sigt: cvrapi.dk betalt plan m. token (Michael skal oprette; pris ukendt) ELLER Erhvervsstyrelsens CVR-adgang (Virk/Elasticsearch, ansøgning med ukendt lead-time). Virks datacvr-gateway er bag Cloudflare-challenge og dur ikke. Sæt i gang senest: 2027-01-15 (før marts-puljen), eller straks hvis browser-fallbacket fejler for besøgende (ses som "Intet CVR-opslag" i Umami-event `tilskud_start` med `cvr_fundet=nej`).
- **Anthropic API-nøgle** (Vercel env `ANTHROPIC_API_KEY`) · SpAIke · n/a · klar (delt med ai-innovationsdag). Model `claude-opus-5-5`; verificeret live via `scripts/tilskud-cli.mjs flow` (se CLAUDE.md "Fejlsøgning").
- **PocketBase-collection `tilskud_leads`** (spaike-crm på Fly) · SpAIke · minutter · klar via `node --env-file=.env.local scripts/setup-pocketbase.mjs` (idempotent).
- **Brevo transactional mail** (`BREVO_API_KEY`, `EMAIL_FROM_ADDRESS`) · SpAIke · n/a · klar (delt). Fail-soft: lead gemmes selvom mail fejler.
- **Cloudflare Turnstile** · SpAIke · timer · ikke-startet: nøgler er IKKE sat i Vercel production (gaten springer bot-tjek over, som de øvrige routes). Sæt i gang hvis chat-misbrug/omkostning ses i Anthropic-forbruget.
- **Puljedatoer (SMV:Digital/Virksomhedsguiden)** · ekstern, manuel vedligehold · n/a · `lib/tilskud/puljer.ts` opdateres ved hver ny pulje-annoncering (næste kendte: cyber-pulje 1. marts 2027, lukkedato mangler).
