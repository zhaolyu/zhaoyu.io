/**
 * Content constants for the landing page.
 *
 * Disclosure policy — the code must stand on its own, so the rule is restated
 * here: every employer-related number on any surface (copy, meta, JSON-LD,
 * llms.txt, OG cards) carries a public source from `SOURCES`, and nothing
 * Versant/CNBC has not disclosed publicly is stated anywhere. Role and scope
 * are described loudly; internal specifics are not. `disclosure-guard.test.ts`
 * enforces the deny-list; `content.test.ts` enforces the source rule.
 */

import type { FeatureFlag } from '$lib/constants/config';

export interface Source {
  label: string;
  href: string;
}

/**
 * The public sources employer facts may cite. Checked 2026-08-19 against the
 * FY2025 10-K, both 2026 10-Qs, the Q2-2026 8-K, the Q1/Q2 earnings calls and
 * the Investor Day deck. Add a new disclosure here before using it in copy.
 */
export const SOURCES = {
  versantInvestorDay2025: {
    label: 'Versant Investor Day, Dec 2025 · slide 66 (ComScore)',
    href: 'https://cdn.versantmedia.com/versantmedia/2025-12/Versant%20Investor%20Day%20-%20Full%20Deck%20-%20December%204%202025_vPost_compressed.pdf',
  },
  versantQ2Call2026: {
    label: 'Versant Q2-2026 earnings call, 6 Aug 2026',
    href: 'https://www.investing.com/news/transcripts/earnings-call-transcript-versant-media-lifts-2026-outlook-in-q2-2026-93CH-4842245',
  },
  cruxCnbc: {
    label: 'Chrome UX Report · origin www.cnbc.com · Jul 2026 (via treo.sh)',
    href: 'https://treo.sh/sitespeed/www.cnbc.com',
  },
  linkedin: {
    label: 'LinkedIn · role and scope',
    href: 'https://linkedin.com/in/zhaolyu',
  },
} as const satisfies Record<string, Source>;

export interface HeroContent {
  badge: string;
  headline: {
    primary: string;
    accent: string;
  };
  /** One-line version of the headline for the OG card and other tight slots. */
  tagline: string;
  bio: string;
  cta: {
    primary: string;
    secondary: string;
  };
  motto: string[];
}

/**
 * Hero copy. Written for a Director / Head-of-Engineering reader: role and
 * outcomes up front, the still-ships differentiator second, no internal
 * specifics. The headline (primary + accent) is held to 40 words by
 * positioning.test.ts; the bio carries at most one number.
 */
export const heroContent: HeroContent = {
  badge: 'SENIOR MANAGER, ENGINEERING · VERSANT · CNBC CORE',
  headline: {
    primary: 'I lead engineering teams that turn platform performance into audience and revenue.',
    accent:
      'Player-coach: 20 engineers, 3 teams, driving the next-gen CNBC.com rebuild — hands still in the code.',
  },
  tagline:
    'Player-coach engineering leader: edge architecture, video, and governed AI for a national financial audience.',
  bio: 'Nine years on CNBC.com, intern to Principal Engineer to running the web organization. I keep the platform fast enough to hold ~47M monthly readers through market-moving events — edge architecture, video, and governed AI, built by teams I lead and still code beside.',
  cta: {
    primary: 'View Selected Work',
    secondary: 'Read the Notes',
  },
  motto: ['Low Latency', 'High Leverage', 'Deep Focus'],
};

export interface PerformanceMetric {
  label: string;
  value: string;
  sublabel: string;
  /** What the number measures, over what window — rendered with the metric. */
  basis: string;
  source: Source;
}

/**
 * Headline numbers. Each one is public and linked; the metrics grid is the
 * only place they appear as figures (content.test.ts caps repeats).
 */
export const performanceMetrics: PerformanceMetric[] = [
  {
    label: 'Monthly uniques',
    value: '47M',
    sublabel: 'CNBC digital · ComScore',
    basis:
      'U.S. average monthly unique visitors, Sept 2024–Aug 2025, as reported at Versant Investor Day',
    source: SOURCES.versantInvestorDay2025,
  },
  {
    label: 'p75 LCP',
    value: '1.7s',
    sublabel: 'cnbc.com · CrUX field data',
    basis:
      'Chrome UX Report, all devices, July 2026 — 85% of page loads inside the 2.5s "good" threshold',
    source: SOURCES.cruxCnbc,
  },
  {
    label: 'Engineers',
    value: '20',
    sublabel: '3 web teams · CNBC Core',
    basis: 'Organization scope as Senior Manager, Engineering',
    source: SOURCES.linkedin,
  },
  {
    label: 'Years shipping',
    value: '9+',
    sublabel: 'CNBC · NBC News · NBCUniversal',
    basis: 'Intern in 2016 to Senior Manager, Engineering in 2026, on the same platform',
    source: SOURCES.linkedin,
  },
];

export interface Project {
  title: string;
  description: string;
  metrics: Array<{ label: string; value: string }>;
  tags: string[];
  diagram?: string;
  /** Only shown when the named flag is enabled in FEATURE_FLAGS. */
  featureFlag?: FeatureFlag;
}

