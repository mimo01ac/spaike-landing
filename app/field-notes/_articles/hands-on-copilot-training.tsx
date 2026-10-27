import type { Metadata } from "next";
import StarterPrompt from "../../components/field-notes/StarterPrompt";
import ThreeLevels from "../../components/field-notes/illustrations/ThreeLevels";
import AgentFlow from "../../components/field-notes/illustrations/AgentFlow";

/*
 * ────────────────────────────────────────────────────────────────────────
 * DECISIONS WAITING ON MICHAEL (spec §9). Built with clear placeholders.
 * Do not guess these; confirm before go-live.
 *   1. PRICE: default below is "Pricing on request" (no invented number).
 *      Swap for "From DKK X" if you want a public anchor. See PRICE_TODO.
 *   2. LANGUAGE: English by default (matches LinkedIn + other field notes).
 *      A Danish variant can live at /field-notes/hands-on-copilot-training-da.
 *   3. SLUG: /field-notes/hands-on-copilot-training. Change the file + index
 *      + sitemap + OG url if you want something else.
 *   4. PRE-INTERVIEW: described as a light preparation step in §"How it works".
 *      Promote it to a headline feature if you want it to carry more weight.
 *   5. LEAD MAGNET: the compendium is described, not gated. If you want it as
 *      an email-gated download, wire a form where the COMPENDIUM_TODO note is.
 * ────────────────────────────────────────────────────────────────────────
 */

