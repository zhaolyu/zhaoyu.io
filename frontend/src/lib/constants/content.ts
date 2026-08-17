/**
 * Content constants for landing page
 */

import { FEATURE_FLAGS, type FeatureFlag } from '$lib/constants/config';

export interface HeroContent {
  badge: string;
  headline: {
    primary: string;
    accent: string;
  };
  bio: string;
  cta: {
    primary: string;
    secondary: string;
  };
  motto: string[];
}

/**
 * The subset of FEATURE_FLAGS the positioning builders read. Narrow and
 * partial so a test can name only the flag under test, and so adding an
 * unrelated flag can't break these call sites.
 */
export type PositioningFlags = { goLoudPositioning?: boolean };

const CTA = {
  primary: 'View Selected Work',
  secondary: 'Read My AI Thesis',
} as const;

const MOTTO = ['Low Latency', 'High Leverage', 'Deep Focus'];

/** Shared across both positioning states — the title is a fact, not a stance. */
const HERO_BADGE = 'SENIOR MANAGER, ENGINEERING · VERSANT · CNBC WEB & MAKE IT';
const HERO_PRIMARY = 'Leading CNBC Web & Make It.';

/** Quieter default: describes scope without leading on surface ownership. */
const stealthHero: HeroContent = {
  badge: HERO_BADGE,
  headline: {
    primary: HERO_PRIMARY,
    accent: 'Player-Coach: Platform Architecture, Core Video & AI Governance.',
  },
  bio: 'Senior Manager, Engineering across CNBC Web & Make It divisions—directing a 20-engineer organization executing the platform rebuild of CNBC.com ($50–55M ARR, 170K+ subscribers), while staying hands-on in core architecture. Nine years of performance-first engineering: Isomorphic Akamai Edge for 50M+ monthly users, 1.1s LCP, zero-downtime infrastructure migrations, and governed AI integration.',
  cta: CTA,
  motto: MOTTO,
};

/** Go-loud variant — see FEATURE_FLAGS.goLoudPositioning and docs/launch-checklist.md. */
const goLoudHero: HeroContent = {
  badge: HERO_BADGE,
  headline: {
    primary: HERO_PRIMARY,
    accent: 'I own the platform, video, and AI surfaces a financial audience runs on.',
  },
  bio: "Senior Manager, Engineering across CNBC Web & Make It divisions — directing a 20-engineer organization across 3 web teams through the platform rebuild of CNBC.com ($50–55M ARR, 170K+ subscribers). Sole frontend architect of CNBC's AI financial assistant, shipped to a 200-subscriber beta cohort; lead the team shipping CNBC's next-gen web video experience. Nine years of performance-first engineering underneath it: Isomorphic Akamai Edge, 50M+ monthly users, 1.1s LCP.",
  cta: CTA,
  motto: MOTTO,
};

/**
 * `flags` is injectable so both positioning states are assertable in tests;
 * production callers use the exported `heroContent` below. Same pattern as
 * `visibleItems` in $lib/utils/feature-flags.
 */
export function buildHeroContent(flags: PositioningFlags = FEATURE_FLAGS): HeroContent {
  return flags.goLoudPositioning ? goLoudHero : stealthHero;
}

export const heroContent: HeroContent = buildHeroContent();

export interface PerformanceMetric {
  label: string;
  value: string;
  sublabel: string;
}