export interface ProjectsData {
  projects: Project[];
}

export const projectsData: ProjectsData = {
  projects: [
    {
      title: 'CNBC.com Next-Gen Migration',
      description:
        'Market-moving days are a financial-news business at its most valuable and most fragile. I architected CNBC.com’s migration from a legacy client-side monolith to an isomorphic Akamai Edge architecture, moving business and rendering logic to the network edge, so the platform holds its full audience through exactly those spikes: sub-2-second p75 LCP in public field data, zero downtime through the cutover, and no lost sessions or ad impressions at the moments the audience is largest.',
      tags: ['Isomorphic React', 'Akamai EdgeWorkers', 'High Scale', 'Performance'],
      metrics: [
        { label: 'P75 LCP (CRUX)', value: '1.7s' },
        { label: 'MONTHLY UNIQUES', value: '47M' },
      ],
      diagram: 'migration-arch',
    },
  ],
};

/**
 * What a note's claim rests on. `href` is present when the receipt is public
 * and a reader can go check it; it is absent when the receipt is the author's
 * own practice, which is stated plainly rather than dressed up as a citation.
 */
export interface NoteSource {
  label: string;
  href?: string;
}

export interface EngineeringNote {
  slug: string;
  title: string;
  /** Display date, e.g. "Jul 11, 2026" */
  date: string;
  /** ISO 8601 date (YYYY-MM-DD) for schema.org datePublished */
  dateISO: string;
  /** ISO 8601 date of the last substantive edit, when later than dateISO. */
  dateModified?: string;
  tags: string[];
  /** At least one. A note with no receipt does not ship — see PUBLISHING.md. */
  sources: NoteSource[];
  content: string[];
}

export interface NotesData {
  notes: EngineeringNote[];
}

