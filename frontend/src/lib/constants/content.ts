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
}

/**
 * The role line, kept off the hero on purpose: it lives on the finding-aid
 * surfaces (OG card eyebrow, <title>, meta, JSON-LD, llms.txt) and in About.
 */
export const roleLine = 'SENIOR MANAGER, ENGINEERING · VERSANT · CNBC CORE';

/**
 * Hero copy. Craft-first: the page leads with the writing and the standard it
 * holds itself to, not the résumé. Role and scope are stated once, in About,
 * and on the agent-facing surfaces. The headline (primary + accent) is held
 * to 40 words by positioning.test.ts; the bio carries at most one figure.
 */
export const heroContent: HeroContent = {
  headline: {
    primary: 'Engineering notes with receipts.',
    accent:
      'Mental models from ten years of building CNBC.com: agents, edge architecture, reliability.',
  },
  tagline:
    'Engineering notes with receipts: agents, edge architecture, and the mental models that survive production.',
  bio: "I'm an engineering manager who still ships, and this site is where I write down what production teaches me. Every claim carries a receipt: a number, a named system, or an incident I can point at. If a green check can lie to you, it eventually will; the notes start there.",
  cta: {
    primary: 'Read the Notes',
    secondary: 'View Selected Work',
  },
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
      'U.S. average monthly unique visitors, Sept 2024 to Aug 2025, as reported at Versant Investor Day',
    source: SOURCES.versantInvestorDay2025,
  },
  {
    label: 'p75 LCP',
    value: '1.7s',
    sublabel: 'cnbc.com · CrUX field data',
    basis:
      'Chrome UX Report, all devices, July 2026, with 85% of page loads inside the 2.5s "good" threshold',
    source: SOURCES.cruxCnbc,
  },
  {
    label: 'Direct team',
    value: '8 + 2 QE',
    sublabel: 'CNBC Core · Versant',
    basis:
      'Direct reports as Senior Manager, Engineering; co-leads the ~20-engineer CNBC.com rebuild across 3 teams',
    source: SOURCES.linkedin,
  },
  {
    label: 'Years shipping',
    value: '10+',
    sublabel: 'CNBC · NBC News · NBCUniversal',
    basis:
      'Intern in March 2016 to Senior Manager, Engineering in April 2026, on the same platform',
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
  /**
   * 'note' (default): the two-paragraph corpus form, fully voice-governed.
   * 'essay': long-form with block markup, governed by its own contract in
   * content-voice.test.ts — a lane with no enforced contract would be exactly
   * the fail-open the first essay describes.
   */
  format?: 'note' | 'essay';
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
      slug: 'your-checks-are-lying-to-you',
      title: 'Your Checks Are Lying to You',
      date: 'Aug 30, 2026',
      dateISO: '2026-08-30',
      format: 'essay',
      tags: ['Reliability', 'Verification', 'AI Engineering'],
      sources: [
        {
          label: 'Warren Buffett, Berkshire Hathaway shareholder letter, 2008 · the OFHEO passage',
          href: 'https://www.berkshirehathaway.com/letters/2008ltr.pdf',
        },
        {
          label: 'Will Larson · Agents as scaffolding for recurring tasks (lethain.com)',
          href: 'https://lethain.com/agents-as-scaffolding/',
        },
        {
          label:
            'First-hand: a 24-instance fail-open ledger kept over one month across scripts, CI jobs, and agent pipelines',
        },
      ],
      content: [
        "Run this in any repo with a gating script: <code>./check.sh | head -40; echo $?</code>. If the gate fails, you still see <code>0</code>, because without <code>pipefail</code>, <code>$?</code> is <code>head</code>'s exit status, not the gate's. I measured it on a real gate in my own stack: run directly, exit 1; piped through a pager for readability, exit 0. The gate was correct. The call site threw its verdict away, and everything downstream recorded a pass.",
        'I call this a fail-open check: a check whose “did not run” is indistinguishable from “passed.” Over one month I logged twenty-four named instances in one small stack of scripts, CI jobs, and agent pipelines. Not, I think, because the stack is unusually bad, but because I gave the class a name and started writing instances down.',
        '<h2>Green is ambiguous by construction</h2>',
        'Three from the same month:',
        '<ul><li>A wrapper around a nightly embedding job logged success unconditionally and discarded stderr. The job had been dying mid-batch, at exit 0, behind months of healthy-looking logs.</li><li>A style lint reported clean on its first run because a comment line broke the grep over its own pattern file. Zero banned patterns were matched against anything. The check had not passed; it had not run. The recorded outcome was identical either way.</li><li>A link checker printed every finding to stdout and exited 0. Three downstream consumers read the exit code. None read the text.</li></ul>',
        '<strong>The absence of a result gets recorded as the presence of a lesser one.</strong> A checker has three honest outcomes: found problems, found nothing after actually looking, and could not look. Most tooling gives it two exit states, so “could not look” gets folded into whichever side the error handling happens to land on. When it lands on green, the result is strictly worse than no check at all: a fail-open check produces a false record that closes the question, and the record is what stops anyone from looking again. A missing check, by contrast, is a visible gap. Anyone who asks “what verifies this?” finds nothing and knows the question is open.',
        '<h2>The artifact is the camouflage</h2>',
        'These survive for months because the failure produces an artifact, and the artifact conceals it. A test suite in that same stack wrote its “real build” case to the shipped deliverable instead of a fixture, which makes it an unreviewed production change wearing a green checkmark. Run to confirm an unrelated change was safe, it passed, and in passing silently rebuilt the deliverable against different inputs, evicting real content. Nothing failed, nothing warned; the output was a plausible, well-formed, freshly-dated file.',
        'A curated export, built on a cloud machine, sat in the repo vouching for its build script, but an artifact is not evidence its producer runs <em>here</em>: the script used <code>tomllib</code> (Python 3.11+) against a local 3.9.6 and had never once executed locally. Dead at import. Its own test suite failed 9 of 14 cases the same way, and nobody read past the “5 passed” to ask out of how many.',
        "This is not a tooling quirk; it is how oversight fails generally, because headcount measures effort applied, not failures found. <a href='https://www.berkshirehathaway.com/letters/2008ltr.pdf' target='_blank' rel='noopener'>Buffett's 2008 shareholder letter</a> describes OFHEO, a regulator created to oversee exactly two companies, staffed with more than a hundred people with no other assignment. It published a glowing review of its own first decade and, on Buffett's telling, entirely missed that both companies had spent years misstating their earnings.",
        'The ranking error underneath is universal: crashes and blank fields at the bad end of the severity scale, mostly-correct output at the good end. Ranked by expected damage, the order inverts. A crash routes immediately to a human who now knows something is wrong; the output that looks complete routes to acceptance, consuming exactly the attention budget that would have caught it.',
        '<h2>The sneakiest variant: the check that cannot see the defect</h2>',
        'The instances above fail by not running or not examining. The subtler ones run perfectly, against a scope that excludes the defect.',
        "My own site's CI config carried <code>.github/**</code> in its <code>paths-ignore</code> list, alongside <code>**.md</code> and <code>LICENSE</code>. Reasonable on its face: editing a workflow file doesn't change the application. It meant the one change class able to delete a job, loosen a trigger, or drop a required check was the only class that merged with nothing run against it; a weakened gate and an intact one leave identical clean history, so nothing in the record would ever have surfaced it.",
        'The same scope failure arises with nobody configuring it: a frontmatter parser whose regex read only the <em>first</em> item of every YAML block list computed a health metric over a universe 16% smaller than it claimed, and printed roughly 78% either way. A list API returned the first 20 items with <code>has_more: true</code>, then returned the identical page when handed its own continuation cursor. Nothing consumed the one field that contradicted the roster, and I nearly filed a report that four scheduled jobs had vanished. They were on page two.',
        "And <code>git log --since='7 days ago' --diff-filter=A --name-only</code> on a fresh CI clone reported 1,618 files added that week; the true figure was 32. The clone was shallow, so its boundary commit appeared to add the entire repo at once.",
        'The design-time test for all of these: <strong>if this control were wrong, what would tell me?</strong> If the honest answer is “the same green output I get when it is right,” you do not have a check so much as a green light wired to the wall.',
        '<h2>The field guide</h2>',
        'Rules that have held up, each earned by at least one instance above:',
        "<ol><li><strong>Three outcomes, never two.</strong> Passed / failed / could-not-run, and could-not-run must be loud. This applies per item, too: an input your checker cannot parse must land in <em>undetermined</em>, never in a benign bucket like “no findings.”</li><li><strong>Assert the condition, not the reaching of the line.</strong> Emit success only after verifying the thing you claim, and match the invariant's shape to what consumers depend on. An embedding backfill satisfied its count-shaped post-condition (pending reached zero) while writing the same vector for forty different documents. A count cannot see a content defect.</li><li><strong>Every emitted marker needs a named consumer.</strong> A <code>has_more</code> flag, a truncation marker, a warning line: a signal nobody reads is worse than no signal, because it looks like coverage.</li><li><strong>Test the check against known-dirty input, from the position it actually runs in.</strong> Both checks I wrote to catch this class missed their own motivating cases on first run; only fixtures with known answers caught it. And a detector validated on a laptop can still be unrunnable at its scheduled call site; testing the detector is not testing the detection.</li><li><strong>A control's scope must include the control.</strong> Whatever decides what gets checked (a path filter, a sampling rule, a pagination default) is the best-hidden place for this defect.</li><li><strong>Spend verification on the fix.</strong> The patch that closes a fail-open is itself fresh, unverified check code, written under pressure with attention on the old defect. In my log, remediation builds are where new instances concentrate.</li></ol>",
        "“So write more checks” is the wrong response. The fix for this class is a contract on the checks you have, not a headcount of new detectors, and every new detector is new surface for the same defect. “We have a runbook for this” is worse: a written policy with no enforcing mechanism is not a missing check, it is a fail-open one, occupying the slot where verification would report while readers take its existence as evidence the boundary holds. Often the strongest move is not a better check at all: restructure so the bad output cannot be produced. <a href='https://lethain.com/agents-as-scaffolding/' target='_blank' rel='noopener'>Will Larson describes</a> catching an agent mis-forwarding alerts and, rather than adding an eval he knew would work, moving the filtering into a deterministic script so the agent never sees what it might mishandle. The check would have left the failure mode alive behind a gate; the restructure removed it from the system.",
        'The same month produced two defects I deliberately did not log: they failed <em>closed</em>. Costly, but they never certified a falsehood, and logging them anyway would have blurred what the ledger measures.',
        '<strong>A clean report from a check that cannot say “I could not run” is not evidence of anything. Build checks that cannot fail quietly, or their green eventually becomes the thing that hides the failure they were hired to catch.</strong>',
      ],
    },
    {
      slug: 'agents-re-derive-judgment-you-already-paid-for',
      title: 'Agents Re-Derive Judgment You Already Paid For',
      date: 'Aug 30, 2026',
      dateISO: '2026-08-30',
      tags: ['Agent Architecture', 'AI Engineering', 'Retrieval'],
      sources: [
        {
          label:
            'First-hand: OB1, the retrieval layer over a personal exocortex, at 1,700 claims and 8,281 wiki-links, measured 30 Aug 2026',
        },
      ],
      content: [
        'Every agent session starts from a blank context window, so it re-derives judgment you already paid for. You settle a tradeoff in March; in August an agent proposes the option you rejected, reasoning its way there with full confidence and none of the history. The usual diagnosis is that the model needs memory, and the usual fix is a longer prompt: paste the standing decisions at the top and hope attention holds. Both miss the mechanism: the judgment that bears on a question is rarely lexically close to it. <strong>Risk parity distributing risk rather than capital and capacity-aware load balancing distributing work by headroom share no keywords and the same shape.</strong> BM25 cannot cross that gap, because it scores the words and the transferable part was never in the words.',
        'So the vault of 1,700 claims stays in git, and OB1 projects it into Supabase behind MCP, so Claude, ChatGPT, and my phone all retrieve the same judgment. A claim is one assertable proposition, named by a filename that states it, hand-typed as claim, pattern, tension, or anti-pattern. <strong>Nothing derives that type, which is why it carries judgment</strong>: a thing is an anti-pattern because someone decided it was. Retrieval embeds the query, ranks with pgvector, then expands one hop along the wiki-links, so a claim reached by a <code>parallels</code> edge surfaces even when its similarity is low; 2,777 of the 8,281 edges cross domains, the ones worth the hop. On 15 August a reduce pass was about to generalize a second claim about legibility inverting felt value. Retrieval returned <code>prevented-loss-invisibility</code>, already established on an external source, and the output became an enrichment instead of a duplicate. <strong>The judgment you have to remember to look up is judgment you do not have.</strong>',
      ],
    },
    {
      slug: 'reinforcement-anchors-beat-emphasis-in-system-prompts',
      title: 'Reinforcement Anchors Beat Emphasis: Compressing a Production System Prompt',
      date: 'Aug 14, 2026',
      dateISO: '2026-08-14',
      tags: ['System Prompt Architecture', 'LLM Mechanics', 'AI Engineering'],
      sources: [
        {
          label: 'Salesforce · lessons from 20,000 enterprise agent deployments',
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
        "Production system prompts bloat by a predictable mechanism. The model does something wrong, so you add an instruction telling it not to. When that doesn't stick, you add a more forcefully worded one. <code>NEVER do X.</code> In capitals. With exclamation points. <a href='https://www.salesforce.com/news/stories/ai-lessons-building-enterprise-agents/' target='_blank' rel='noopener'>Salesforce found this same escalation</a> across 20,000 enterprise agent deployments, and found it does not work: <strong>an LLM does not process typographic emphasis the way a human reader does.</strong> Capitalization and punctuation are just more tokens, not a signal that reliably overrides competing considerations during generation. So the instruction fails again, another one gets appended, and the prompt accumulates. I took one production prompt from roughly 4,000 words to roughly 1,300 and it got <em>more</em> reliable, not less. That is only surprising if you believed the length was buying compliance in the first place.",
        "What actually carries a constraint is position, not volume. Attention has a measurable front-and-back bias: <a href='https://arxiv.org/abs/2104.09864' target='_blank' rel='noopener'>RoPE</a>, the positional encoding most current models use, decays in a way that puts tokens far from both ends of the sequence into a systematically lower-attention zone, and <a href='https://arxiv.org/abs/2307.03172' target='_blank' rel='noopener'>retrieval accuracy for a fact placed mid-context drops by more than 20 points</a> compared to the same fact at the start or end. A constraint's <em>location</em> is load-bearing in a way its wording is not. So the rewrite was tiered rather than shortened: identity and non-negotiable constraints at the edges, task detail in the middle, and reinforcement anchors placed to survive attention decay across a long multi-turn conversation rather than only the first exchange. The other half of the compression was subtraction. Salesforce's corollary is that <strong>anything you can draw as a flowchart belongs in code, not in a prompt</strong>, because code executes identically every time and no wording does. A context window is an attention budget for the run, not a junk drawer for everything that once went wrong.",
      ],
    },
    {
      slug: 'the-agent-run-is-the-new-unit-of-work',
      title: 'The Agent Run Is the New Unit of Work, and Reviewing It Is Management',
      date: 'Jul 11, 2026',
      dateISO: '2026-07-11',
      tags: ['Agent Architecture', 'Engineering Management', 'AI Engineering'],
      sources: [
        {
          label:
            'First-hand: reviewing delegated agent output while co-leading a rebuild across 3 web teams',
        },
      ],
      content: [
        "The genuinely new moment in AI-assisted engineering is not the chat answer; you watched that get produced and judged it in real time. It's when an agent comes back with <em>finished work</em>: it read the folder, edited the files, ran the commands, and declares itself done. You did not do the work and did not watch every step, so you cannot know which assumptions it made or which shortcut it took because the shortcut made the output look cleaner. The only question left is: <strong>is it real?</strong> The first time this happens it feels like magic. The tenth time it feels like management, because that is what it is: supervising labor you did not perform. I manage a direct team of ten and co-lead a rebuild across three web teams, and the skills that job demands (scoping delegation, setting a review bar, calibrating trust per worker) are now individual-contributor skills too.",
        "Management needs a unit of account, and session-level thinking is the wrong one. The right unit is the <strong>agent run</strong>: it begins at delegation, contains the tool calls, branches, and corrections, and ends in acceptance or rejection. That framing makes the work measurable: completion rate, correction rate, and whether your approval gates ever actually reject anything (a gate that always approves is not a control, it's theater). It also surfaces a free asset: every correction you make to agent output is a labeled evaluation you wrote by acting, the natural test set for the next run. This is the same discipline as my receipts rule: <code>done</code> without an attached artifact is self-attestation by the party most motivated to claim success. Getting the machine to do the work is the easy part now. <strong>Deciding the work is trustworthy is the job.</strong>",
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
        'Building an agent produces a visible artifact (there was nothing, now there is a working agent), so it reads as progress. Maintaining one produces no artifact; at best, nothing happens. So effort flows to building, and the felt value inverts the real value. A well-built agent nobody maintains degrades on a schedule: its context sources go stale, its permissions drift wider than its job, its instructions calcify into a patch pile. A modestly-built agent someone reviews weekly <strong>compounds</strong>: each pass prunes a failure mode and sharpens the job. This is the oldest lesson in operations wearing a new costume: prevented loss is invisible, which is why nobody celebrates the on-call review that kept the incident from existing.',
        "The corrective is ownership, and it decomposes into four responsibilities I now require for any agent near production work. <strong>Define the job narrowly</strong>: a vague agent is an unowned agent waiting to happen. <strong>Curate the diet</strong>: what it reads, which examples it learns from, including rejected outputs so it learns what <em>not</em> to do. <strong>Manage permissions proportional to stakes</strong>: draft-only and write access are different categories, and write access is earned inside a narrow job, not granted because a demo looked good. And <strong>run the review loop</strong>, where one-off failures get fixed at the output level but recurring failures get fixed at the system level. Team agents fail by tragedy of the commons (the pain is collective, the maintenance is nobody's job), so the owner follows the work. <strong>An agent is not a feature you ship. It is a service you operate.</strong>",
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
          label: 'METR · Measuring the impact of early-2025 AI on experienced developers',
          href: 'https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/',
        },
        {
          label: 'StrongDM · building software with AI in a software factory',
          href: 'https://www.strongdm.com/blog/the-strongdm-software-factory-building-software-with-ai',
        },
        {
          label: 'strongdm/attractor · the public natural-language spec repository',
          href: 'https://github.com/strongdm/attractor',
        },
      ],
      content: [
        "The industry is measuring AI-assisted development with the wrong unit of analysis. Code-generation speed is the vanity metric; <a href='https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/' target='_blank' rel='noopener'>the METR result everyone cites</a> (experienced developers who <em>felt</em> 20% faster while measuring slower) isn't evidence that AI doesn't work, it's evidence that implementation speed was never the constraint. When agents can produce working code from any sufficiently precise description, the bottleneck moves upstream to the description itself. <a href='https://www.strongdm.com/blog/the-strongdm-software-factory-building-software-with-ai' target='_blank' rel='noopener'>StrongDM's autonomous pipeline</a> runs on nearly 6,000 lines of <a href='https://github.com/strongdm/attractor' target='_blank' rel='noopener'>public behavioral specification</a>, and that corpus, not the generated code, is the engineering artifact. <strong>The specification becomes the primary artifact; the codebase is a derivative</strong>, closer to a build output than to source.",
        'Building production systems with Cursor and Claude Code has restructured where my own hours go. My leverage stopped correlating with how fast I can type and started correlating with how precisely I can state three things: the goal, the boundary, and what "done" has to prove. The human stays at the two endpoints, specification in and satisfaction judgment out, and everything between is increasingly the machine\'s. This also explains why AI amplifies experts instead of equalizing them: it equalizes execution speed, but execution was already cheap. What it amplifies is specification quality, and specification quality is a direct function of domain depth. If the agent keeps disappointing you, the uncomfortable first question is no longer about the model. It\'s whether you actually specified the thing you wanted.',
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
        "Every agent failure I've debugged this year decomposes the same way. The agent didn't lack intelligence. The loop lacked definition. It wandered out of scope because no boundary was stated. It \"finished\" without finishing because nothing defined what done has to prove. Two agents double-executed the same task because nothing marked it claimed. These are Tuesday failures, and none of them are fixed by a smarter model, because <strong>smartness cannot supply a fact that was never specified</strong>. A run an agent can actually be held to has five parts: a goal, a boundary, tools, artifacts, and receipts. Miss one and you haven't delegated work. You've made a wish.",
        'The good news: distributed systems solved these coordination problems decades ago, we just have to notice the mapping. A visible <code>CLAIMED</code> state on a task is a lease, revalidated when the worker returns. "Done" without an attached receipt is self-attestation by the party with the strongest incentive to declare success, so the receipt (the diff, the test run, the artifact link) is non-negotiable, the same way you require an acknowledgement instead of trusting a fire-and-forget write. And the issue tracker you already run is the natural control plane: it has owners, statuses, comments, links, and history built in. <strong>Reliability is engineered into the loop, not summoned from the model.</strong> Make the loop less ambiguous before you ask for a smarter agent.',
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
        "A site now has two kinds of reader, and only one of them renders a page. Crawlers, retrieval pipelines, and agents pull the raw document straight into a context window and answer out of it, so a site built only for a person scrolling and reading is serving half of its actual audience. I added the other half: an <code>llms.txt</code> at the site root (a plain-text summary of the site and the work behind it, structured for a language model's context window rather than a browser's rendering engine), JSON-LD <code>Person</code> schema on every page, and real canonical URLs for these notes at <code>/blog/{slug}</code> instead of leaving them buried as anchors inside one long scrolling page. Same content, now individually addressable, cacheable, and citable.",
        "The more interesting find while doing this wasn't a feature, it was a bug. My static-site adapter's SPA fallback page and the prerendered root route both wanted the filename <code>index.html</code>, and the fallback was winning the write, silently replacing the real homepage (title, description, Open Graph tags, all of it) with an empty shell at build time. Every crawler and every link preview had been getting nothing. The fix was a one-line rename, but the lesson generalizes: <strong>a static site's build output is not implied by its source, so verify what actually ships</strong>, especially at the config layer nobody re-reads after initial setup.",
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
        'There\'s a real difference between using AI as a faster typist (autocomplete, chat-assisted edits, "fix this bug for me") and delegating a bounded unit of work to an agent that plans, executes across multiple files, and hands you a diff to review. The first tier is now table stakes; every engineer I work with has a model open in a side pane, and it stopped being a differentiator the moment it became the default. The tiers above it, an agent working a scoped task end-to-end or several agents running in parallel with their own permission boundaries, are where the actual leverage still lives, because almost nobody has restructured how they delegate work to get there.',
        'As the person who sets AI-adoption standards for my org, I spend almost none of my time on prompting technique. I spend it on the guardrails: what an agent can touch unsupervised, what requires a human review gate before it ships, and what "done" has to prove before I believe it. This site\'s agent-readable rewrite was built the same way: the notes, the structured data, and the build-output bug above were scoped to specific files, verified against the existing type-check, lint, test, and build gates before anything shipped, with the plan surfaced for review rather than pushed silently. <strong>"I use AI" stopped being the differentiator. Whether you can hand an agent a boundary and a review bar, instead of still typing every line yourself, is the one that\'s left.</strong>',
      ],
    },
    {
      slug: 'building-with-ai-the-compound-advantage',
      title: 'Building with AI: The Compound Advantage',
      date: 'Jul 11, 2026',
      dateISO: '2026-07-11',
      dateModified: '2026-09-01',
      tags: ['AI Engineering', 'Productivity', 'Meta'],
      sources: [
        {
          label:
            'METR, Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity (arXiv 2507.09089)',
          href: 'https://arxiv.org/abs/2507.09089',
        },
        {
          label: 'METR, developer productivity experiment design update, Feb 2026',
          href: 'https://metr.org/blog/2026-02-24-uplift-update/',
        },
        {
          label: "This site's source, built as described",
          href: 'https://github.com/zhaolyu/zhaoyu.io',
        },
      ],
      content: [
        "I built most of this site through Claude Code as a deliberate workflow: the components, the type errors that blocked deploys and the notes themselves all went through the same loop of prompting and review. The obvious claim to make about that is speed, and the best available evidence does not support it. <a href='https://arxiv.org/abs/2507.09089' target='_blank' rel='noopener'>METR ran a randomized controlled trial on sixteen experienced open-source developers across 246 real tasks in their own repositories</a> and measured them 19% <em>slower</em> with AI tools than without. Those developers had forecast a 24% speedup before they started, and once the work was done they estimated they had been 20% faster.",
        "What changed for me was the filter. When a first version costs little enough, an idea stops being killed at the worth-building stage and starts being killed by contact with something running, and the second filter is both later and far more informative, because a running version answers questions a plan cannot. The compounding lives in the attempt count rather than in any single task, which is exactly what a stopwatch on one task cannot see: it measures the task in front of it and says nothing about how many got tried. METR's own <a href='https://metr.org/blog/2026-02-24-uplift-update/' target='_blank' rel='noopener'>February 2026 update</a> reports that developers are likely more sped up now than in early 2025, while selection effects leave the size of that increase uncertain. I have no measured attempt count of my own to put against theirs. <strong>Count the things you tried, not the speed you felt.</strong>",
      ],
    },
    {
      slug: 'the-url-is-the-source-of-truth',
      title: 'The Front End Is a Distributed System, Starting with the URL',
      date: 'Jul 11, 2026',
      dateISO: '2026-07-11',
      dateModified: '2026-09-01',
      tags: ['Architecture', 'Distributed Systems', 'State Management'],
      sources: [
        {
          label: 'Martin Kleppmann, Designing Data-Intensive Applications, Ch.5 (Replication)',
          href: 'https://dataintensive.net/',
        },
        {
          label: 'IETF httpapi working draft: the Idempotency-Key HTTP header field',
          href: 'https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/',
        },
        {
          label: 'First-hand: operating an edge-rendered architecture through market-moving events',
        },
      ],
      content: [
        'Filter a dashboard, refresh the page, and the filter is gone. Send the link to a colleague and they see a different view. The usual diagnosis is that the state was never persisted, and the usual fix is a client store, which handles the reload and misses the mechanism. Holding that filter in the URL is single-leader replication: <strong>one authoritative location owns the value, every view is a follower, and rendering is a read.</strong> Holding it in a store, plus the derived copies three components keep, is multi-leader replication. <em>Designing Data-Intensive Applications</em> takes up multi-leader setups inside its replication chapter and calls write conflicts their biggest problem, which is where the difficulty lands. You get concurrent writers with no total order between them, and no log to replay when the copies disagree.',
        "The browser sits behind a network nobody controls, so a request that times out has not necessarily failed, and a payment the reader submits twice still has to land once. The IETF's httpapi working group took an <a href='https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/' target='_blank' rel='noopener'><code>Idempotency-Key</code> header draft</a> to revision 07 and then let it lapse, which says more about the problem than a finished standard would: this is protocol-level rather than an application quirk, and the rule the draft encodes is that a client must always be able to retry safely. Rendering at the edge is a blast-radius decision before it is a performance one: a region that degrades during a market-moving event should be routed around, not queued behind. None of this is new work. It is replication and failure domains, arriving in a codebase where nobody uses those words. <strong>You cannot reuse a solved problem you do not recognize.</strong>",
      ],
    },
    {
      slug: 'decoupling-state-from-render-in-llm-streaming',
      title: 'Decoupling State from Render in LLM Streaming',
      date: 'Jul 11, 2026',
      dateISO: '2026-07-11',
      dateModified: '2026-09-01',
      tags: ['React Performance', 'HCI', '60fps'],
      sources: [
        {
          label: 'web.dev, Measure performance with the RAIL model (frame budget)',
          href: 'https://web.dev/articles/rail',
        },
        {
          label: 'First-hand: profiling LLM streaming UIs against the frame budget',
        },
      ],
      content: [
        "The naive way to build a streaming AI interface is to pipe a Server-Sent Events stream straight into a React state setter: a chunk arrives, <code>setState(prev => prev + chunk)</code> fires, the component re-renders. At sub-50ms token intervals that is twenty or more reconciliation passes a second, each one walking the tree to diff a string that grew by a few characters. The frame budget makes the arithmetic unforgiving. Sixty frames per second leaves 16ms per frame, and <a href='https://web.dev/articles/rail' target='_blank' rel='noopener'>the browser claims roughly 6ms of that for its own rendering work</a>, so application code has about 10ms to do everything else. A pass that overruns the budget does not render late. The frame is dropped.",
        'The fix is to stop treating arrival and display as the same event. I buffer incoming chunks in a mutable <code>useRef</code>, which accepts writes synchronously without scheduling anything, then flush to state on a <code>requestAnimationFrame</code> tick, so the DOM is written at most once per frame and only when the browser is about to paint. Throughput and render frequency come apart: the stream arrives as fast as the model emits, and the interface still paints on a steady cadence. This separation is older than React and older than LLMs, since a game loop makes the same split between simulation and draw. <strong>When the producer is faster than the consumer, the answer is a buffer and a clock, not a faster consumer.</strong>',
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
      note: 'Deliberate return to the technical track through the spinoff, to keep architecture judgment current.',
    },
    {
      year: 2026,
      role: 'Senior Manager, Engineering',
      company: 'Versant / CNBC',
      note: 'The synthesis: a player-coach role spanning both tracks, still hands-on in core architecture.',
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
      'Driving the complete redesign of CNBC.com, architecting the new UI/UX end to end with a peer engineering manager. I lead the frontend architecture for the AI experiences, lead the team building the video and site experiences, and keep the whole web behind the page holding up: analytics (Amplitude, Adobe Launch), MPS ad serving, the federated GraphQL layer we build against, login and subscriptions, SEO, compliance, and editorial workflows. The leverage is upstream, in shaping API contracts so one query carries the rules and web, apps, and OTT inherit a single implementation.',
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
    title: 'Video & Live Streaming Rebuild',
    category: 'professional',
    description:
      'Four playback surfaces (vertical video, live TV, full episodes, and standalone live events) rebuilt from the ground up across two player frameworks, inside the ~394M monthly digital minutes Versant reported at its December 2025 Investor Day. The hard part was never the player. It was upstream: settling the API contracts and architecture dependencies each surface had inherited separately, so four experiences resolve to one modular framework instead of forking into four.',
    stack: ['Server-Sent Events', 'Live Streaming', 'Player Architecture', 'GraphQL'],
    status: 'active',
    metrics: [
      { label: 'Surfaces', value: 'Vertical · Live TV · Episodes · Events' },
      { label: 'Sync', value: 'Server-Sent Events' },
    ],
  },
  {
    title: 'AI-Powered Investing Tools (Frontend Architecture)',
    category: 'professional',
    description:
      "Took CNBC's first AI product from zero to one as its only frontend engineer and the product/tech bridge, built front-to-back with design, product, backend, and editorial, which at a news organization is the constituency that decides whether generative text ships at all. That work is now the frontend architecture for the AI-powered investing tools in CNBC's next-generation platform. In financial products, trust is the conversion metric. My work makes non-deterministic model output feel deterministic: frame-buffered streaming, graceful degradation, latency that never shakes a reader’s confidence in the number on screen.",
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
      'When the corporate spinoff needed CNBC’s digital business to stand alone, I directed the 4-month, 3-team sprint that made it real: video streaming, analytics, and privacy services migrated off the parent company with zero downtime, compliance obligations met, no revenue interruption, no user-visible seam.',
    stack: ['GCP', 'Zero Downtime', 'GDPR/CCPA Compliance', 'Cloud Architecture'],
    status: 'completed',
    metrics: [
      { label: 'Teams Coordinated', value: '3' },
      { label: 'Downtime', value: 'Zero' },
    ],
  },
  {
    title: 'OB1: Exocortex Retrieval Layer',
    category: 'independent',
    description:
      'The leverage behind everything else I ship: books, engineering sources, and production lessons distilled into 1,700 atomic, cross-linked claims. The vault stays the source of truth; OB1 projects it into Supabase and serves it over MCP, so an agent in any client starts with my accumulated judgment instead of a blank context window.',
    stack: ['MCP', 'Supabase', 'pgvector', 'TypeScript'],
    status: 'shipped',
    metrics: [
      { label: 'Atomic Claims', value: '1,700' },
      { label: 'Agent Access', value: 'MCP' },
    ],
  },
  {
    title: 'Cost-Guard: FinOps Platform',
    category: 'experiment',
    description:
      'Cost discipline as a shipped system, not a spreadsheet: local-first cloud cost monitoring (PGlite + ElectricSQL) with zero-latency reads, real-time sync, and what-if simulations for infrastructure spend, fed by a signed ingestion API on GCP Cloud Run. Built end to end with AI-assisted development, the same governed workflow I set for my org, proven on my own infrastructure.',
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
    'What the business gets from me is both tracks at once. Over ten years at CNBC I deliberately crossed the line most engineers pick a side of: senior engineer, then engineering manager, then back to Principal Engineer to keep my architecture judgment current, now Senior Manager, Engineering for CNBC Core. I manage a direct team of 8 engineers and 2 QE and co-lead the ~20-engineer rebuild of CNBC.com across 3 web teams, and because I still architect and ship alongside them, technical decisions get made in the room. No translation layer between strategy and the codebase, no architecture that drifts from what the teams can actually deliver.',
    'As AI Integration Lead I turned AI adoption from individual experimentation into an organizational capability: standards and PR quality gates (SonarQube, lint, Jest test automation) governing how 20+ engineers use tools like Cursor in production code, with measurable velocity gains and fewer high-severity defects, inside the security and compliance guardrails a financial-media business actually has to honor. The org ships faster because the review bar got stronger, not looser.',
    'The coach half is just as deliberate. I recently expanded a mid-level engineer’s scope from single tasks to three concurrent workstreams (video, search, and free preview), and the coaching that mattered was not technical: they were losing rooms they were right in, so we worked on how the work gets presented to design and product until their influence caught up with their judgment. Engineers who can carry a whole surface are how a player-coach scales.',
    'Outside the codebase I am a long-distance runner, with a 3:07 marathon and a 50K ultra, and the same discipline carries into multi-year technical transformations.',
  ],
};