export const performanceMetrics: PerformanceMetric[] = [
  { label: 'LCP', value: '1.1s', sublabel: 'CNBC.com · Top 1%' },
  { label: 'Monthly Users', value: '50M+', sublabel: 'CNBC Reach' },
  { label: 'Akamai TTFB', value: '<300ms', sublabel: 'EdgeWorkers · Global' },
  { label: 'Cache Hit Rate', value: '98.4%', sublabel: 'Akamai Edge Layer' },
  { label: 'Production Years', value: '9+', sublabel: 'Shipped at Scale' },
  { label: 'Core Web Vitals', value: 'Top 1%', sublabel: 'Lighthouse Score' },
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
        'Architected the migration of CNBC.com from a legacy client-side monolith to a high-performance Isomorphic Akamai Edge architecture. Business and rendering logic moved to Akamai EdgeWorkers — executing at the network edge, not origin. The result: <300ms global TTFB and a 1.1s LCP during market-moving events with 50M+ concurrent users and zero downtime.',
      tags: ['Isomorphic React', 'Akamai EdgeWorkers', 'High Scale', 'Performance'],
      metrics: [
        { label: 'LCP (TOP 1%)', value: '1.1s' },
        { label: 'AKAMAI TTFB', value: '<300ms' },
      ],
      diagram: 'migration-arch',
    },
    {
      title: 'CNBC AI Insight Engine',
      description:
        "Non-deterministic output requires deterministic UI. Engineered the frontend architecture for CNBC's first user-facing AI assistant — currently a 200-subscriber beta pilot, not a site-wide surface — solving the HCI paradox of maintaining user trust when data is streaming and non-deterministic. Built a latency masking layer for token rendering at 60fps and a real-time citation engine that maps AI-generated tokens to verified CNBC sources.",
      tags: ['React', 'Akamai Edge', 'Generative AI', 'HCI'],
      metrics: [
        { label: 'LATENCY MASKING', value: '60 FPS' },
        { label: 'CITATION ENGINE', value: 'Real-time' },
      ],
      diagram: 'ai-state-machine',
      featureFlag: 'showCnbcAiWork',
    },
  ],
};

export interface ExperienceItem {
  name: string;
  type: 'org' | 'tech';
}

export interface ExperienceData {
  items: ExperienceItem[];
}

export const experienceData: ExperienceData = {
  items: [
    // ORGANIZATIONS (The Authority)
    { name: 'NBCUNIVERSAL', type: 'org' },
    { name: 'NBC NEWS', type: 'org' },
    { name: 'VERSANT', type: 'org' },
    { name: 'CNBC', type: 'org' },

    // --- THE UI FOUNDATION ---
    { name: 'REACT', type: 'tech' },
    { name: 'NEXT.JS', type: 'tech' },
    { name: 'TYPESCRIPT', type: 'tech' },
    { name: 'TAILWIND', type: 'tech' },

    // --- THE PERFORMANCE & DATA LAYER (The "Principal" Edge) ---
    { name: 'AKAMAI', type: 'tech' },
    { name: 'SVELTE', type: 'tech' },
    { name: 'NODE.JS', type: 'tech' },
    { name: 'GRAPHQL', type: 'tech' },
    { name: 'MONGODB', type: 'tech' },

    // --- AI & BUILDER SIGNALS ---
    { name: 'CURSOR', type: 'tech' },
    { name: 'CLAUDE CODE', type: 'tech' },
    { name: 'PGLITE', type: 'tech' },
    { name: 'PYTHON', type: 'tech' },
  ],
};