export const notesData: NotesData = {
  notes: [
    {
      slug: 'reinforcement-anchors-beat-emphasis-in-system-prompts',
      title: 'Reinforcement Anchors Beat Emphasis: Compressing a Production System Prompt',
      date: 'Aug 14, 2026',
      dateISO: '2026-08-14',
      tags: ['System Prompt Architecture', 'LLM Mechanics', 'AI Engineering'],
      sources: [
        {
          label: 'Salesforce — lessons from 20,000 enterprise agent deployments',
          href: 'https://www.salesforce.com/news/stories/ai-lessons-building-enterprise-agents/',
        },
        {
          label: 'RoFormer: Enhanced Transformer with Rotary Position Embedding (arXiv 2104.09864)',
          href: 'https://arxiv.org/abs/2104.09864',
        },
        {
          label: 'Lost in the Middle: How Language Models Use Long Contexts (arXiv 2307.03172)',
          href: 'https://arxiv.org/abs/2307.03172',
        },
        { label: 'First-hand: compressing a production system prompt from ~4,000 to ~1,300 words' },
      ],
      content: [
        "Production system prompts bloat by a predictable mechanism. The model does something wrong, so you add an instruction telling it not to — and when that doesn't stick, you add a more forcefully worded one. <code>NEVER do X.</code> In capitals. With exclamation points. <a href='https://www.salesforce.com/news/stories/ai-lessons-building-enterprise-agents/' target='_blank' rel='noopener'>Salesforce found this same escalation</a> across 20,000 enterprise agent deployments, and found it does not work: <strong>an LLM does not process typographic emphasis the way a human reader does.</strong> Capitalization and punctuation are just more tokens, not a signal that reliably overrides competing considerations during generation. So the instruction fails again, another one gets appended, and the prompt accumulates. I took one production prompt from roughly 4,000 words to roughly 1,300 and it got <em>more</em> reliable, not less — which is only surprising if you believed the length was buying compliance in the first place.",
        "What actually carries a constraint is position, not volume. Attention has a measurable front-and-back bias: <a href='https://arxiv.org/abs/2104.09864' target='_blank' rel='noopener'>RoPE</a>, the positional encoding most current models use, decays in a way that puts tokens far from both ends of the sequence into a systematically lower-attention zone, and <a href='https://arxiv.org/abs/2307.03172' target='_blank' rel='noopener'>retrieval accuracy for a fact placed mid-context drops by more than 20 points</a> compared to the same fact at the start or end. A constraint's <em>location</em> is load-bearing in a way its wording is not. So the rewrite was tiered rather than shortened: identity and non-negotiable constraints at the edges, task detail in the middle, and reinforcement anchors placed to survive attention decay across a long multi-turn conversation rather than only the first exchange. The other half of the compression was subtraction — Salesforce's corollary is that <strong>anything you can draw as a flowchart belongs in code, not in a prompt</strong>, because code executes identically every time and no wording does. A context window is an attention budget for the run, not a junk drawer for everything that once went wrong.",
      ],
    },
    {
      slug: 'the-agent-run-is-the-new-unit-of-work',
      title: 'The Agent Run Is the New Unit of Work — and Reviewing It Is Management',
      date: 'Jul 11, 2026',
      dateISO: '2026-07-11',
      tags: ['Agent Architecture', 'Engineering Management', 'AI Engineering'],
      sources: [
        { label: 'First-hand: reviewing delegated agent output while managing 3 web teams' },
      ],
      content: [
        "The genuinely new moment in AI-assisted engineering is not the chat answer — you watched that get produced and judged it in real time. It's when an agent comes back with <em>finished work</em>: it read the folder, edited the files, ran the commands, and declares itself done. You did not do the work and did not watch every step, so you cannot know which assumptions it made or which shortcut it took because the shortcut made the output look cleaner. The only question left is: <strong>is it real?</strong> The first time this happens it feels like magic. The tenth time it feels like management — because that is what it is: supervising labor you did not perform. I manage 20 engineers across 3 web teams, and the skills that job demands — scoping delegation, setting a review bar, calibrating trust per worker — are now individual-contributor skills too.",
        "Management needs a unit of account, and session-level thinking is the wrong one. The right unit is the <strong>agent run</strong>: it begins at delegation, contains the tool calls, branches, and corrections, and ends in acceptance or rejection. That framing makes the work measurable — completion rate, correction rate, and whether your approval gates ever actually reject anything (a gate that always approves is not a control, it's theater). It also surfaces a free asset: every correction you make to agent output is a labeled evaluation you wrote by acting, the natural test set for the next run. This is the same discipline as my receipts rule — <code>done</code> without an attached artifact is self-attestation by the party most motivated to claim success. Getting the machine to do the work is the easy part now. <strong>Deciding the work is trustworthy is the job.</strong>",
      ],
    },
    {
      slug: 'agents-degrade-quietly-maintenance-is-where-value-compounds',
      title: 'Agents Degrade Quietly: Maintenance Is Where the Value Compounds',
      date: 'Jul 11, 2026',
      dateISO: '2026-07-11',
      tags: ['Agent Architecture', 'Reliability', 'Engineering Management'],
      sources: [
        {
          label:
            'First-hand: ownership requirements applied to agents running near production work',
        },
      ],
      content: [
        'Building an agent produces a visible artifact — there was nothing, now there is a working agent — so it reads as progress. Maintaining one produces no artifact; at best, nothing happens. So effort flows to building, and the felt value inverts the real value. A well-built agent nobody maintains degrades on a schedule: its context sources go stale, its permissions drift wider than its job, its instructions calcify into a patch pile. A modestly-built agent someone reviews weekly <strong>compounds</strong> — each pass prunes a failure mode and sharpens the job. This is the oldest lesson in operations wearing a new costume: prevented loss is invisible, which is why nobody celebrates the on-call review that kept the incident from existing.',
        "The corrective is ownership, and it decomposes into four responsibilities I now require for any agent near production work: <strong>define the job narrowly</strong> (a vague agent is an unowned agent waiting to happen); <strong>curate the diet</strong> — what it reads, which examples it learns from, including rejected outputs so it learns what <em>not</em> to do; <strong>manage permissions proportional to stakes</strong> — draft-only and write-access are different categories, and write access is earned inside a narrow job, not granted because a demo looked good; and <strong>run the review loop</strong>, where one-off failures get fixed at the output level but recurring failures get fixed at the system level. Team agents fail by tragedy of the commons — the pain is collective, the maintenance is nobody's job — so the owner follows the work. <strong>An agent is not a feature you ship. It is a service you operate.</strong>",
      ],
    },
    {
      slug: 'spec-quality-is-the-bottleneck-not-implementation-speed',
      title: 'Spec Quality Is the Bottleneck Now, Not Implementation Speed',
      date: 'Jul 11, 2026',
      dateISO: '2026-07-11',
      tags: ['AI Engineering', 'Agent Architecture', 'Specification'],
      sources: [
        {
          label: 'METR — Measuring the impact of early-2025 AI on experienced developers',
          href: 'https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/',
        },
        {
          label: 'StrongDM — building software with AI in a software factory',
          href: 'https://www.strongdm.com/blog/the-strongdm-software-factory-building-software-with-ai',
        },
        {
          label: 'strongdm/attractor — the public natural-language spec repository',
          href: 'https://github.com/strongdm/attractor',
        },
      ],
      content: [
        "The industry is measuring AI-assisted development with the wrong unit of analysis. Code-generation speed is the vanity metric; <a href='https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/' target='_blank' rel='noopener'>the METR result everyone cites</a> — experienced developers who <em>felt</em> 20% faster while measuring slower — isn't evidence that AI doesn't work, it's evidence that implementation speed was never the constraint. When agents can produce working code from any sufficiently precise description, the bottleneck moves upstream to the description itself. <a href='https://www.strongdm.com/blog/the-strongdm-software-factory-building-software-with-ai' target='_blank' rel='noopener'>StrongDM's autonomous pipeline</a> runs on nearly 6,000 lines of <a href='https://github.com/strongdm/attractor' target='_blank' rel='noopener'>public behavioral specification</a> — and that corpus, not the generated code, is the engineering artifact. <strong>The specification becomes the primary artifact; the codebase is a derivative</strong> — closer to a build output than to source.",
        'Building production systems with Cursor and Claude Code has restructured where my own hours go. My leverage stopped correlating with how fast I can type and started correlating with how precisely I can state three things: the goal, the boundary, and what "done" has to prove. The human stays at the two endpoints — specification in, satisfaction judgment out — and everything between is increasingly the machine\'s. This also explains why AI amplifies experts instead of equalizing them: it equalizes execution speed, but execution was already cheap. What it amplifies is specification quality, and specification quality is a direct function of domain depth. If the agent keeps disappointing you, the uncomfortable first question is no longer about the model — it\'s whether you actually specified the thing you wanted.',
      ],
    },
    {
      slug: 'agent-failures-are-loop-failures',
      title: 'Agent Failures Are Loop Failures, Not Intelligence Failures',
      date: 'Jul 11, 2026',
      dateISO: '2026-07-11',
      tags: ['Agent Architecture', 'Reliability', 'Distributed Systems'],
      sources: [{ label: 'First-hand: agent failures debugged over the course of 2026' }],
      content: [
        "Every agent failure I've debugged this year decomposes the same way. The agent didn't lack intelligence — the loop lacked definition. It wandered out of scope because no boundary was stated. It \"finished\" without finishing because nothing defined what done has to prove. Two agents double-executed the same task because nothing marked it claimed. These are Tuesday failures, and none of them are fixed by a smarter model, because <strong>smartness cannot supply a fact that was never specified</strong>. A run an agent can actually be held to has five parts: a goal, a boundary, tools, artifacts, and receipts. Miss one and you haven't delegated work — you've made a wish.",
        'The good news: distributed systems solved these coordination problems decades ago, we just have to notice the mapping. A visible <code>CLAIMED</code> state on a task is a lease, revalidated when the worker returns. "Done" without an attached receipt is self-attestation by the party with the strongest incentive to declare success — so the receipt (the diff, the test run, the artifact link) is non-negotiable, the same way you require an acknowledgement instead of trusting a fire-and-forget write. And the issue tracker you already run is the natural control plane: it has owners, statuses, comments, links, and history built in. <strong>Reliability is engineered into the loop, not summoned from the model.</strong> Make the loop less ambiguous before you ask for a smarter agent.',
      ],
    },
    {
      slug: 'why-i-made-this-site-readable-by-machines-not-just-humans',
      title: 'Why I Made This Site Readable by Machines, Not Just Humans',
      date: 'Jul 11, 2026',
      dateISO: '2026-07-11',
      tags: ['AI Engineering', 'SEO', 'Structured Data'],
      sources: [
        { label: "This site's own llms.txt", href: 'https://zhaoyu.io/llms.txt' },
        {
          label: 'Source for the JSON-LD and structured data described here',
          href: 'https://github.com/zhaolyu/zhaoyu.io',
        },
      ],
      content: [
        "Recruiters and hiring pipelines increasingly route through an AI agent before a human ever opens a tab. A portfolio site built only for a person scrolling and reading is now serving half its actual audience. So I added the other half: an <code>llms.txt</code> at the site root — a plain-text summary of who I am and what I've built, structured for a language model's context window rather than a browser's rendering engine — JSON-LD <code>Person</code> schema on every page, and real canonical URLs for these notes at <code>/blog/{slug}</code> instead of leaving them buried as anchors inside one long scrolling page. Same content, now individually addressable, cacheable, and citable.",
        "The more interesting find while doing this wasn't a feature, it was a bug. My static-site adapter's SPA fallback page and the prerendered root route both wanted the filename <code>index.html</code>, and the fallback was winning the write — silently replacing the real homepage (title, description, Open Graph tags, all of it) with an empty shell at build time. Every crawler and every link preview had been getting nothing. The fix was a one-line rename, but the lesson generalizes: <strong>a static site's build output is not implied by its source — verify what actually ships</strong>, especially at the config layer nobody re-reads after initial setup.",
      ],
    },
    {
      slug: 'the-three-tiers-of-using-ai-and-why-only-two-matter-now',
      title: 'The Three Tiers of Using AI, and Why Only Two of Them Still Differentiate You',
      date: 'Jul 11, 2026',
      dateISO: '2026-07-11',
      tags: ['AI Engineering', 'Agent Architecture', 'Career'],
      sources: [
        {
          label: 'First-hand: setting AI-adoption standards across a web engineering organization',
        },
      ],
      content: [
        'There\'s a real difference between using AI as a faster typist — autocomplete, chat-assisted edits, "fix this bug for me" — and delegating a bounded unit of work to an agent that plans, executes across multiple files, and hands you a diff to review. The first tier is now table stakes; every engineer I work with has a model open in a side pane, and it stopped being a differentiator the moment it became the default. The tiers above it — an agent working a scoped task end-to-end, or several agents running in parallel with their own permission boundaries — are where the actual leverage still lives, because almost nobody has restructured how they delegate work to get there.',
        'As the person who sets AI-adoption standards for my org, I spend almost none of my time on prompting technique. I spend it on the guardrails: what an agent can touch unsupervised, what requires a human review gate before it ships, and what "done" has to prove before I believe it. This site\'s agent-readable rewrite — the notes, the structured data, the build-output bug above — was built the same way: scoped to specific files, verified against the existing type-check, lint, test, and build gates before anything shipped, with the plan surfaced for review rather than pushed silently. <strong>"I use AI" stopped being the differentiator. Whether you can hand an agent a boundary and a review bar — instead of still typing every line yourself — is the one that\'s left.</strong>',
      ],
    },
    {
      slug: 'building-with-ai-the-compound-advantage',
      title: 'Building with AI: The Compound Advantage',
      date: 'Jul 11, 2026',
      dateISO: '2026-07-11',
      tags: ['AI Engineering', 'Productivity', 'Meta'],
      sources: [
        {
          label: "This site's source, built as described",
          href: 'https://github.com/zhaolyu/zhaoyu.io',
        },
        { label: 'First-hand: building and shipping this site with Claude Code' },
      ],
      content: [
        "I built most of this site using Claude Code. Not as a novelty — as a deliberate workflow. The components you're reading, the type errors that blocked deployment, the engineering notes you're reading: almost all of it happened through a tight loop of prompting, reviewing, and committing. My job was taste and judgment, not keystrokes.",
        "The thing I didn't expect was the <em>qualitative</em> shift, not just the speed. When implementation cost drops low enough, you stop filtering ideas at the \"is this worth building?\" stage. You just build. The compounding isn't in the individual tasks — it's in the number of experiments you run. An engineer who ships 10 experiments a week learns differently than one who ships 2. AI doesn't change what you can build; it changes how many times you can try.",
      ],
    },
    {
      slug: 'sovereign-resilience-why-i-over-index-on-edge-architecture',
      title: 'Sovereign Resilience: Why I Over-Index on Edge Architecture',
      date: 'Jul 11, 2026',
      dateISO: '2026-07-11',
      tags: ['Architecture', 'Edge Computing', 'Independence'],
      sources: [
        {
          label: 'First-hand: operating an edge-rendered architecture through market-moving events',
        },
      ],
      content: [
        "The CNBC architecture I maintain runs at the edge: request handling, personalization logic, and cache invalidation all execute as close to the user as possible. No single region, no single cloud dependency, no single point of failure. When us-east-1 degrades during a market-moving event, traffic routes around it. The system doesn't panic — it degrades gracefully.",
        "I've started applying the same pattern to my own work. A skill portfolio concentrated in one employer, one domain, one team is a <strong>single point of failure</strong>. Redundancy at the edge means building capabilities that can execute independently — full-stack range, local-first tooling, systems you own outright. Not as a hedge against any specific outcome, but because optionality compounds quietly until the moment it matters all at once.",
      ],
    },
    {
      slug: 'idempotency-in-distributed-systems',
      title: 'Idempotency in Distributed Systems',
      date: 'Jul 11, 2026',
      dateISO: '2026-07-11',
      tags: ['Backend', 'API Design', 'Reliability'],
      sources: [
        { label: 'First-hand: API design for systems that spike on scheduled market events' },
      ],
      content: [
        'Working on live news infrastructure taught me that <strong>failures are not exceptional — they are scheduled</strong>. When a Fed rate decision drops at 2pm, every monitoring system, every analytics pipeline, every content update fires simultaneously. Network partitions happen. Acknowledgements get dropped. The question is never "will this request fail?" — it\'s "what happens when it does?"',
        "Idempotency keys are the answer. The design rule I now apply to every API: <strong>the client should always be able to safely retry.</strong> If handing you the same request twice produces different side effects, the design isn't finished. This matters even more in event-driven systems where the cost of double-processing — a duplicate trade entry, a duplicate webhook delivery, a duplicate analytics event — compounds faster than the failure that triggered the retry.",
      ],
    },
    {
      slug: 'the-url-is-the-source-of-truth',
      title: 'The URL is the Source of Truth',
      date: 'Jul 11, 2026',
      dateISO: '2026-07-11',
      tags: ['Architecture', 'State Management', 'UX'],
      sources: [{ label: 'First-hand: URL-driven state in production web applications' }],
      content: [
        'In modern SPAs, we often over-engineer state management stores (Redux, Zustand) for data that belongs in the URL. If a user filters a dashboard by "Status: Active" and refreshes the page, that filter should persist. If they send the link to a colleague, the colleague should see the same filtered view.',
        'If the state is not in the URL, it is ephemeral. My rule of thumb: <strong>If it changes the data payload, it belongs in the query string.</strong> Client-side stores should be reserved for truly transient UI states (like whether a modal is open or a menu is expanded), not for data definition. Nine years on high-traffic news pages gave me the distributed-systems framing for why this keeps being right: URL-as-truth is single-leader replication — one authoritative writer, every view a follower. A constellation of client stores each holding its own copy of the filter is multi-leader replication, and you inherit its signature failure mode: divergence with no conflict-resolution story.',
      ],
    },
    {
      slug: 'decoupling-state-from-render-in-llm-streaming',
      title: 'Decoupling State from Render in LLM Streaming',
      date: 'Jul 11, 2026',
      dateISO: '2026-07-11',
      tags: ['React Performance', 'HCI', '60fps'],
      sources: [{ label: 'First-hand: profiling LLM streaming UIs against the 16ms frame budget' }],
      content: [
        'The naive approach to building an AI chat interface is to connect a Server-Sent Events (SSE) stream directly to a React state setter. Every time a new token chunk arrives (often at sub-50ms intervals), you call <code>setState(prev => prev + chunk)</code>.',
        "<strong>This is a performance trap.</strong> Triggering a reconciliation cycle on every single token blows through the browser's 16ms frame budget. The solution is to decouple ingestion from rendering. We utilized a mutable <code>useRef</code> buffer to capture high-velocity incoming chunks synchronously, then used a throttled flush mechanism (synced with <code>requestAnimationFrame</code>) to commit to the DOM only when the browser was ready to paint.",
      ],
    },
  ],
};

