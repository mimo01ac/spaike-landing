# AI-innovationsdag — discovery-tool

Conversational discovery-tool + landing page på `/ai-innovationsdag`. Hjælper en
virksomhed med at finde 1-3 konkrete cases til en en-dags AI-innovationsdag og
outputter en struktureret case-brief. Lead-gen-motor: ansøgere ankommer med et
defineret problem.

> Kundevendt navn er ALTID "AI-innovationsdag", aldrig "hackathon".
> `/hackathon` redirecter til `/ai-innovationsdag`.

## Arkitektur

```
Gate (navn+mail+samtykke+Turnstile)
  -> /api/innovationsdag/gate     udsteder signeret session-token, opretter lead
Chat (streaming)
  -> /api/innovationsdag/chat     Claude Haiku 4.5, NDJSON-stream, brief som tool-kald
Brief vist -> /api/innovationsdag/session   persisterer transcript + case_brief
To veje:
  - Gør det selv (DIY-playbook, TODO-link)  -> session path_chosen=diy
  - Søg om pilot                            -> /api/innovationsdag/apply (+ brief vedhæftet)
```

- **Model:** `claude-haiku-4-5` (server-side, streaming, prompt caching). Skift i
  `_config/agent.ts`.
- **Brief:** Claude kalder tool'et `submit_case_brief` -> garanteret valid JSON i
  schemaet (ikke "parse JSON ud af tekst").
- **Storage:** eksisterende PocketBase `spaike-crm` (Fly.io, EU). Collections
  `discovery_sessions` + `applications` (alle rules låst til superuser).
- **Eksport:** print-stylesheet (`@media print` i `globals.css`, klasse
  `.brief-print`). Ingen html2canvas/jsPDF — undgår oklch-crash.

## Filer

- `_config/agent.ts` — system-prompt + brief-schema + model/grænser (rediger her).
- `_components/` — `DiscoveryTool` (orkestrator), `Gate`, `Chat`, `CaseBrief`,
  `ApplicationForm`.
- `_types.ts` — delte typer.
- `app/api/innovationsdag/{gate,chat,session,apply}/route.ts` — server-routes.
- `lib/{turnstile,sessionToken,rateLimit,pocketbase}.ts` — sikkerhed + storage.
- `scripts/setup-pocketbase.mjs` — idempotent collection-setup.

## Sikkerhed / cost

- Gate udsteder HMAC-signeret session-token (1t TTL); chat kræver gyldigt token.
- Tur-loft (`MAX_TURNS`) + payload-størrelses-guard i chat-routen (stateless,
  serverless-sikkert).
- Cloudflare Turnstile på gaten (rigtig bot-beskyttelse; mail-feltet er lead-gen).
- Best-effort per-IP rate-limit (in-memory; skift til Vercel KV for hård,
  distribueret grænse).
- Sæt et **spend-limit** på Anthropic-nøglen i Console.

## Kør lokalt

```bash
cp .env.example .env.local   # udfyld værdierne (se nedenfor)
node --env-file=.env.local scripts/setup-pocketbase.mjs   # idempotent — opretter collections
npm run dev
# -> http://localhost:3000/ai-innovationsdag
```

Env vars (alle server-side undtagen `NEXT_PUBLIC_TURNSTILE_SITE_KEY`):
`ANTHROPIC_API_KEY`, `POCKETBASE_URL`, `POCKETBASE_ADMIN_EMAIL`,
`POCKETBASE_ADMIN_PASSWORD`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`,
`TURNSTILE_SECRET_KEY`, `APP_SESSION_SECRET`.

## Deploy (Vercel)

Sæt alle env vars i Vercel-projektet (Production + Preview). Commit + push til
feature-branch -> Vercel laver preview automatisk. Deploy ALDRIG til production
automatisk; det er Michaels beslutning.

## TODO før go-live

- [ ] DIY-playbook-link i `_components/DiscoveryTool.tsx` (`DIY_PLAYBOOK_URL`).
- [ ] Cloudflare Turnstile-widget (site-key + secret) -> env.
- [ ] Alle env vars i Vercel.
- [ ] Link siden i nav når soft-launch er slut (pt. kun direkte URL).
```