export interface EngineeringNote {
  slug: string;
  title: string;
  /** Display date, e.g. "Jul 2026" */
  date: string;
  /** ISO 8601 date (YYYY-MM) for schema.org datePublished */
  dateISO: string;
  tags: string[];
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
      date: 'Aug 2026',
      dateISO: '2026-08',
      tags: ['System Prompt Architecture', 'LLM Mechanics', 'AI Engineering'],
      content: [
        "Production system prompts bloat by a predictable mechanism. The model does something wrong, so you add an instruction telling it not to — and when that doesn't stick, you add a more forcefully worded one. <code>NEVER do X.</code> In capitals. With exclamation points. Salesforce found this same escalation across 20,000 enterprise agent deployments, and found it does not work: <strong>an LLM does not process typographic emphasis the way a human reader does.</strong> Capitalization and punctuation are just more tokens, not a signal that reliably overrides competing considerations during generation. So the instruction fails again, another one gets appended, and the prompt accumulates. I took one production prompt from roughly 4,000 words to roughly 1,300 and it got <em>more</em> reliable, not less — which is only surprising if you believed the length was buying compliance in the first place.",
        "What actually carries a constraint is position, not volume. Attention has a measurable front-and-back bias: RoPE, the positional encoding most current models use, decays in a way that puts tokens far from both ends of the sequence into a systematically lower-attention zone, and retrieval accuracy for a fact placed mid-context drops by over 30% compared to the same fact at the start or end. A constraint's <em>location</em> is load-bearing in a way its wording is not. So the rewrite was tiered rather than shortened: identity and non-negotiable constraints at the edges, task detail in the middle, and reinforcement anchors placed to survive attention decay across a long multi-turn conversation rather than only the first exchange. The other half of the compression was subtraction — Salesforce's corollary is that <strong>anything you can draw as a flowchart belongs in code, not in a prompt</strong>, because code executes identically every time and no wording does. A context window is an attention budget for the run, not a junk drawer for everything that once went wrong.",
      ],
    },
    {
      slug: 'the-agent-run-is-the-new-unit-of-work',
      title: 'The Agent Run Is the New Unit of Work — and Reviewing It Is Management',
      date: 'Jul 2026',
      dateISO: '2026-07',
      tags: ['Agent Architecture', 'Engineering Management', 'AI Engineering'],
      content: [
        "The genuinely new moment in AI-assisted engineering is not the chat answer — you watched that get produced and judged it in real time. It's when an agent comes back with <em>finished work</em>: it read the folder, edited the files, ran the commands, and declares itself done. You did not do the work and did not watch every step, so you cannot know which assumptions it made or which shortcut it took because the shortcut made the output look cleaner. The only question left is: <strong>is it real?</strong> The first time this happens it feels like magic. The tenth time it feels like management — because that is what it is: supervising labor you did not perform. I manage 20 engineers across 3 web teams, and the skills that job demands — scoping delegation, setting a review bar, calibrating trust per worker — are now individual-contributor skills too.",
        "Management needs a unit of account, and session-level thinking is the wrong one. The right unit is the <strong>agent run</strong>: it begins at delegation, contains the tool calls, branches, and corrections, and ends in acceptance or rejection. That framing makes the work measurable — completion rate, correction rate, and whether your approval gates ever actually reject anything (a gate that always approves is not a control, it's theater). It also surfaces a free asset: every correction you make to agent output is a labeled evaluation you wrote by acting, the natural test set for the next run. This is the same discipline as my receipts rule — <code>done</code> without an attached artifact is self-attestation by the party most motivated to claim success. Getting the machine to do the work is the easy part now. <strong>Deciding the work is trustworthy is the job.</strong>",
      ],
    },
    {
      slug: 'agents-degrade-quietly-maintenance-is-where-value-compounds',
      title: 'Agents Degrade Quietly: Maintenance Is Where the Value Compounds',
      date: 'Jul 2026',
      dateISO: '2026-07',
      tags: ['Agent Architecture', 'Reliability', 'Engineering Management'],
      content: [
        'Building an agent produces a visible artifact — there was nothing, now there is a working agent — so it reads as progress. Maintaining one produces no artifact; at best, nothing happens. So effort flows to building, and the felt value inverts the real value. A well-built agent nobody maintains degrades on a schedule: its context sources go stale, its permissions drift wider than its job, its instructions calcify into a patch pile. A modestly-built agent someone reviews weekly <strong>compounds</strong> — each pass prunes a failure mode and sharpens the job. This is the oldest lesson in operations wearing a new costume: prevented loss is invisible, which is why nobody celebrates the on-call review that kept the incident from existing.',
        "The corrective is ownership, and it decomposes into four responsibilities I now require for any agent near production work: <strong>define the job narrowly</strong> (a vague agent is an unowned agent waiting to happen); <strong>curate the diet</strong> — what it reads, which examples it learns from, including rejected outputs so it learns what <em>not</em> to do; <strong>manage permissions proportional to stakes</strong> — draft-only and write-access are different categories, and write access is earned inside a narrow job, not granted because a demo looked good; and <strong>run the review loop</strong>, where one-off failures get fixed at the output level but recurring failures get fixed at the system level. Team agents fail by tragedy of the commons — the pain is collective, the maintenance is nobody's job — so the owner follows the work. <strong>An agent is not a feature you ship. It is a service you operate.</strong>",
      ],
    },
    {
      slug: 'spec-quality-is-the-bottleneck-not-implementation-speed',
      title: 'Spec Quality Is the Bottleneck Now, Not Implementation Speed',
      date: 'Jul 2026',
      dateISO: '2026-07',
      tags: ['AI Engineering', 'Agent Architecture', 'Specification'],
      content: [
        "The industry is measuring AI-assisted development with the wrong unit of analysis. Code-generation speed is the vanity metric; the METR result everyone cites — experienced developers who <em>felt</em> 20% faster while measuring slower — isn't evidence that AI doesn't work, it's evidence that implementation speed was never the constraint. When agents can produce working code from any sufficiently precise description, the bottleneck moves upstream to the description itself. StrongDM's autonomous pipeline runs on 6,000+ lines of behavioral specification — and that corpus, not the generated code, is the engineering artifact. <strong>The specification becomes the primary artifact; the codebase is a derivative</strong> — closer to a build output than to source.",
        'Building production systems with Cursor and Claude Code has restructured where my own hours go. My leverage stopped correlating with how fast I can type and started correlating with how precisely I can state three things: the goal, the boundary, and what "done" has to prove. The human stays at the two endpoints — specification in, satisfaction judgment out — and everything between is increasingly the machine\'s. This also explains why AI amplifies experts instead of equalizing them: it equalizes execution speed, but execution was already cheap. What it amplifies is specification quality, and specification quality is a direct function of domain depth. If the agent keeps disappointing you, the uncomfortable first question is no longer about the model — it\'s whether you actually specified the thing you wanted.',
      ],
    },
    {
      slug: 'agent-failures-are-loop-failures',
      title: 'Agent Failures Are Loop Failures, Not Intelligence Failures',
      date: 'Jul 2026',
      dateISO: '2026-07',
      tags: ['Agent Architecture', 'Reliability', 'Distributed Systems'],
      content: [
        "Every agent failure I've debugged this year decomposes the same way. The agent didn't lack intelligence — the loop lacked definition. It wandered out of scope because no boundary was stated. It \"finished\" without finishing because nothing defined what done has to prove. Two agents double-executed the same task because nothing marked it claimed. These are Tuesday failures, and none of them are fixed by a smarter model, because <strong>smartness cannot supply a fact that was never specified</strong>. A run an agent can actually be held to has five parts: a goal, a boundary, tools, artifacts, and receipts. Miss one and you haven't delegated work — you've made a wish.",
        'The good news: distributed systems solved these coordination problems decades ago, we just have to notice the mapping. A visible <code>CLAIMED</code> state on a task is a lease, revalidated when the worker returns. "Done" without an attached receipt is self-attestation by the party with the strongest incentive to declare success — so the receipt (the diff, the test run, the artifact link) is non-negotiable, the same way you require an acknowledgement instead of trusting a fire-and-forget write. And the issue tracker you already run is the natural control plane: it has owners, statuses, comments, links, and history built in. <strong>Reliability is engineered into the loop, not summoned from the model.</strong> Make the loop less ambiguous before you ask for a smarter agent.',
      ],
    },
    {
      slug: 'why-i-made-this-site-readable-by-machines-not-just-humans',
      title: 'Why I Made This Site Readable by Machines, Not Just Humans',
      date: 'Jul 2026',
      dateISO: '2026-07',
      tags: ['AI Engineering', 'SEO', 'Structured Data'],
      content: [
        "Recruiters and hiring pipelines increasingly route through an AI agent before a human ever opens a tab. A portfolio site built only for a person scrolling and reading is now serving half its actual audience. So I added the other half: an <code>llms.txt</code> at the site root — a plain-text summary of who I am and what I've built, structured for a language model's context window rather than a browser's rendering engine — JSON-LD <code>Person</code> schema on every page, and real canonical URLs for these notes at <code>/blog/{slug}</code> instead of leaving them buried as anchors inside one long scrolling page. Same content, now individually addressable, cacheable, and citable.",
        "The more interesting find while doing this wasn't a feature, it was a bug. My static-site adapter's SPA fallback page and the prerendered root route both wanted the filename <code>index.html</code>, and the fallback was winning the write — silently replacing the real homepage (title, description, Open Graph tags, all of it) with an empty shell at build time. Every crawler and every link preview had been getting nothing. The fix was a one-line rename, but the lesson generalizes: <strong>a static site's build output is not implied by its source — verify what actually ships</strong>, especially at the config layer nobody re-reads after initial setup.",
      ],
    },
    {
      slug: 'the-three-tiers-of-using-ai-and-why-only-two-matter-now',
      title: 'The Three Tiers of Using AI, and Why Only Two of Them Still Differentiate You',
      date: 'Jul 2026',
      dateISO: '2026-07',
      tags: ['AI Engineering', 'Agent Architecture', 'Career'],
      content: [
        'There\'s a real difference between using AI as a faster typist — autocomplete, chat-assisted edits, "fix this bug for me" — and delegating a bounded unit of work to an agent that plans, executes across multiple files, and hands you a diff to review. The first tier is now table stakes; every engineer I work with has a model open in a side pane, and it stopped being a differentiator the moment it became the default. The tiers above it — an agent working a scoped task end-to-end, or several agents running in parallel with their own permission boundaries — are where the actual leverage still lives, because almost nobody has restructured how they delegate work to get there.',
        'As the person who sets AI-adoption standards for my org, I spend almost none of my time on prompting technique. I spend it on the guardrails: what an agent can touch unsupervised, what requires a human review gate before it ships, and what "done" has to prove before I believe it. This site\'s agent-readable rewrite — the notes, the structured data, the build-output bug above — was built the same way: scoped to specific files, verified against the existing type-check, lint, test, and build gates before anything shipped, with the plan surfaced for review rather than pushed silently. <strong>"I use AI" stopped being the differentiator. Whether you can hand an agent a boundary and a review bar — instead of still typing every line yourself — is the one that\'s left.</strong>',
      ],
    },
    {
      slug: 'building-with-ai-the-compound-advantage',
      title: 'Building with AI: The Compound Advantage',
      date: 'Feb 2026',
      dateISO: '2026-02',
      tags: ['AI Engineering', 'Productivity', 'Meta'],
      content: [
        "I built most of this site using Claude Code. Not as a novelty — as a deliberate workflow. The components you're reading, the type errors that blocked deployment, the engineering notes you're reading: almost all of it happened through a tight loop of prompting, reviewing, and committing. My job was taste and judgment, not keystrokes.",
        "The thing I didn't expect was the <em>qualitative</em> shift, not just the speed. When implementation cost drops low enough, you stop filtering ideas at the \"is this worth building?\" stage. You just build. The compounding isn't in the individual tasks — it's in the number of experiments you run. An engineer who ships 10 experiments a week learns differently than one who ships 2. AI doesn't change what you can build; it changes how many times you can try.",
      ],
    },
    {
      slug: 'sovereign-resilience-why-i-over-index-on-edge-architecture',
      title: 'Sovereign Resilience: Why I Over-Index on Edge Architecture',
      date: 'Jan 2026',
      dateISO: '2026-01',
      tags: ['Architecture', 'Edge Computing', 'Independence'],
      content: [
        "The CNBC architecture I maintain runs at the edge: request handling, personalization logic, and cache invalidation all execute as close to the user as possible. No single region, no single cloud dependency, no single point of failure. When us-east-1 degrades during a market-moving event, traffic routes around it. The system doesn't panic — it degrades gracefully.",
        "I've started applying the same pattern to my own work. A skill portfolio concentrated in one employer, one domain, one team is a <strong>single point of failure</strong>. Redundancy at the edge means building capabilities that can execute independently — full-stack range, local-first tooling, systems you own outright. Not as a hedge against any specific outcome, but because optionality compounds quietly until the moment it matters all at once.",
      ],
    },
    {
      slug: 'idempotency-in-distributed-systems',
      title: 'Idempotency in Distributed Systems',
      date: 'Jan 2026',
      dateISO: '2026-01',
      tags: ['Backend', 'API Design', 'Reliability'],
      content: [
        'Working on live news infrastructure taught me that <strong>failures are not exceptional — they are scheduled</strong>. When a Fed rate decision drops at 2pm, every monitoring system, every analytics pipeline, every content update fires simultaneously. Network partitions happen. Acknowledgements get dropped. The question is never "will this request fail?" — it\'s "what happens when it does?"',
        "Idempotency keys are the answer. The design rule I now apply to every API: <strong>the client should always be able to safely retry.</strong> If handing you the same request twice produces different side effects, the design isn't finished. This matters even more in event-driven systems where the cost of double-processing — a duplicate trade entry, a duplicate webhook delivery, a duplicate analytics event — compounds faster than the failure that triggered the retry.",
      ],
    },
    {
      slug: 'the-url-is-the-source-of-truth',
      title: 'The URL is the Source of Truth',
      date: 'Dec 2025',
      dateISO: '2025-12',
      tags: ['Architecture', 'State Management', 'UX'],
      content: [
        'In modern SPAs, we often over-engineer state management stores (Redux, Zustand) for data that belongs in the URL. If a user filters a dashboard by "Status: Active" and refreshes the page, that filter should persist. If they send the link to a colleague, the colleague should see the same filtered view.',
        'If the state is not in the URL, it is ephemeral. My rule of thumb: <strong>If it changes the data payload, it belongs in the query string.</strong> Client-side stores should be reserved for truly transient UI states (like whether a modal is open or a menu is expanded), not for data definition. Nine years on high-traffic news pages gave me the distributed-systems framing for why this keeps being right: URL-as-truth is single-leader replication — one authoritative writer, every view a follower. A constellation of client stores each holding its own copy of the filter is multi-leader replication, and you inherit its signature failure mode: divergence with no conflict-resolution story.',
      ],
    },
    {
      slug: 'decoupling-state-from-render-in-llm-streaming',
      title: 'Decoupling State from Render in LLM Streaming',
      date: 'Oct 2025',
      dateISO: '2025-10',
      tags: ['React Performance', 'HCI', '60fps'],
      content: [
        'The naive approach to building an AI chat interface is to connect a Server-Sent Events (SSE) stream directly to a React state setter. Every time a new token chunk arrives (often at sub-50ms intervals), you call <code>setState(prev => prev + chunk)</code>.',
        "<strong>This is a performance trap.</strong> Triggering a reconciliation cycle on every single token blows through the browser's 16ms frame budget. The solution is to decouple ingestion from rendering. We utilized a mutable <code>useRef</code> buffer to capture high-velocity incoming chunks synchronously, then used a throttled flush mechanism (synced with <code>requestAnimationFrame</code>) to commit to the DOM only when the browser was ready to paint.",
      ],
    },
  ],
};