export interface CareerPoint {
  year: number;
  role: string;
  company: string;
  /** One-line context for track changes, so the timeline reads as a choice, not a zigzag. */
  note?: string;
}

export interface CareerHistory {
  points: CareerPoint[];
}

export const careerHistory: CareerHistory = {
  points: [
    { year: 2016, role: 'Intern', company: 'CNBC' },
    { year: 2017, role: 'Software Engineer', company: 'CNBC' },
    { year: 2019, role: 'Senior Engineer', company: 'NBC News' },
    {
      year: 2021,
      role: 'Engineering Manager',
      company: 'NBCUniversal',
      note: 'First management tour.',
    },
    {
      year: 2025,
      role: 'Principal Engineer',
      company: 'Versant / CNBC',
      note: 'Deliberate return to the technical track through the spinoff — kept architecture judgment current.',
    },
    {
      year: 2026,
      role: 'Senior Manager, Engineering',
      company: 'Versant / CNBC',
      note: 'The synthesis: player-coach role spanning both tracks — a 20-engineer organization across 3 web teams, still hands-on in core architecture.',
    },
  ],
};

export interface BuilderProject {
  title: string;
  category: 'professional' | 'independent' | 'experiment';
  description: string;
  stack: string[];
  status: 'shipped' | 'in-progress' | 'exploring' | 'active' | 'beta-pilot' | 'completed';
  metrics?: Array<{ label: string; value: string }>;
  /** Optional deep-link to a note that documents the work in more depth. */
  link?: { label: string; href: string };
  /** Only shown when the named flag is enabled in FEATURE_FLAGS. */
  featureFlag?: FeatureFlag;
}