export const metadata: Metadata = {
  title: "Hands-on Copilot training | SpAIke",
  description:
    "A three-hour, hands-on Copilot session for teams that have the license but not the habit. Built on your own tasks, so people leave with agents that draft real work, and the judgement to check it.",
  alternates: {
    canonical: "/field-notes/hands-on-copilot-training",
  },
  openGraph: {
    title: "From chat to your own agents, built on your team's real work",
    description:
      "A three-hour, hands-on Copilot session for teams that have the license but not the habit. Agents that draft meeting briefs, minutes and presentations from your own material. AI drafts, you review, decide and hit send.",
    type: "article",
    locale: "en_US",
    url: "https://www.spaike.dk/field-notes/hands-on-copilot-training",
    images: [
      {
        url: "/og/hands-on-copilot-training.png",
        width: 1200,
        height: 630,
        alt: "Hands-on Copilot training: from chat to your own agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "From chat to your own agents, built on your team's real work",
    description:
      "A three-hour, hands-on Copilot session for teams that have Copilot but have not found where it fits the working day.",
    images: ["/og/hands-on-copilot-training.png"],
  },
};

const MEETING_BRIEF = `You prepare me for a client meeting. You produce one short, internal, one-page brief so I walk in prepared. The brief is a draft for my eyes only, not something to send out.

Work in this order:
1. Find the meeting in my calendar (time, place, attendees). If several could match, ask me which one.
2. Find the most recent mail with this client, and what they asked for or raised.
3. Find what I promised them ("I will send", "we will come back to you").
4. Find internal notes relevant to this client.
5. Use web search only for general market context, and always name the source.

Write the brief in this fixed order, kept short:
- Meeting: date, time, place, attendees
- Status: 2 to 3 lines on the client and the occasion
- What they asked for: bullets, each with its source (mail + date)
- What we promised: bullets with a deadline where one is stated
- Suggested agenda: 3 to 5 points in a natural order
- Questions to ask: 3 to 5 open questions
- Needed before the meeting: figures or documents, with [MISSING: ...] if not found in the sources

Rules:
- Never invent figures, amounts, dates or agreements. If it is not in the sources, write [MISSING: ...].
- The brief gathers facts and prepares the conversation. It does not give advice.
- Keep it internal. No client details go into anything that leaves the building.
- End with "Sources:" and a list of the mails and notes you used.`;

const MINUTES = `You turn rough meeting notes, a Teams transcript, or pasted text into clean minutes plus a follow-up. Everything you produce is a draft that a person reads before anything is shared. If it is unclear which meeting it is, ask me briefly.

Deliver in this fixed order:
1. Minutes
   - Meeting: name, date, time
   - Attendees, and apologies
   - Decisions: numbered, one line each, phrased as a decision ("Decided: ...")
   - Discussed: short points with no decision
   - Tasks: a table with the columns What, Who, Deadline
   - Next meeting: date and time if it is stated
2. A draft follow-up mail to the attendees: short, with the decisions and tasks. To be approved and sent by a person.
3. Suggested calendar entries: the next meeting and key deadlines, as text. Do not create them yourself.
4. Open points: anything in the notes that is ambiguous or missing an owner or deadline.

Rules:
- Write only what is in the source. Never guess names, figures, deadlines or decisions. If something is missing, write [MISSING: ...] and list it under Open points.
- Keep decisions and discussion separate. An opinion is not a decision.
- Never send anything yourself, and never create calendar entries yourself.`;

export default function HandsOnCopilotTraining() {
  return (
    <article className="max-w-3xl mx-auto px-[22px] pt-10 pb-16 md:px-8 md:pt-16 md:pb-24 text-[17px] leading-[1.6] text-ink">
      {/* DATELINE */}
      <div className="flex justify-between items-center pb-3.5 mb-8 border-b border-rule font-mono text-[11px] font-medium tracking-wider uppercase text-muted">
        <span className="text-ink">SpAIke / Field Notes / №&nbsp;02</span>
        <span className="text-amber-dark">7&nbsp;min read</span>
      </div>

      {/* HERO */}
      <div className="font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-4">
        Hands-on Copilot training
      </div>
      <h1 className="font-serif font-semibold text-[36px] md:text-[54px] leading-[1.08] tracking-tight text-ink mb-6">
        From chat to your own agents,{" "}
        <em className="italic font-medium text-amber-dark">
          built on your team&apos;s real work
        </em>
      </h1>

      {/* DECK */}
      <p className="font-serif text-[22px] italic leading-[1.45] text-ink-soft mb-8 max-w-[640px]">
        A three-hour, hands-on session for teams that have Copilot but have not
        found where it fits the working day. Three hours, on your own tasks, not
        a demo. People leave with agents that draft real work, and the judgement
        to check it.
      </p>

      {/* PRIMARY CTA */}
      <div className="mb-10">
        <a
          href="#book"
          data-track-event="copilot_training_hero_cta"
          className="inline-flex items-center gap-2 px-5 py-3 bg-ink text-cream hover:bg-amber hover:text-ink no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
        >
          Book a session →
        </a>
      </div>

      {/* BYLINE */}
      <div className="flex flex-col gap-1.5 font-mono text-[12px] tracking-wider text-muted border-t border-b border-rule py-3.5 mb-12">
        <span>A field note on how I run the session · SpAIke · 2026</span>
        <span>
          Written from a recent three-hour session with a client team. Examples
          are generalised, no client material is shown.
        </span>
        <span>
          By{" "}
          <a
            href="https://spaike.dk"
            className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
          >
            SpAIke
          </a>
        </span>
      </div>

      {/* ============ THE PROBLEM ============ */}
      <section className="lede">
        <p className="mb-[18px] first-letter:font-serif first-letter:text-[64px] first-letter:font-semibold first-letter:float-left first-letter:leading-[0.9] first-letter:mt-1 first-letter:mr-2 first-letter:-mb-1 first-letter:text-amber-dark">
          Having Copilot is not the same as using it. Most people open the chat
          box, ask it to tidy up a mail, and stop there. The license is paid for,
          the tool sits inside the tools people already work in, and still most
          of the working day looks exactly the way it did before.
        </p>
        <p className="mb-[18px]">
          That gap is not a tooling problem. A license is not a strategy, and a
          demo does not change a habit. What changes a habit is sitting down with
          the work people already recognise, their own mails, meetings and
          documents, and building something small that drafts a task they do
          every week.
        </p>
        <p className="mb-[18px]">
          So that is what the session is: three hours, hands-on, on the team&apos;s
          own tasks. By the end, people have built a small agent, started it
          themselves, and checked what it produced. The point is the method, so
          they can do the same with the rest of their work afterwards.
        </p>
      </section>

      {/* ============ HOW THE SESSION WORKS ============ */}
      <section className="my-16 scroll-mt-10" id="format">
        <div className="font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          How the session works
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Three hours, hands-on, built around your tasks
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 border border-rule rounded overflow-hidden my-8">
          {[
            { k: "Format", v: "Three hours, hands-on. People work in Copilot the whole time, not watching slides." },
            { k: "Group", v: "Up to around 20 people, in pairs, so no one works alone." },
            { k: "Two tracks", v: "A beginner track and an experienced track, so everyone leaves with something they can use." },
            { k: "Copilot first", v: "Built on the Copilot you already have, inside your own Microsoft environment." },
          ].map((f, i) => (
            <div
              key={f.k}
              className={`px-5 py-5 ${i % 2 === 1 ? "sm:border-l border-rule" : ""} ${i > 1 ? "border-t border-rule" : i === 1 ? "border-t sm:border-t-0 border-rule" : ""}`}
            >
              <div className="font-mono text-[10px] tracking-widest uppercase text-amber-dark mb-2">
                {f.k}
              </div>
              <p className="text-[15px] leading-relaxed text-ink-soft">{f.v}</p>
            </div>
          ))}
        </div>

        {/* PRE-INTERVIEW. TODO(decision 4): promote to a headline feature if wanted. */}
        <div className="border-l-[3px] border-amber px-5 py-4 my-7">
          <div className="font-mono text-[10px] font-medium tracking-widest uppercase text-amber-dark mb-2">
            Before the day
          </div>
          <p className="text-[16px]">
            I tailor the session before it starts. A short AI pre-interview, a
            voice agent people talk to for a few minutes, maps the roles in the
            room and what each person wants to get out of the time. The agenda
            and the examples are then built on their answers, not on a generic
            template.
          </p>
        </div>

        <p className="mb-[18px]">
          Everyone also leaves with a short compendium: the tips and prompts from
          the day, and a recipe for setting up agents and routines yourself, so
          the session carries on after I leave.
        </p>
      </section>

      {/* ============ THE THREE LEVELS ============ */}
      <section className="my-16 scroll-mt-10" id="levels">
        <div className="font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          The mental map
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Three levels: from asking, to getting it done, to working differently
        </h2>
        <p className="mb-[18px]">
          The session opens with a simple map, so the rest of the day hangs
          together. First you ask a capable assistant. Then you give the
          assistant a fixed job and the context to do it. In time, you lay out
          the work itself differently, because part of it now runs on its own.
          Most teams are at the first level. The session spends most of its time
          on the second.
        </p>
        <div className="bg-cream-deep border border-rule rounded px-6 py-8 my-8 overflow-hidden">
          <ThreeLevels />
          <p className="font-mono text-[11px] tracking-wider uppercase text-muted text-center mt-3">
            Ask a smart assistant · then hire it · then lay out the office differently
          </p>
        </div>
        <p className="mb-[18px]">
          The step from chat to agent is not a cleverer model. It is the context
          you give it. An agent has to be onboarded like a new colleague: access
          to the tools, knowledge of how the house works, and a clear
          instruction about the job, what it should do, what it must not, and
          what a good result looks like.
        </p>
      </section>

      {/* ============ AGENDA ============ */}
      <section className="my-16 scroll-mt-10" id="agenda">
        <div className="font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          The agenda
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          What a session looks like, hour by hour
        </h2>

        <ol className="list-none border-l-2 border-rule pl-6 my-8 space-y-7">
          {[
            {
              t: "Welcome",
              d: "~10 min",
              b: "A leader opens: why the team is doing this, and the frame for the time. It lands harder from a partner than from the consultant alone.",
            },
            {
              t: "Module 1 · How to think about AI",
              d: "~30 min",
              b: "The three levels (chat, agents, workflows). Context as onboarding. The difference between free chat and your own Copilot, and why Copilot fits a regulated house, where data stays inside your environment.",
            },
            {
              t: "Module 2 · Chat in practice",
              d: "~45 min",
              b: "Better mails, texts and documents. What makes a good prompt (goal, context, source, expectation) and how to give Copilot access to your own material. Exercise 1: solve a real task in Copilot.",
            },
            {
              t: "Break",
              d: "~10 min",
              b: "",
            },
            {
              t: "Module 3 · Agents and triggers",
              d: "~45 min · main focus",
              b: "An agent is a saved instruction with a fixed job. We open the four agents, look at scheduling and triggers, and walk the recipe for building one. Exercise 2: build your first agent.",
            },
            {
              t: "Module 4 · The next level",
              d: "~20 min",
              b: "Whole workflows, not faster versions of the old ones. A track for people who want to build more themselves. And the point that agents are only as good as the knowledge they are given.",
            },
            {
              t: "Module 5 · Safety and getting started",
              d: "~15 min",
              b: "What protects you, what you still have to watch yourself, and the first concrete step each person takes this week.",
            },
          ].map((m) => (
            <li key={m.t} className="relative">
              <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-amber border-2 border-cream" />
              <div className="flex items-baseline gap-3 flex-wrap">
                <h3 className="font-serif text-[20px] font-semibold text-ink">
                  {m.t}
                </h3>
                <span className="font-mono text-[10px] tracking-wider uppercase text-muted">
                  {m.d}
                </span>
              </div>
              {m.b && (
                <p className="text-[15.5px] leading-relaxed text-ink-soft mt-1.5">
                  {m.b}
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* ============ THE AGENTS ============ */}
      <section className="my-16 scroll-mt-10" id="agents">
        <div className="font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          The agents we build together
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Four office jobs, each turned into a small agent
        </h2>
        <p className="mb-[18px]">
          These are the four agents I bring to a session. They are ordinary
          office tasks, not AI showpieces, and they are built from what the team
          asked for in the pre-interview. Each one does the same thing: it reads
          the right input, and it drafts. A person reviews, decides, and sends.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
          {[
            {
              tag: "C",
              title: "Meeting brief",
              does: "Prepares an adviser before a client meeting.",
              input:
                "Input: the calendar, the latest mail with the client, what was promised, and relevant internal notes.",
              out:
                "Delivers: one short internal one-pager, status, what the client asked for, what was promised, a suggested agenda, and questions to ask.",
            },
            {
              tag: "D",
              title: "Minutes and follow-up",
              does: "Turns rough notes or a Teams transcript into clean minutes.",
              input: "Input: meeting notes, a transcript, or text pasted into the chat.",
              out:
                "Delivers: structured minutes (decisions, discussion, tasks with owner and deadline), a draft follow-up mail, and suggested calendar entries. It creates and sends nothing itself.",
            },
            {
              tag: "B",
              title: "Presentation in the house style",
              does: "Drafts a presentation in your own look and tone.",
              input: "Input: the topic, audience and length, plus your style and templates.",
              out:
                "Delivers: an outline, finished slide texts, and a prompt to hand to Copilot in PowerPoint so it can build the slides in the house style.",
            },
            {
              tag: "A",
              title: "Newsletter and client content",
              does: "Drafts client content in a fixed, measured tone.",
              input: "Input: notes, a link, or pasted source text, with any figures supplied.",
              out:
                "Delivers: a draft section in a set structure, with the house disclaimer. Figures come from the input, never guessed, and a checklist for the approver.",
            },
          ].map((a) => (
            <div
              key={a.tag}
              className="bg-cream-deep border border-rule rounded px-5 py-5 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2.5">
                <span className="inline-block bg-ink text-amber font-mono text-[12px] font-bold px-2.5 py-0.5 rounded-sm">
                  {a.tag}
                </span>
                <h3 className="font-serif text-[20px] font-semibold text-ink">
                  {a.title}
                </h3>
              </div>
              <p className="text-[15px] leading-relaxed text-ink">{a.does}</p>
              <p className="text-[13.5px] leading-relaxed text-muted">{a.input}</p>
              <p className="text-[13.5px] leading-relaxed text-ink-soft">{a.out}</p>
            </div>
          ))}
        </div>

        <div className="bg-cream-deep border border-rule rounded px-6 py-8 my-8 overflow-hidden">
          <AgentFlow />
          <p className="font-mono text-[11px] tracking-wider uppercase text-muted text-center mt-3">
            Input in · a draft out · a person reviews and sends
          </p>
        </div>
      </section>

      {/* ============ YOU STAY IN CONTROL ============ */}
      <section className="my-16 scroll-mt-10" id="control">
        <div className="bg-ink text-cream px-8 py-10 -mx-2 rounded">
          <div className="font-mono text-[10px] tracking-widest uppercase text-amber mb-4">
            You stay in control
          </div>
          <h2 className="font-serif font-medium text-[30px] md:text-[38px] leading-[1.15] text-cream mb-5">
            AI drafts. You review, decide, and hit send.
          </h2>
          <p className="text-[16px] text-cream/85 mb-4">
            This is the honest centre of the session, and for a regulated team it
            is the part that matters most. The agents produce a draft. Nothing
            leaves the building until a person has read it, corrected it, and
            chosen to send it. In this session the agents do not act on their own:
            they hand you text you start and check.
          </p>
          <p className="text-[16px] text-cream/85 mb-4">
            So checking the output is part of the skill, not an afterthought. One
            exercise is a set of minutes with three deliberate errors planted in
            it, and the group practises catching them. It is a small thing that
            changes how people treat everything the tool produces afterwards.
          </p>
          <p className="text-[16px] text-cream/85">
            On access: what Copilot can reach depends on your license and setup,
            not on the fact that you are in a Microsoft tenant. It sees only what
            the individual already has access to. I say that plainly in the room,
            because a tool people trust for the wrong reasons is worse than one
            they understand.
          </p>
        </div>
      </section>

      {/* ============ TRY IT YOURSELF ============ */}
      <section className="my-16 scroll-mt-10" id="try">
        <div className="font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          Try it yourself
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          Two starter instructions you can use today
        </h2>
        <p className="mb-[18px]">
          You do not need a session to start. Here are two generic versions of
          the agents above, written so you can paste them into a Copilot agent
          and adapt them to your own house. They draft only. You review and send.
        </p>

        <StarterPrompt
          name="meeting_brief"
          summary="Starter instruction · meeting brief"
          note={
            <>
              Paste this into a new Copilot agent (Agent Builder) and give it
              access to your calendar, mail and files. It reads what was asked
              and promised, and drafts a one-page brief before the meeting.
              Replace nothing except the house specifics you want it to respect.
            </>
          }
          prompt={MEETING_BRIEF}
        />

        <StarterPrompt
          name="minutes_follow_up"
          summary="Starter instruction · minutes and follow-up"
          note={
            <>
              Paste this into a Copilot agent, or use it as a saved prompt in
              chat. Give it the rough notes or a Teams transcript, and it drafts
              the minutes, a follow-up mail, and suggested calendar entries. It
              creates and sends nothing itself.
            </>
          }
          prompt={MINUTES}
        />
      </section>

      {/* ============ WHAT YOU LEAVE WITH ============ */}
      <section className="my-16 scroll-mt-10" id="takeaways">
        <div className="font-mono text-[11px] font-medium tracking-wider uppercase text-amber-dark mb-3.5">
          What you leave with
        </div>
        <h2 className="font-serif font-semibold text-[28px] md:text-[36px] leading-[1.15] tracking-tight text-ink mb-6">
          A method, not just a few prompts
        </h2>
        <ul className="list-none space-y-3.5 my-6">
          {[
            "The method: how to spot a task worth automating, set up a small agent for it, start it yourself, and check what it produces, so you can repeat it on your own work.",
            "The four agents above as starting points, ready to adapt to your house.",
            "A short compendium: the day's prompts and tips, plus a recipe for setting up agents and routines yourself.",
          ].map((t) => (
            <li key={t} className="relative pl-7 text-[16px] leading-relaxed">
              <span className="absolute left-0 top-[9px] w-2.5 h-2.5 bg-amber rounded-[2px]" />
              {t}
            </li>
          ))}
        </ul>
        {/* COMPENDIUM_TODO(decision 5): to gate the compendium as an email download,
            add a lead form here instead of describing it above. */}
      </section>

      {/* ============ SMALLER TEAM ============ */}
      <section className="my-16 scroll-mt-10" id="smaller-team">
        <div className="border-l-[3px] border-ink px-5 py-4 my-7 bg-cream-deep">
          <div className="font-mono text-[10px] font-medium tracking-widest uppercase text-amber-dark mb-2">
            For a smaller team
          </div>
          <p className="text-[16px] mb-3">
            You do not need a full session to use the same approach. If you are a
            handful of people, or working on your own, pick the one task you
            repeat most often and build a single agent for it, following the
            recipe: solve it once in chat, correct it until it is right, write the
            job down as an instruction, and save it so it runs again.
          </p>
          <p className="text-[16px]">
            The two starter instructions above are a fine place to begin. Start
            with one task, one agent, one owner.
          </p>
        </div>
      </section>

      {/* ============ CTA / PRODUCT ============ */}
      <section id="book" className="scroll-mt-10">
        <div className="bg-ink text-cream px-9 py-12 mt-[4.5rem] -mx-2 rounded">
          <div className="font-mono text-[10px] tracking-widest uppercase text-amber mb-4">
            Run this for your team
          </div>
          <h3 className="font-serif font-medium text-[30px] leading-[1.2] text-cream mb-5">
            If your team has Copilot but has not found where it fits
          </h3>
          <p className="text-[16px] text-cream/85 mb-4">
            I run this as a practical session built around your own tasks. It
            suits a team that is in a Microsoft tenant, has Copilot or is close to
            it, and wants people actually using it in the working day. You get the
            pre-interview, the three-hour session in two tracks, the four agents
            as starting points, and the compendium afterwards.
          </p>

          {/* PRICE_TODO(decision 1): default is "Pricing on request". Swap the
              block below for a public anchor ("From DKK X") if you decide to. */}
          <div className="inline-flex items-center gap-3 border border-cream/25 rounded-sm px-4 py-2.5 mb-6">
            <span className="font-mono text-[10px] tracking-widest uppercase text-amber">
              Pricing
            </span>
            <span className="font-sans text-[15px] text-cream">
              On request
            </span>
          </div>

          <div className="flex gap-4 flex-wrap">
            <a
              href="mailto:michael@spaike.dk?subject=Hands-on%20Copilot%20training"
              data-track-event="copilot_training_book_click"
              data-track-location="field-notes-copilot-training"
              className="inline-flex items-center gap-2 px-5 py-3 bg-amber text-ink hover:bg-amber-dark hover:text-cream no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
            >
              Book a session →
            </a>
            <a
              href="https://spaike.dk"
              data-track-event="copilot_training_more_click"
              className="inline-flex items-center gap-2 px-5 py-3 bg-transparent border border-cream text-cream hover:bg-cream hover:text-ink no-underline font-sans font-medium text-[15px] rounded-sm transition-colors"
            >
              More from SpAIke
            </a>
          </div>
        </div>
      </section>

      {/* ============ ARTICLE FOOTER ============ */}
      <footer className="mt-16 pt-7 border-t border-rule font-mono text-[11px] tracking-wider text-muted leading-[1.7]">
        A field note from SpAIke on how I run a hands-on Copilot session. Written
        from a recent three-hour session with a client team. Examples are
        generalised, and no client material is shown.
        <br />
        <br />
        Questions:{" "}
        <a
          href="mailto:michael@spaike.dk?subject=Hands-on%20Copilot%20training"
          className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
        >
          michael@spaike.dk
        </a>
        {" · "}
        <a
          href="https://spaike.dk"
          className="text-ink border-b border-rule hover:text-amber-dark hover:border-amber-dark transition-colors"
        >
          spaike.dk
        </a>{" "}
        · Commercial impact, powered by AI.
      </footer>
    </article>
  );
}