export interface SocialDescriptions {
  /** Used for both <meta name="description"> and og:description. */
  meta: string;
  twitter: string;
}

/** Human-facing social/meta copy; the agent layer (JSON-LD, llms.txt) tells the same story. */
export const socialDescriptions: SocialDescriptions = {
  meta: 'Senior Manager, Engineering at Versant (CNBC Core). 8 engineers and 2 QE direct, co-leading the ~20-engineer CNBC.com rebuild. Notes with receipts.',
  twitter:
    'Senior Manager, Engineering at Versant (CNBC Core). Engineering notes with receipts: agents, edge architecture, reliability.',
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
      "Whether it's a financial ticker during a market spike or a UI transition on a slow network, delay creates doubt, and doubt is churn. Every millisecond removed is a unit of audience confidence restored.",
      'Operationally that means standards, budgets, and repeatability over one-off heroics: UI production run like manufacturing, not craftsmanship.',
    ],
  },
  {
    title: 'The Bridge',
    body: [
      "I operate at the intersection of Product and Engineering. I don't build to spec; I partner with product leaders to define what is technically possible at scale.",
      'I translate edge configuration into business value, connect latency improvements to revenue impact, and push back when the roadmap is wrong. Engineering earns its seat by speaking the business’s language.',
    ],
  },
];