/**
 * Selected-work cards. The platform card leads. The AI card describes the work
 * only at the level Versant has disclosed publicly ("AI-powered investing
 * tools" in the next-generation platform); the product specifics wait for the
 * announcement and live outside this repository until then.
 */
export const builderProjects: BuilderProject[] = [
  {
    title: 'CNBC.com Next-Gen Rebuild',
    category: 'professional',
    description:
      'Driving the complete redesign of CNBC.com — architecting and shaping the new UI/UX end to end with a peer engineering manager. I lead the frontend architecture for the AI experiences, lead the team building the video and site experiences, and make sure the whole web behind the page holds up: analytics (Amplitude, Adobe Launch), MPS ad serving, the GraphQL data layer, login and subscriptions, SEO, compliance, and editorial workflows — so what ships is a great end-user experience, not features bolted onto a shell — on the surface Versant’s digital growth strategy rides on.',
    stack: [
      'Isomorphic React',
      'Akamai EdgeWorkers',
      'GraphQL',
      'Micro-Frontends',
      'Amplitude',
      'MPS Ads',
    ],
    status: 'active',
    metrics: [
      { label: 'Experiences', value: 'AI · Video · Site' },
      { label: 'Integrations', value: 'Analytics · Ads · Identity · Subs' },
    ],
  },
  {
    title: 'AI-Powered Investing Tools (Frontend Architecture)',
    category: 'professional',
    description:
      "Leading the frontend architecture for the AI-powered investing tools in CNBC's next-generation platform — the direct-to-consumer bet Versant has described to investors. In financial products, trust is the conversion metric: my work makes non-deterministic model output feel deterministic — frame-buffered streaming, graceful degradation, latency that never shakes a reader’s confidence in the number on screen.",
    stack: ['Streaming UI', 'SSE', 'React', 'HCI'],
    status: 'active',
    metrics: [
      { label: 'Token rendering', value: '60 fps' },
      { label: 'Interface', value: 'Deterministic' },
    ],
    link: {
      label: 'Read the architecture note',
      href: '/blog/decoupling-state-from-render-in-llm-streaming',
    },
  },
  {
    title: 'Infrastructure & Privacy Separation',
    category: 'professional',
    description:
      'When the corporate spinoff needed CNBC’s digital business to stand alone, I directed the 4-month, 3-team sprint that made it real: video streaming, analytics, and privacy services migrated off the parent company with zero downtime — compliance obligations met, no revenue interruption, no user-visible seam.',
    stack: ['GCP', 'Zero Downtime', 'GDPR/CCPA Compliance', 'Cloud Architecture'],
    status: 'completed',
    metrics: [
      { label: 'Teams Coordinated', value: '3' },
      { label: 'Downtime', value: 'Zero' },
    ],
  },
  {
    title: 'OB1: Personal Exocortex',
    category: 'independent',
    description:
      'The leverage behind everything else I ship: books, engineering sources, and production lessons distilled into 740+ atomic, cross-linked claims, searchable by meaning and exposed to my AI tools over MCP. Every agent I delegate to starts with my accumulated judgment instead of a blank context window — which is how one player-coach compounds instead of burning out.',
    stack: ['MCP', 'Embeddings', 'Semantic Search', 'TypeScript'],
    status: 'shipped',
    metrics: [
      { label: 'Atomic Claims', value: '740+' },
      { label: 'Agent Access', value: 'MCP' },
    ],
  },
  {
    title: 'Cost-Guard: FinOps Platform',
    category: 'experiment',
    description:
      'Cost discipline as a shipped system, not a spreadsheet: local-first cloud cost monitoring (PGlite + ElectricSQL) with zero-latency reads, real-time sync, and what-if simulations for infrastructure spend, fed by a signed ingestion API on GCP Cloud Run. Built end to end with AI-assisted development — the same governed workflow I set for my org, proven on my own infrastructure.',
    stack: ['SvelteKit', 'PGlite', 'ElectricSQL', 'GCP Cloud Run', 'Pulumi'],
    status: 'in-progress',
    metrics: [
      { label: 'Sync', value: 'Real-time' },
      { label: 'Storage', value: 'Local-first' },
    ],
  },
];

