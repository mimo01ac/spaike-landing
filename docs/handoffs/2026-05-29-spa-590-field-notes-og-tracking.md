# Handoff — 2026-05-29 — SPA-590 Field Notes, OG-fixes, Umami tracking

**Branch:** `feature/SPA-590-field-notes-anthropic-playbook` (synced med `origin/main` @ `1d165d7`)
**Repo:** spaike-landing (spaike.dk) · Next.js 14 App Router + Tailwind · Vercel auto-deploy fra main

---

## 1. Løst i denne tråd

### spaike.dk landing-tweaks (alle live på production)
- ✅ Senior brand strategist review — CEO pain-statements, "I rapporten finder I", hero CTA-hierarki, Cases Før/Efter-framing, Manifest 5→3-kolonne
- ✅ Hero-headline → **"Commercial impact, drevet af AI."** ("AI" i wordmark-format: amber, sans bold)
- ✅ Strategisk-alignment reframe af al copy (effektivitet → strategisk acceleration), em-dash sweep
- ✅ Diverse copy-fixes: "alignere"→"aligne", "mimoco ApS"→"SpAIke ApS", "AI-byggeri"→"AI-implementering", founder-credentials "15+ år kommerciel erfaring", LinkedIn-handle, target-audience "kommercielle ledere i mid-market"
- ✅ Editorial chrome trimmet — pagers fjernet, section-labels simplificeret, double-rule → single
- ✅ Soft-launch — Cases + DiscoveryCTA + Waitlist skjult; "Book møde"-CTA wired til Calendly (`calendly.com/michael-spaike/new-meeting`); BETA-referencer fjernet
- ✅ Favicon (app/icon.svg + apple-icon.png), 2 AI-watermarks fjernet fra portræt-billeder (på Desktop)

### SPA-590 — Field Notes № 01 (Anthropic sales playbook)
- ✅ Standalone HTML portet til Next.js dynamic route `/field-notes/[slug]`, renderet på `/field-notes/anthropic-sales-playbook`
- ✅ Article registry (`app/field-notes/_articles/index.ts`) — skalérer til flere posts
- ✅ `<StarterPrompt>` client component med copy-to-clipboard + fallback
- ✅ 3 SVG-illustrationer som React-komponenter
- ✅ OG metadata + image (1200×630) til LinkedIn
- 🟡 Lighthouse SEO/A11y ≥ 95 — IKKE kørt (eneste uafklarede acceptance criterion)

### Umami analytics (self-hosted)
- ✅ Umami v2 på Fly.io (`spaike-analytics`, ams) + Fly Postgres (`spaike-analytics-db`), ~$2-4/md
- ✅ Custom domain `analytics.spaike.dk` (DNS via Cloudflare API, TLS issued)
- ✅ Tracker wired på spaike.dk + custom events: book_moede_click, email_click, linkedin_click, scroll_depth, starter_prompt_copy, field_note_source_click, field_note_closer_more_click
- ✅ OG canonical-fix (www.spaike.dk) så LinkedIn-crawler får direct HTTP 200

---

## 2. Udestående TODOs

- 🟡 **Lighthouse SEO/A11y ≥ 95 på field note** — acceptance criterion ikke formelt verificeret. Siden er statisk m. semantisk HTML + alt-tekst, passerer nok, men ikke målt. Kør via Chrome DevTools eller `npx lighthouse <url>`.
- 🟡 **SPA-590 Linear-status** — afventer Michaels beslutning om Done.
- 🟡 **Cloudflare API-token** — brugt til DNS, bør revokes på https://dash.cloudflare.com/profile/api-tokens hvis ikke allerede gjort.
- 🟡 **Umami admin username** — stadig "admin"; kan ændres til "michael" under Settings → Users (husk opdater .env.local).
- 🟢 **Cases/Discovery/Waitlist re-enable** — skjult under soft-launch, komponenter bevaret i kodebasen. Re-aktivér i page.tsx + Header.tsx + Footer.tsx når klar.

---

## 3. Vigtige referencer

- **Umami dashboard:** https://analytics.spaike.dk/login (admin + password i `~/Dev/spaike-analytics/.env.local`)
- **Analytics infra-repo:** `~/Dev/spaike-analytics/` (fly.toml, README, .env.local — gitignored)
- **Live field note:** https://www.spaike.dk/field-notes/anthropic-sales-playbook
- **PR SPA-590:** github.com/mimo01ac/spaike-landing → feature/SPA-590-field-notes-anthropic-playbook

---

## 4. Handoff-prompt til næste tråd

```
Jeg fortsætter på spaike.dk (repo spaike-landing). Sidste tråd wrapped up 2026-05-29
— se docs/handoffs/2026-05-29-spa-590-field-notes-og-tracking.md.

Næste skridt: kør Lighthouse på /field-notes/anthropic-sales-playbook og bekræft
SEO + A11y ≥ 95 (sidste SPA-590 acceptance criterion). Derefter kan SPA-590 lukkes.

Læs først:
- docs/handoffs/2026-05-29-spa-590-field-notes-og-tracking.md
- Linear SPA-590
- alt er på main + feature/SPA-590-field-notes-anthropic-playbook (synced)
```