export interface AgentEraModel {
  title: string;
  /** One sentence stating the model; the linked note carries the argument. */
  line: string;
  /** Slug of the note that owns the model. */
  slug: string;
}

/**
 * The named models the recent notes built, linked to the note that owns each.
 * Rendered above the code standards, which are the platform-era foundations
 * these grew out of. Reuse these names; a model that changes its name between
 * appearances stops compounding.
 */
export const agentEraModels: AgentEraModel[] = [
  {
    title: 'Fail-open checks',
    line: 'A check whose "did not run" is indistinguishable from "passed" is worse than no check, because its record closes the question.',
    slug: 'your-checks-are-lying-to-you',
  },
  {
    title: 'The receipts rule',
    line: '"Done" without an attached artifact is the worker vouching for itself; the review happens on the diff, the test run, and the artifact.',
    slug: 'the-agent-run-is-the-new-unit-of-work',
  },
  {
    title: 'Loop failures, not intelligence failures',
    line: 'Agents fail for missing boundaries, definitions of done, and receipts; reliability is engineered into the loop, not summoned from the model.',
    slug: 'agent-failures-are-loop-failures',
  },
  {
    title: 'Spec quality is the bottleneck',
    line: 'When agents can build from any sufficiently precise description, the specification becomes the primary artifact and the codebase a derivative.',
    slug: 'spec-quality-is-the-bottleneck-not-implementation-speed',
  },
  {
    title: 'Judgment you already paid for',
    line: 'Settled tradeoffs must be retrievable by meaning, not memory, or every agent session re-derives them from a blank context window.',
    slug: 'agents-re-derive-judgment-you-already-paid-for',
  },
];

