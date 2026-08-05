import type { Metadata } from "next";
import StarterPrompt from "../../components/field-notes/StarterPrompt";
import DailyPrep from "../../components/field-notes/illustrations/DailyPrep";
import WeeklyForecast from "../../components/field-notes/illustrations/WeeklyForecast";
import AccountScoring from "../../components/field-notes/illustrations/AccountScoring";

export const metadata: Metadata = {
  title:
    "Field Notes: How Anthropic's own sales leader runs his week — SpAIke",
  description:
    "Three plays from Anthropic's Head of Mid-Market GTM — and the paste-ready Claude Skill prompts to run them in a sales team without a dedicated sales ops function.",
  openGraph: {
    title:
      "The Anthropic sales playbook — translated for a sales team without sales ops",
    description:
      "Three plays from Travis Bryant's 4,000-account week. With paste-ready Claude Skill prompts to run each in an SMB stack like SuperOffice, Lime, or HubSpot — without a sales ops function in the middle.",
    type: "article",
    locale: "en_US",
    url: "https://www.spaike.dk/field-notes/anthropic-sales-playbook",
    images: [
      {
        url: "/og/anthropic-sales-playbook.png",
        width: 1200,
        height: 630,
        alt: "The Anthropic sales playbook — translated for a sales team without sales ops",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "The Anthropic sales playbook — translated for a sales team without sales ops",
    description:
      "Three plays from Travis Bryant's 4,000-account week. Paste-ready Claude Skill prompts included.",
    images: ["/og/anthropic-sales-playbook.png"],
  },
};

const DAILY_PREP = `You are my Daily Prep skill. Every weekday at 06:00, generate a one-page briefing for me before I open my laptop.

Run this in order:

1. SCAN MY CALENDAR for today. Drop internal meetings, time blocks, and personal events. Keep only external customer or prospect meetings.

2. FOR EACH MEETING, build a brief in this exact format:
   MEETING: [customer + time]
   ATTENDEES: [name · title · role · my team on the call]
   STAGE: [new logo / expansion / renewal / churn risk]
   LAST TOUCH: [date + one-line summary from CRM activity or recent email]
   THE NUMBERS: [open opps with amount + close date; renewal date if relevant; usage signal if available]
   THE STORY SO FAR: [3 sentences — what they bought, why, what's happened since]
   THEIR LIKELY GOAL: [your best guess based on stage + last touch + recent activity]
   MY ONE OBJECTIVE: [the single outcome I should walk out with]
   TWO QUESTIONS TO ASK: [specific to this account — not generic]
   ONE RISK TO WATCH: [realistic objection or red flag based on stage + recent data]

3. SCORE MY BOOK. For each of my top 20 accounts (whether or not I have a meeting today), assign red / yellow / green and one line of why. Red = a deadline this week or a clear churn signal. Yellow = silent more than 14 days or a flag from recent activity. Green = healthy or recently progressed.

4. DELIVER. Post the briefs and the book scorecard to [Slack channel / shared doc / email].

Be specific. No generic language. Every brief should pass this test: would this make sense to anyone WITHOUT access to my real CRM data? If yes, rebuild it with real signal.`;

const WEEKLY_FORECAST = `You are my Weekly Forecast skill. Every Friday at 08:00, build a one-page forecast report for the leadership call on Monday.

Run this in order:

1. PULL the source data:
   - All open opportunities from the CRM, with stage, amount, close date, forecast category
   - Each rep's submitted commit / most likely / best case (from the forecast tab or our submission doc)
   - Any product usage / activity signal we track
   - Notes from this week's call logs and any deal-review doc

2. ASSEMBLE the report in this exact format (replace with your leadership's preferred shape):
   ═══════════════════════════════════════
   WEEK OF [date]
   ═══════════════════════════════════════
   TOP-LINE
   · Commit: $X (Δ vs last week)
   · Most likely: $X (Δ)
   · Best case: $X (Δ)
   · Gap to quarter target: $X

   TOP 5 DEALS
   [for each: account · amount · close date · stage · one-line where it stands · risk]

   MOVERS THIS WEEK
   · Pulled up: [accounts moving closer]
   · Slipping: [accounts moving out — with reason]
   · New: [opps added this week]

   FORECAST BY REP
   [table: rep · commit · most likely · best case · vs last week]

   THREE THINGS LEADERSHIP SHOULD KNOW
   [the three signals that matter most this week — not everything that changed]

3. DELIVER. Save to [shared doc URL]. Post the shared link to [Slack channel] with a one-line summary.

Be specific. Use real account names and real numbers. If data is missing or stale, flag it clearly rather than guessing.`;

const ACCOUNT_SCORING = `You are my Account Propensity Score skill. Score every account in my CRM on a 0–50 scale across five dimensions. Produce a numerical score AND a 2-sentence rationale per dimension, plus an overall written summary per account.

Dimensions (0–10 each, adapt to my ICP):

1. ICP FIT — Do they look like our top 20 customers on size, industry, stack, and use case? Use my list of top customers as the anchor.

2. BUYING SIGNAL — Recent activity suggesting they're in market: content engagement, webinar attendance, hires in target roles, market expansion, recent funding, leadership change at the buyer level.

3. RELATIONSHIP STAGE — Cold prospect (0–3) · warm or known contact (4–6) · past customer (7–8) · current customer with expansion potential (9–10) · at risk renewal needs the points too if relevant.

4. ACCOUNT MOMENTUM — Funding round in last 12 months, product launch, leadership change, public news mention, hiring spree. Anything signaling motion right now.

5. REACHABILITY — Do we have a champion, a warm intro path, or a recent touch? Or are we cold with no obvious door?

For each account:
- score per dimension with the 2-sentence why
- total score out of 50
- a 3-sentence summary: who they are, why they're rated where they are, what the first move should be

Run on the full account list. Surface flat dimensions where the data is thin — don't bluff. When you're done, build me an interactive dashboard:
- one section per rep
- their top 20 accounts ranked
- click an account to see the dimension breakdown and the suggested first move

I'll review the rubric weights after the first sample territory and tell you which dimensions to bring up or down.`;

export default function AnthropicSalesPlaybook() {
  return (
    <article className="max-w-3xl mx-auto px-[22px] pt-10 pb-16 md:px-8 md:pt-16 md:pb-24 text-[17px] leading-[1.6] text-ink">
      {/* DATELINE */}
      <div className="flex justify-between items-center pb-3.5 mb-8 border-b border-rule font-mono text-[11px] font-medium tracking-wider uppercase text-muted">
        <span className="text-ink">
          SpAIke / Field Notes / №&nbsp;01
        </span>
        <span className="text-amber-dark">5&nbsp;min read</span>
      </div>

      {/* HEADLINE */}
      <h1 className="font-serif font-semibold text-[36px] md:text-[54px] leading-[1.08] tracking-tight text-ink mb-6">
        The Anthropic sales playbook —{" "}
        <em className="italic font-medium text-amber-dark">
          translated for a sales team without sales ops
        </em>
      </h1>

      {/* DECK */}
      <p className="font-serif text-[22px] italic leading-[1.45] text-ink-soft mb-8 max-w-[620px]">
        Anthropic&apos;s Head of Mid-Market GTM runs a 4,000-account book with three
        Claude Cowork routines. None of them require a data warehouse — or a sales
        ops function sitting between the reps and the data. Here&apos;s what to
        steal, and the paste-ready prompts to start.
      </p>

      {/* BYLINE */}
      <div className="flex flex-col gap-1.5 font-mono text-[12px] tracking-wider text-muted border-t border-b border-rule py-3.5 mb-12">
        <span>Notes on Travis Bryant&apos;s playbook · Anthropic · May 2026</span>
        <span>Sources: Claude blog post · 58-min on-demand webcast with Brittney Tong</span>
        <span>
          Curated and translated for SMB sales orgs by{" "}
          <a
            href="https://spaike.dk"
            className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
          >
            SpAIke
          </a>
        </span>
      </div>

      {/* LEDE */}
      <section className="lede">
        <p className="mb-[18px] first-letter:font-serif first-letter:text-[64px] first-letter:font-semibold first-letter:float-left first-letter:leading-[0.9] first-letter:mt-1 first-letter:mr-2 first-letter:-mb-1 first-letter:text-amber-dark">
          In May 2026 Travis Bryant — Anthropic&apos;s Head of US Mid-Market GTM — published a short blog post and ran an on-demand webcast walking through how he uses Claude Cowork to run a 4,000-account book. It&apos;s a generous session: real workflows, no hype, the actual scoring rubric included.
        </p>
        <p className="mb-[18px]">
          The reflex move is to read it and feel inspired. The harder move is to ask:{" "}
          <em className="italic">
            what here actually translates to a Danish industrial wholesaler with eight outside reps and 250 active accounts, where the sales manager spends 90 minutes every Thursday copy-pasting deal updates into the format the CEO actually reads?
          </em>
        </p>
        <p className="mb-[18px]">
          That&apos;s the bridge. Below are the three plays from Travis&apos;s week — daily, weekly, quarterly — each with what Anthropic does, the translation for a team running on SuperOffice, Lime, WebCRM, HubSpot or similar (without a sales ops function in the middle), and a paste-ready starter prompt you can save as a Claude Skill and run by end of next week. None of these require BigQuery.
        </p>
      </section>

      {/* TOC */}
      <nav className="border border-rule px-7 py-6 my-12">
        <div className="font-mono text-[10px] font-medium tracking-widest uppercase text-muted mb-3.5">
          In this issue
        </div>
        <ol className="list-none">
          {[
            { href: "#play1", text: "The morning briefing that runs before you wake up", cadence: "Daily" },
            { href: "#play2", text: "The Friday forecast in your leader's format", cadence: "Weekly" },
            { href: "#play3", text: "The overnight scoring of every account in the book", cadence: "Quarterly" },
          ].map((item, i) => (
            <li
              key={item.href}
              className={`flex items-baseline gap-3.5 py-2.5 font-serif text-[18px] font-medium ${
                i === 0 ? "" : "border-t border-dotted border-rule"
              }`}
            >
              <span className="font-mono text-[12px] text-amber-dark shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <a href={item.href} className="text-ink hover:text-amber-dark transition-colors">
                {item.text}
              </a>
              <span className="ml-auto font-mono text-[10px] font-normal tracking-wider uppercase text-muted">
                {item.cadence}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      {/* ============ PLAY 1 ============ */}
      <section className="my-16 scroll-mt-10" id="play1">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span className="inline-block bg-ink text-cream px-2.5 py-0.5 rounded-sm text-[10px]">01</span>
          <span>Daily prep</span>
          <span className="text-muted">· runs before 7am every weekday</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          The morning briefing that runs before you wake up
        </h2>

        <p className="mb-[18px]">
          Each morning, a scheduled Cowork skill pulls Travis&apos;s customer meetings from Google Calendar, his pipeline status from Salesforce, and his spend signal from BigQuery. By the time he opens his laptop, a per-meeting brief is already waiting: attendees, deal stage, last touch, spend to date, two questions to ask, one risk to watch. His teammate Brittney runs a parallel skill that grades every account in her book red, yellow, or green — &ldquo;Beacon is red because there&apos;s a Friday deadline they haven&apos;t committed to.&rdquo;
        </p>
        <p className="mb-[18px]">
          Travis&apos;s framing: the scheduler is the bigger unlock than the skill itself.{" "}
          <em className="italic">
            &ldquo;Once prep stops being a slash command I have to remember and starts running on its own, I stop forgetting it.&rdquo;
          </em>
        </p>

        <div className="bg-cream-deep border border-rule rounded px-6 py-8 my-8 overflow-hidden">
          <DailyPrep />
          <p className="font-mono text-[11px] tracking-wider uppercase text-muted text-center mt-3">
            Three feeds in · one structured digest out · before coffee
          </p>
        </div>

        <div className="border-l-[3px] border-amber px-5 py-4 my-7">
          <div className="font-mono text-[10px] font-medium tracking-widest uppercase text-amber-dark mb-2">
            Translation for a sales team without sales ops
          </div>
          <p className="text-[16px] mb-3">
            You don&apos;t have BigQuery — and you don&apos;t have a sales ops analyst pulling the data for the reps before each call. You have a CRM (SuperOffice, Lime, WebCRM, HubSpot — pick yours), an inbox, a calendar, and maybe an ERP or support tool. Same play. A scheduled skill reads the last 24 hours, scores the accounts that need attention, and writes the brief for each meeting on the calendar — before the rep opens their first tab.
          </p>
          <p className="text-[16px]">
            <strong>Where the time shows up:</strong> 30–45 minutes a day per rep, spent toggling between tools, becomes a 5-minute read.
          </p>
        </div>

        <StarterPrompt
          name="daily_prep"
          summary="Starter prompt · save as a Claude Skill"
          note={
            <>
              Save this in Cowork as a Skill called <strong>Daily Prep</strong>. Connect your CRM (SuperOffice, Lime, WebCRM, HubSpot, Pipedrive, Salesforce — whichever you run), your calendar, and your inbox. Schedule it for 06:00 weekdays. Customise the format to match what your reps actually read.
            </>
          }
          prompt={DAILY_PREP}
        />

        <blockquote className="font-serif italic text-[22px] leading-[1.4] text-ink my-7 pl-7 border-l-2 border-ink">
          Once prep stops being a slash command I have to remember and starts running on its own, I stop forgetting it.
          <cite className="block font-mono not-italic text-[11px] tracking-wider uppercase text-muted mt-3.5">
            — Travis Bryant, Anthropic
          </cite>
        </blockquote>
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ PLAY 2 ============ */}
      <section className="my-16 scroll-mt-10" id="play2">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span className="inline-block bg-ink text-cream px-2.5 py-0.5 rounded-sm text-[10px]">02</span>
          <span>Friday forecast</span>
          <span className="text-muted">· saves Travis ~3 hours a week</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          The Friday forecast in your leader&apos;s format
        </h2>

        <p className="mb-[18px]">
          Every Friday, a scheduled Cowork skill pulls opportunity records and commits from Salesforce, spend signal from BigQuery, and notes from a handful of internal docs. It assembles a single-page report in the exact layout Anthropic&apos;s sales leadership reads: top-line metrics, top deals, movers and decliners, forecast snapshot rolled up from each first-line manager. The report lands at a shared link before Monday&apos;s forecast call.
        </p>
        <p className="mb-[18px]">
          Travis&apos;s framing is the cleanest articulation of the entire AI-in-sales conversation: data assembly is the part Claude handles. Strategic interpretation is the part he still does.
        </p>

        <blockquote className="font-serif italic text-[22px] leading-[1.4] text-ink my-7 pl-7 border-l-2 border-ink">
          Claude builds the what; I do the why.
          <cite className="block font-mono not-italic text-[11px] tracking-wider uppercase text-muted mt-3.5">
            — Travis Bryant, Anthropic
          </cite>
        </blockquote>

        <div className="bg-cream-deep border border-rule rounded px-6 py-8 my-8 overflow-hidden">
          <WeeklyForecast />
          <p className="font-mono text-[11px] tracking-wider uppercase text-muted text-center mt-3">
            From &ldquo;everyone reads their number&rdquo; to a conversation about why
          </p>
        </div>

        <div className="border-l-[3px] border-amber px-5 py-4 my-7">
          <div className="font-mono text-[10px] font-medium tracking-widest uppercase text-amber-dark mb-2">
            Translation for a sales team without sales ops
          </div>
          <p className="text-[16px] mb-3">
            Travis has a forecast tab in Salesforce and BigQuery feeding leadership&apos;s preferred layout. You don&apos;t. Your forecast is probably an Excel sheet the sales manager updates by hand on Thursday afternoon. Or worse — a Teams thread where the reps paste numbers in. Either way, the format the CEO actually reads gets reassembled every single week, by hand.
          </p>
          <p className="text-[16px]">
            A weekly skill that reads the CRM, the latest call notes, and any order or pipeline signal you have, and writes the same sheet in the same shape, turns two hours of admin into ten minutes of review. The format stays. The grinding goes away.
          </p>
        </div>

        <StarterPrompt
          name="weekly_forecast"
          summary="Starter prompt · save as a Claude Skill"
          note={
            <>
              Save this in Cowork as a Skill called <strong>Weekly Forecast</strong>. Wire it to your CRM and your internal docs (Notion / Google Drive / Confluence). Schedule it for Friday 08:00. Replace the format block with whatever shape your leader actually reads — that&apos;s the entire point.
            </>
          }
          prompt={WEEKLY_FORECAST}
        />
      </section>

      <div className="mx-auto w-20 my-14 h-1 border-t border-b border-rule" />

      {/* ============ PLAY 3 ============ */}
      <section className="my-16 scroll-mt-10" id="play3">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          <span className="inline-block bg-ink text-cream px-2.5 py-0.5 rounded-sm text-[10px]">03</span>
          <span>Quarterly account scoring</span>
          <span className="text-muted">· 4,000 accounts in one night</span>
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          The overnight scoring of every account in the book
        </h2>

        <p className="mb-[18px]">
          This is the play Travis calls the unlock. Every fiscal year, every account in his book needs a score so each AE knows where to spend their time. At previous companies, this was hundreds of hours across RevOps, FP&amp;A, and marketing. He ran it in one night.
        </p>
        <p className="mb-[18px]">
          He defined a 5-dimension scoring rubric with Claude in conversation —{" "}
          <em className="italic">not</em> a top-down framework imposed on the model. The rubric: agent opportunity, internal transformation potential, AI commitment (measured via press releases, partnership announcements, and how many of their job postings mention AI), white space against existing spend, and industry fit. Cowork then ran overnight, scoring every account with deep web research, Salesforce data, and BigQuery context — producing a numerical score and a written rationale for every dimension. He then asked Cowork to build an interactive dashboard so each AE could click into their slice and see their top accounts ranked, with the reason for the rank.
        </p>

        <div className="bg-cream-deep border border-rule rounded px-6 py-8 my-8 overflow-hidden">
          <AccountScoring />
          <p className="font-mono text-[11px] tracking-wider uppercase text-muted text-center mt-3">
            4,000 accounts in · 20 priority targets per rep out · while you sleep
          </p>
        </div>

        <div className="border-l-[3px] border-amber px-5 py-4 my-7">
          <div className="font-mono text-[10px] font-medium tracking-widest uppercase text-amber-dark mb-2">
            Translation for a sales team without sales ops
          </div>
          <p className="text-[16px] mb-3">
            You don&apos;t have 4,000 accounts — and more to the point, you don&apos;t have a RevOps team to spend hundreds of hours scoring them. You have 600 dormant accounts in SuperOffice that no one has touched in 90 days, and a handful of reps who default to the same 40 contacts they already know how to sell to.
          </p>
          <p className="text-[16px]">
            The same overnight pattern works at SMB scale, and you can adapt the dimensions to what matters in your market. Run it once a quarter. Each rep walks into the quarter with a ranked top-20 instead of a hunch.
          </p>
        </div>

        <StarterPrompt
          name="account_scoring"
          summary="Starter scoring rubric · adapt for your market"
          note={
            <>
              Save this as a Skill called <strong>Account Propensity Score</strong>. Have the conversation with Cowork first to refine the dimensions for your actual ICP — Travis spent more time refining the rubric than running the score. Then point it at your full account list and let it run overnight.
            </>
          }
          prompt={ACCOUNT_SCORING}
        />

        <blockquote className="font-serif italic text-[22px] leading-[1.4] text-ink my-7 pl-7 border-l-2 border-ink">
          In previous companies, this kind of work ran for hundreds of hours across RevOps, FP&amp;A, and marketing. I did it in one night.
          <cite className="block font-mono not-italic text-[11px] tracking-wider uppercase text-muted mt-3.5">
            — Travis Bryant, Anthropic
          </cite>
        </blockquote>
      </section>

      {/* ============ BONUS ============ */}
      <div className="bg-cream-deep border-l-[3px] border-ink px-7 py-7 mt-14">
        <div className="flex items-center gap-3 flex-wrap font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3">
          <span className="inline-block bg-ink text-cream px-2.5 py-0.5 rounded-sm text-[10px]">+</span>
          <span>Bonus pattern</span>
          <span className="text-muted">· don&apos;t drive the Ferrari to the grocery store</span>
        </div>
        <h3 className="font-serif font-semibold text-[24px] leading-[1.2] text-ink mb-4">
          Match the model to the task
        </h3>
        <p className="text-[16px] mb-3.5">
          Asked whether she always uses Opus, Brittney&apos;s answer was the most pragmatic line in the webcast: <em className="italic">&ldquo;Do you like driving the Ferrari to the grocery store?&rdquo;</em>
        </p>
        <p className="text-[16px] mb-3.5">
          Opus for the genuinely complex multi-step work — the morning digest skill that has to write its own follow-up prompt. Sonnet for the day-to-day. Haiku for one-off questions where speed matters more than depth.
        </p>
        <p className="text-[16px]">
          <strong>For a sales team without sales ops:</strong> default to Sonnet. Escalate to Opus when the task is a thinking problem — strategy, multi-step reasoning, a customer-facing draft. Use Haiku for fast classification or extraction work. Your AI bill goes down. Your workflows feel faster.
        </p>
      </div>

      {/* ============ CLOSER ============ */}
      <div className="bg-ink text-cream px-9 py-12 mt-[4.5rem] -mx-2 rounded">
        <div className="font-mono text-[10px] tracking-widest uppercase text-amber mb-4">
          Why this matters
        </div>
        <h3 className="font-serif font-medium text-[30px] leading-[1.2] text-cream mb-5">
          Anthropic&apos;s reps don&apos;t have superpowers. They have routines.
        </h3>
        <p className="text-[16px] text-cream/85 mb-6">
          None of these three plays require a data warehouse, a sales ops team of ten, or a custom-built AI platform. They require deciding which slice of your week is admin grind, building a workflow that drafts it for you, and reviewing instead of producing.
        </p>
        <p className="text-[16px] text-cream/85 mb-6">
          If you want help figuring out which play would compound fastest in your org — daily prep, weekly forecast, or quarterly scoring — the Discovery is built for that conversation.
        </p>
        <div className="flex gap-4 flex-wrap">
          <a
            href="https://calendly.com/michael-spaike/new-meeting"
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="book_moede_click"
            data-umami-event-location="field-notes-anthropic-playbook"
            className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-ink hover:bg-amber-dark hover:text-cream no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
          >
            Book a Discovery →
          </a>
          <a
            href="https://spaike.dk"
            data-track-event="field_note_closer_more_click"
            data-track-article="anthropic-sales-playbook"
            className="inline-flex items-center gap-2 px-5 py-3 bg-transparent border border-cream text-cream hover:bg-cream hover:text-ink no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
          >
            More from SpAIke
          </a>
        </div>
      </div>

      {/* ============ ARTICLE FOOTER ============ */}
      <footer className="mt-16 pt-7 border-t border-rule font-mono text-[11px] tracking-wider text-muted leading-[1.7]">
        Primary source:{" "}
        <a
          href="https://claude.com/blog/how-an-anthropic-sales-leader-uses-claude-cowork-to-run-a-4-000-account-book"
          data-umami-event="field_note_source_click"
          data-umami-event-source="claude-blog"
          className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          &ldquo;How an Anthropic sales leader uses Claude Cowork to run a 4,000-account book&rdquo;
        </a>{" "}
        — Travis Bryant on the Claude blog, May 2026.
        <br />
        Companion:{" "}
        <a
          href="https://anthropic.ondemand.goldcast.io/on-demand/8928734f-e18b-4d7e-82af-a58cf01a288e"
          data-umami-event="field_note_source_click"
          data-umami-event-source="webcast"
          className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          &ldquo;How Anthropic&apos;s sales team run their week with Cowork&rdquo;
        </a>{" "}
        — on-demand webcast, 58 min, Travis Bryant &amp; Brittney Tong.
        <br />
        <br />
        Field notes curated and translated for SMB sales orgs by{" "}
        <a
          href="https://spaike.dk"
          className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
        >
          SpAIke
        </a>{" "}
        · Commercial impact, powered by AI.
      </footer>
    </article>
  );
}