export interface NarrativeBio {
  title: string;
  paragraphs: string[];
}

export const narrativeBio: NarrativeBio = {
  title: 'Player-coach by design',
  paragraphs: [
    'What the business gets from me is both tracks at once. Over nine years at CNBC I deliberately crossed the line most engineers pick a side of — senior engineer, then engineering manager, then back to Principal Engineer to keep my architecture judgment current, now Senior Manager, Engineering for CNBC Core. The payoff for the organization: I direct a 20-engineer organization across 3 web teams rebuilding CNBC.com, and because I still architect and ship alongside them, technical decisions get made in the room — no translation layer between strategy and the codebase, no architecture that drifts from what the teams can actually deliver.',
    'As AI Integration Lead I turned AI adoption from individual experimentation into an organizational capability: standards and PR quality gates (SonarQube, lint, Jest test automation) governing how 20+ engineers use tools like Cursor in production code — measurable velocity gains with fewer high-severity defects, inside the security and compliance guardrails a financial-media business actually has to honor. The org ships faster because the review bar got stronger, not looser.',
    'Outside the codebase I am a long-distance runner — a 3:07 marathon and a 50K ultra — and the same discipline carries into multi-year technical transformations.',
  ],
};

export interface SocialDescriptions {
  /** Used for both <meta name="description"> and og:description. */
  meta: string;
  twitter: string;
}