export interface FooterManifestoItem {
  title: string;
  body: string;
}

/**
 * Footer manifesto blurbs — the single source for TelemetryFooter's grid.
 * The forward echo: the agent-era models, so the last thing a reader sees
 * points where the work is going. The platform-era foundations live in the
 * Mental Models section's code standards.
 */
export const footerManifesto: FooterManifestoItem[] = [
  {
    title: 'Fail-Closed > Fail-Open',
    body: 'A check that cannot say "I could not run" certifies nothing; its green eventually hides the failure it was hired to catch.',
  },
  {
    title: 'Receipts > Done',
    body: 'An agent declaring "done" is self-attestation, so the diff, the test run, and the artifact are non-negotiable.',
  },
  {
    title: 'Loop > Model',
    body: 'Agent failures are loop failures, so reliability comes from boundaries, definitions of done, and receipts, not from a smarter model.',
  },
  {
    title: 'Spec > Speed',
    body: 'When agents produce working code from any sufficiently precise description, the specification is the primary artifact and typing speed stops being the constraint.',
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
      note: 'If the UI stutters, the user disengages. Latency is not a technical problem; it is a trust problem.',
    },
    ai: {
      key: 'ai',
      title: 'RECEIPTS > DONE',
      bad: `// ❌ Self-Attestation
// Agent: "All tests pass. Task complete."
//
// You did not watch the tests run. The party
// most motivated to declare success is
// the only witness to it.

const result = await agent.run(task);
markComplete(task); // on its word`,
      good: `// ✅ The Receipts Rule
// "Done" ships with artifacts, or it isn't done.

const result = await agent.run(task);
review({
  diff: result.diff,         // what changed
  testRun: result.testLog,   // proof it ran
  artifact: result.buildUrl, // the thing itself
});
// Accept or reject on evidence you can open,
// not on a status the worker assigned itself.`,
      note: 'An agent declaring "done" is self-attestation by the party most motivated to claim success. The receipt (the diff, the test run, the artifact) is what gets reviewed.',
    },
  },
};