export interface CareerPoint {
  year: number;
  impact: number; // 0-100
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
    { year: 2016, impact: 10, role: 'Intern', company: 'CNBC' },
    { year: 2017, impact: 30, role: 'Software Engineer', company: 'CNBC' },
    { year: 2019, impact: 50, role: 'Senior Engineer', company: 'NBC News' },
    {
      year: 2021,
      impact: 70,
      role: 'Engineering Manager',
      company: 'NBCUniversal',
      note: 'First management tour.',
    },
    {
      year: 2025,
      impact: 90,
      role: 'Principal Engineer',
      company: 'Versant / CNBC',
      note: 'Deliberate return to the technical track through the spinoff — kept architecture judgment current.',
    },
    {
      year: 2026,
      impact: 100,
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
 * The platform rebuild card follows the same positioning flag as the hero: the
 * quiet variant describes the scope and the numbers, the loud one adds the
 * video-team leadership — the monetization framing, the surface count, and the
 * product-continuity scope across rotating PMs.
 *
 * The video work stays gated deliberately: the quiet card claims architecture
 * ("core video streaming experiences", "modular player frameworks"), and only
 * the loud variant claims leading the team that ships it. The agent-facing
 * layer (llms.txt, JSON-LD) carries the full picture either way — see
 * docs/launch-checklist.md.
 */
const platformRebuildQuiet =
  'Ground-up rebuild of CNBC.com and core video streaming experiences. Architected modular player frameworks and edge rendering delivering a 1.1s LCP and <300ms TTFB for 50M+ monthly uniques and 170K+ premium subscribers generating $50–55M ARR.';

const platformRebuildLoud = `${platformRebuildQuiet} I lead the team building the video surfaces — the monetization engine of the property — with five in flight across live viewing, on-demand playback with resumable sessions, audience engagement, and notifications, spanning player architecture, playback state, and the delivery path behind them. The team has no dedicated PM; several rotate through per project, and I'm the technical continuity across all of them: shaping and defining the work from feasibility, and carrying it through the dependent-team discussions that keep it moving.`;

function platformRebuildProject(flags: PositioningFlags): BuilderProject {
  const loud = flags.goLoudPositioning === true;

  return {
    title: 'CNBC.com Next-Gen Platform & Video Rebuild',
    category: 'professional',
    description: loud ? platformRebuildLoud : platformRebuildQuiet,
    stack: ['Isomorphic React', 'Akamai EdgeWorkers', 'SSE Real-Time Sync', 'Micro-Frontends'],
    status: 'active',
    metrics: [
      { label: 'Subscriber ARR', value: '$50–55M' },
      loud
        ? { label: 'Product Continuity', value: 'Across rotating PMs' }
        : { label: 'Playback', value: 'Live + VOD' },
    ],
  };
}

/**
 * `flags` is injectable so both positioning states are assertable in tests;
 * production callers use the exported `builderProjects` below.
 */
export function buildBuilderProjects(flags: PositioningFlags = FEATURE_FLAGS): BuilderProject[] {
  return [platformRebuildProject(flags), ...staticBuilderProjects];
}

/** Cards whose copy does not vary with positioning. */
const staticBuilderProjects: BuilderProject[] = [
  {
    title: 'AI Financial Assistant (Architecture Pilot)',
    category: 'professional',
    description:
      "Sole frontend architect and technical bridge for CNBC's first user-facing AI assistant. Spec'd and shipped the multi-step agentic pipeline (query planner → MCP data retrieval → tool grader → response generator) in 4 months to a 200-subscriber beta cohort, establishing the architectural blueprint for future conversational surfaces.",
    stack: ['Multi-Agent Pipeline', 'MCP Integration', 'Tool Grader', 'SSE Streaming'],
    status: 'beta-pilot',
    metrics: [
      { label: 'Beta Cohort', value: '200 Subs' },
      { label: 'Spec → Ship', value: '4 Months' },
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
      'Directed a 4-month cross-functional sprint across 3 teams to fully separate CNBC infrastructure from the parent company, migrating video streaming, analytics, and privacy services with zero downtime.',
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
      'A second brain built for agents, not just for me. Books, engineering sources, and production lessons get distilled into atomic, cross-linked claims — 740+ and compounding — searchable by meaning and exposed to my AI tools over MCP, so every agent session starts with my accumulated judgment instead of a blank context window.',
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
      'Local-first cloud cost monitoring using PGlite + ElectricSQL. Zero-latency reads, real-time sync, and what-if simulations for infrastructure spend, fed by a signed ingestion API on GCP Cloud Run with Pulumi-managed infrastructure. Personal observability tooling built with AI-assisted development.',
    stack: ['SvelteKit', 'PGlite', 'ElectricSQL', 'GCP Cloud Run', 'Pulumi'],
    status: 'in-progress',
    metrics: [
      { label: 'Sync', value: 'Real-time' },
      { label: 'Storage', value: 'Local-first' },
    ],
  },
];

export const builderProjects: BuilderProject[] = buildBuilderProjects();

export interface NarrativeBio {
  title: string;
  paragraphs: string[];
}

/** Go-loud only — see FEATURE_FLAGS.goLoudPositioning and docs/launch-checklist.md. */
const surfaceOwnershipParagraph =
  "Today that means owning both ends of the strategic surface area: I was the sole frontend architect for CNBC's AI financial assistant — now validated with a 200-subscriber beta cohort — and I lead the team shipping the next-generation video experience, the property's revenue engine.";

/**
 * `flags` is injectable so both positioning states are assertable in tests;
 * production callers use the exported `narrativeBio` below.
 */
export function buildNarrativeBio(flags: PositioningFlags = FEATURE_FLAGS): NarrativeBio {
  return {
    title: 'The Modernizer',
    paragraphs: [
      "My career began as a web developer intern at CNBC, and over nine years it has deliberately crossed the two tracks most engineers pick between: senior engineer, then engineering manager, then back to the technical track as Principal Engineer — a choice, not a detour, made to keep my architecture judgment current — and now Senior Manager, Engineering across CNBC Web & Make It. The role is the synthesis of both tracks: I direct a 20-engineer organization across 3 web teams executing the platform rebuild of CNBC.com, while still architecting and shipping alongside them. Player-coach by design, because I've done both jobs on their own.",
      ...(flags.goLoudPositioning ? [surfaceOwnershipParagraph] : []),
      'As AI Integration Lead, I formalize the standards and PR quality gates (SonarQube, lint, Jest test automation) governing how 20+ engineers across 3 web teams integrate AI tools like Cursor into production codebases, delivering a 25% velocity increase and 15% fewer high-severity defects. The philosophy underneath it is "Plan-first" execution — AI as a disciplined velocity multiplier inside strict security and compliance guardrails, never as an unreviewed author.',
      'Outside of architecting enterprise systems or building developer tools like Cost-Guard, I am a competitive long-distance runner. I believe the endurance and discipline required to complete a 50k ultramarathon are the same traits needed to lead complex, multi-year technical transformations.',
    ],
  };
}

export const narrativeBio: NarrativeBio = buildNarrativeBio();

export interface SocialDescriptions {
  /** Used for both <meta name="description"> and og:description. */
  meta: string;
  twitter: string;
}

/**
 * Human-facing social/meta copy. Follows the positioning flag; the
 * agent-facing layer (JSON-LD, llms.txt) deliberately does not — see
 * docs/launch-checklist.md.
 */
export function buildSocialDescriptions(
  flags: PositioningFlags = FEATURE_FLAGS,
): SocialDescriptions {
  return flags.goLoudPositioning
    ? {
        meta: "Senior Manager, Engineering at Versant (CNBC Web & Make It). Sole frontend architect of CNBC's AI financial assistant (200-subscriber beta pilot); lead the next-gen web video platform. 20-engineer org, 50M+ users, 1.1s LCP.",
        twitter:
          'Senior Manager, Engineering at Versant (CNBC Web & Make It). AI financial assistant architecture, next-gen web video, and edge performance at 50M+ users.',
      }
    : {
        meta: 'Senior Manager, Engineering at Versant (CNBC Web & Make It) — directing a 20-engineer organization through the platform rebuild of CNBC.com, while staying hands-on in core architecture. 50M+ users, 1.1s LCP.',
        twitter:
          'Senior Manager, Engineering at Versant (CNBC Web & Make It). Player-coach engineering leader, AI governance lead, and independent builder, shipping at scale.',
      };
}

export interface PersonaItem {
  title: string;
  body: string[];
}

export const personaData: PersonaItem[] = [
  {
    title: 'The Engineering Philosophy',
    body: [
      "Latency is the enemy of trust. Whether it's a financial ticker during a market spike or a UI transition on a slow network, delay creates doubt. Every millisecond removed is a unit of confidence restored.",
      'The UI Factory model is the operational expression of this: treat UI production like manufacturing, not craftsmanship. Standards, budgets, and repeatability over one-off heroics.',
    ],
  },
  {
    title: 'The Bridge',
    body: [
      "I operate at the intersection of Product and Engineering. I don't build to spec — I partner with product leaders to define what is technically possible at scale.",
      'I translate Akamai EdgeWorker configurations into business value, connect latency improvements to revenue impact, and push back when the roadmap is wrong.',
    ],
  },
  {
    title: 'Endurance Engineering',
    body: [
      'Off the clock, I trade latency metrics for endurance miles. I apply the same optimization mindset to running as I do to code: instrument everything, reduce friction, compound marginal gains.',
      'A 3:07 marathon, a 50K ultra finish, and a sub-1:25 half in the crosshairs. The discipline carries.',
    ],
  },
  {
    title: 'The Search for the Gold Standard',
    body: [
      "I'm drawn to systems that prioritize precision and craft. In NYC, that means chasing the best Japanese food — Omakase, Kaiseki, the obsession with quality over volume.",
      'In markets, it means studying equity structures and the secondary dynamics of Pokémon TCG as a lens for value, scarcity, and liquidity. I enjoy the game theory of high-value systems wherever I find them.',
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
    body: 'Performance is a feature, not an afterthought. I architect for a 1.1s LCP at a global scale of 50M+ users.',
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
    body: "I leverage SvelteKit and Akamai EdgeWorkers to ship HTML, not just JSON. I optimize for the browser's critical rendering path.",
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