/** Human-facing social/meta copy; the agent layer (JSON-LD, llms.txt) tells the same story. */
export const socialDescriptions: SocialDescriptions = {
  meta: 'Senior Manager, Engineering at Versant (CNBC Core). Player-coach leading 20 engineers through the next-gen CNBC.com rebuild: edge, video, governed AI.',
  twitter:
    'Senior Manager, Engineering at Versant (CNBC Core). Player-coach engineering leader: edge architecture, video, and governed AI for a national financial audience.',
};

export interface PersonaItem {
  title: string;
  body: string[];
}

/** Operating principles shown beside the code standards in "How I work". */
export const personaData: PersonaItem[] = [
  {
    title: 'Latency Is the Enemy of Trust',
    body: [
      "Whether it's a financial ticker during a market spike or a UI transition on a slow network, delay creates doubt — and doubt is churn. Every millisecond removed is a unit of audience confidence restored.",
      'Operationally that means standards, budgets, and repeatability over one-off heroics: UI production run like manufacturing, not craftsmanship.',
    ],
  },
  {
    title: 'The Bridge',
    body: [
      "I operate at the intersection of Product and Engineering. I don't build to spec — I partner with product leaders to define what is technically possible at scale.",
      'I translate edge configuration into business value, connect latency improvements to revenue impact, and push back when the roadmap is wrong — engineering earns its seat by speaking the business’s language.',
    ],
  },
];

export interface FooterManifestoItem {
  title: string;
  body: string;
}

/** Footer manifesto blurbs — the single source for TelemetryFooter's grid. */
export const footerManifesto: FooterManifestoItem[] = [
  {
    title: 'Latency Is the Enemy of Trust',
    body: 'Performance is a feature, not an afterthought. The critical rendering path is the product; I architect for it first.',
  },
  {
    title: 'URL > Store',
    body: 'The URL is the only reliable single source of truth. I prefer URL-driven state to eliminate desynchronization bugs.',
  },
  {
    title: 'WET > DRY',
    body: 'I value strategic duplication over premature, leaky abstractions. Clarity and composition beat complex "God Components."',
  },
  {
    title: 'Server > Client',
    body: "I ship HTML, not just JSON — SvelteKit here, Akamai EdgeWorkers at work — and optimize for the browser's critical rendering path.",
  },
];

export interface CodeStandard {
  key: string;
  title: string;
  bad: string;
  good: string;
  note: string;
}

export interface CodeStandards {
  standards: Record<string, CodeStandard>;
}

export const codeStandards: CodeStandards = {
  standards: {
    state: {
      key: 'state',
      title: 'URL > Store',
      bad: `// ❌ The "Sync" Trap
const [filter, setFilter] = useState('all');

// Bug: Not shareable, resets on reload
useEffect(() => {
  fetchData(filter);
}, [filter]);`,
      good: `// ✅ The URL is Truth
const searchParams = useSearchParams();
const filter = searchParams.get('filter') ?? 'all';

// The UI is just a reflection of the URL
const data = useQuery(['items', filter]);`,
      note: "If the user can't share the state via a URL, the state shouldn't exist.",
    },
    dry: {
      key: 'dry',
      title: 'WET > DRY', // Write Everything Twice > Don't Repeat Yourself
      bad: `// ❌ The "Universal" Button
// Starts simple, eventually handles 50 edge cases
const Button = ({ 
  isPrimary, isSecondary, isLink, isLoading, 
  hasIcon, iconPos, ...props 
}) => {
  if (isLink) return <a ... />;
  return (
    <button className={isPrimary ? 'red' : 'blue'}>
       {isLoading ? <Spinner /> : props.children}
    </button>
  );
}`,
      good: `// ✅ Decoupled & Composable
// Duplication is cheaper than the wrong abstraction.

const PrimaryButton = ({ children, ...props }) => (
  <button className="bg-blue-500 text-white" {...props}>
    {children}
  </button>
);

const LinkButton = ({ href, children }) => (
  <a href={href} className="text-blue-500 underline">
    {children}
  </a>
);`,
      note: 'The wrong abstraction is far more expensive to fix than a little duplication.',
    },
    server: {
      key: 'server',
      title: 'SERVER > CLIENT',
      bad: `// ❌ The Network Waterfall
// The user stares at a spinner while JS loads, 
// then executes, then fetches.
function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/user').then(setUser);
  }, []);

  if (!user) return <Spinner />;
  return <Profile user={user} />;
}`,
      good: `// ✅ Zero-Bundle Data Access
// Data is ready before the HTML even hits the browser.

export default async function Dashboard() {
  const user = await db.user.findFirst();

  return <Profile user={user} />;
}
// No useEffect. No spinners. No client JS.`,
      note: 'Shift the heavy lifting to the server. Send HTML, not JSON.',
    },
    latency: {
      key: 'latency',
      title: 'LATENCY > TRUST',
      bad: `// ❌ The Performance Afterthought
// "We'll optimize it later." Nobody ships "later."

const Page = async () => {
  const hero   = await fetchHeroImage();    // 800ms
  const ticker = await fetchMarketData();   // 600ms
  const news   = await fetchTopStories();   // 400ms
  // Total: 1800ms. On a slow network: 3s+.
  return <Layout hero={hero} ticker={ticker} news={news} />;
};`,
      good: `// ✅ Parallel at the Edge
// Every blocking ms costs user trust. Eliminate it.

const Page = async () => {
  const [hero, ticker, news] = await Promise.all([
    fetchHeroImage(),    // All three
    fetchMarketData(),   // fire at
    fetchTopStories(),   // the same time.
  ]);
  // Total: 800ms (the slowest one). Not 1800ms.
  return <Layout hero={hero} ticker={ticker} news={news} />;
};`,
      note: 'If the UI stutters, the user disengages. Latency is not a technical problem — it is a trust problem.',
    },
    ai: {
      key: 'ai',
      title: 'PLAN-FIRST AI',
      bad: `// ❌ The Vibe Coder
// 1. Code doesn't work.
// 2. Paste error into Claude.
// 3. Accept whatever it generates.
// 4. Hope it doesn't break prod.
// 5. Repeat.

// This is not AI-augmented engineering.
// This is technical debt generation at scale.`,
      good: `// ✅ The Orchestrator
// 1. Define the spec (types, contracts, edge cases).
// 2. Prompt with full context, not just the error.
// 3. Review every line. Understand every diff.
// 4. Run tests. Check coverage. Verify intent.

// Rule: If you can't explain what it wrote,
// you don't own the code — it does.`,
      note: 'AI is a force multiplier, not a replacement for taste. Every AI-assisted commit must pass the same review bar as a human-written one.',
    },
  },
};
