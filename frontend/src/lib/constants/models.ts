/**
 * Mental-models registry — the domain-independent layer.
 *
 * The distinction this file exists to hold: a heuristic pays off in one
 * domain, a model pays off in two. `models.test.ts` enforces exactly that —
 * every entry carries receipts from at least two distinct domains, and an
 * `origin` naming where the idea came from. A model that only works in
 * engineering belongs in `codeStandards`, which is the worked-example layer,
 * not here.
 *
 * `origin` is not decoration. Several of these are relayed rather than
 * original, and the site's receipts rule applies to provenance the same way
 * it applies to figures: a borrowed model presented as a personal standard is
 * an unsourced claim. Where the origin is a public artifact it carries an
 * href a reader can open; where it is first-hand it says so plainly.
 */
import { notesData } from '$lib/constants/content';

/** The domains a receipt can come from. Two distinct ones make a model. */
export type ModelDomain = 'engineering' | 'capital allocation' | 'knowledge work';

export interface ModelReceipt {
  domain: ModelDomain;
  /** The concrete instance. A sentence a reader can picture, not a restatement. */
  text: string;
}

export interface ModelOrigin {
  /** Named source, or an explicit first-hand label. Never left implicit. */
  label: string;
  /** Present when the origin is a public artifact a reader can open. */
  href?: string;
}

export interface MentalModel {
  /** Stable anchor: /models#<id>. Permanent once shipped. */
  id: string;
  /** The rule, one sentence. This is the thing worth remembering. */
  rule: string;
  /** Why it holds. Mechanism, not example — the receipts carry the examples. */
  mechanism: string;
  /** At least two, spanning at least two distinct domains. */
  receipts: ModelReceipt[];
  origin: ModelOrigin;
  /** Slug of the note that argues this at length, when one exists. */
  note?: string;
}

export const MENTAL_MODELS: MentalModel[] = [
  {
    id: 'instructions-are-not-enforcement',
    rule: 'A written instruction is context. A hard requirement needs a deterministic control.',
    mechanism:
      'Writing a rule down changes who has read it. It does not change what happens when it is ignored, because nothing is watching. A control that fails the work is the only thing that converts an intention into a property of the system, and the gap between the two is invisible precisely while everything is going well.',
    receipts: [
      {
        domain: 'engineering',
        text: 'A prompt telling an agent to always run the tests, versus a CI job that refuses the merge when they did not run.',
      },
      {
        domain: 'capital allocation',
        text: 'A stated policy of cutting losers, versus a kill criterion pre-committed to a specific mechanism, which fires without needing a decision in the moment.',
      },
      {
        domain: 'knowledge work',
        text: 'A style guide nobody opens, versus a check in the pipeline that will not let the draft through.',
      },
    ],
    origin: { label: 'First-hand: a ledger of fail-open checks kept across my own systems' },
    note: 'your-checks-are-lying-to-you',
  },
  {
    id: 'a-check-must-be-able-to-say-it-did-not-run',
    rule: 'A check with two outcomes instead of three certifies nothing, because "did not run" arrives looking like "passed."',
    mechanism:
      'Passed and failed are the outcomes people design for. The third outcome, the check never executed, has no natural signal, so it borrows the signal of the one next to it. The artifact produced by the failure is what conceals it: a green result closes the question, and nobody re-opens a question that has been answered.',
    receipts: [
      {
        domain: 'engineering',
        text: 'A lint whose pattern file failed to parse reports clean, which is strictly worse than having no lint, because now there is a record.',
      },
      {
        domain: 'capital allocation',
        text: 'A backtest whose window cannot contain the event it claims to rule out returns a pass on a question it never asked.',
      },
    ],
    origin: { label: 'First-hand: six documented instances across unrelated subsystems' },
    note: 'your-checks-are-lying-to-you',
  },
  {
    id: 'allocate-in-the-unit-that-matters',
    rule: 'Allocate in the unit the question turns on, not the unit you can count without thinking.',
    mechanism:
      'Every allocation has an obvious unit and a correct one, and they are rarely the same. The obvious unit is obvious because it is cheap to measure. Splitting something evenly in the wrong unit produces a systematically uneven split in the right one, and the distortion stays invisible until the thing fails in the dimension you were not measuring.',
    receipts: [
      {
        domain: 'capital allocation',
        text: 'Risk parity divides a portfolio by volatility contribution rather than by dollars, because a 60/40 split by capital is close to a 90/10 split by risk.',
      },
      {
        domain: 'engineering',
        text: 'Capacity-aware load balancing routes by the headroom a node actually has, not by request count, because equal request counts across unequal machines is not balance.',
      },
    ],
    origin: {
      label:
        'Ray Dalio, Principles: the All Weather and risk-parity work, generalized past finance',
      href: 'https://www.bridgewater.com/research-and-insights/the-all-weather-story',
    },
  },
  {
    id: 'grade-the-decision-not-the-outcome',
    rule: 'Grade the reasoning that was available before the result, not the result.',
    mechanism:
      'A good outcome from a bad process is luck, and luck teaches nothing repeatable. A bad outcome from a good process is variance, and changing the process in response makes the next decision worse. Outcome-grading is available instantly and costs nothing, which is why it wins by default. Process-grading requires writing the reasoning down before the answer arrives, which is the whole cost and the whole point.',
    receipts: [
      {
        domain: 'capital allocation',
        text: 'A thesis scored against what was written at entry, so a position that worked for a reason nobody predicted counts as a miss, not a hit.',
      },
      {
        domain: 'engineering',
        text: 'A postmortem run on a quarter with no incidents, asking which of the calls that quarter were right for the reasons given rather than right by luck.',
      },
    ],
    origin: {
      label: 'Annie Duke, Thinking in Bets, on "resulting"',
      href: 'https://www.annieduke.com/books/',
    },
  },
  {
    id: 'separate-the-builder-from-the-reviewer',
    rule: 'The thing that made the work cannot be the thing that approves it.',
    mechanism:
      'Satisfying a goal and protecting a system are opposing postures. One party holding both resolves the conflict toward whichever it was most recently asked for, and it was most recently asked to build. This is not a trust problem and cannot be fixed by trying harder, because the party with the strongest incentive to declare success is also the only witness to it.',
    receipts: [
      {
        domain: 'engineering',
        text: 'A reviewing agent that runs in a separate context with no stake in the diff, and never sees the author’s rationale.',
      },
      {
        domain: 'knowledge work',
        text: 'Maker-checker: the checker is qualified to judge the work and did not write it, and both halves of that are load-bearing.',
      },
    ],
    origin: {
      label:
        'First-hand, and the maker-checker control that predates all of this in finance operations',
    },
    note: 'the-agent-run-is-the-new-unit-of-work',
  },
  {
    id: 'tool-alpha-cancels',
    rule: 'An input everyone gets at the same time is not an advantage. What the savings buy is.',
    mechanism:
      'A capability that arrives for every competitor at once cancels in the comparison, however large it is in absolute terms. The advantage lives entirely downstream, in what the freed resource is spent on, and specifically in the things that cannot be bought from the same vendor on the same day: accumulated judgment, domain depth, relationships, a record of work people accepted.',
    receipts: [
      {
        domain: 'engineering',
        text: 'Every team on the market gets the same model API in the same week, so using it is table stakes and the differentiator is what you point it at.',
      },
      {
        domain: 'capital allocation',
        text: 'When every fund runs the same screener, screening stops being edge and the residual is the judgment applied to what the screen returns.',
      },
    ],
    origin: {
      label: 'Naval Ravikant with Nivi, "A Motorcycle for the Mind," February 2026',
      href: 'https://nav.al/ai',
    },
  },
  {
    id: 'prevented-loss-is-invisible',
    rule: 'Work that stops a bad outcome produces no evidence that it worked.',
    mechanism:
      'The value of prevention is a counterfactual, and the counterfactual is never observed. Good judgment therefore looks like nothing happening, which is indistinguishable from nothing having needed to happen. The systematic consequence is that the work is under-rewarded relative to visible firefighting, and the people best at it are hardest to promote on evidence.',
    receipts: [
      {
        domain: 'engineering',
        text: 'The outage that did not occur has no postmortem, no incident channel, and no line in anyone’s promotion packet.',
      },
      {
        domain: 'capital allocation',
        text: 'The position you declined has no entry in the P&L, so the loss you avoided is not attributable to the decision that avoided it.',
      },
    ],
    origin: {
      label:
        'Nate Jones, Executive Circle newsletter, 31 May 2026 (subscriber-only, so no public link)',
    },
  },
  {
    id: 'learn-the-layer-below',
    rule: 'Understanding the layer beneath an abstraction is durable, because abstractions leak and the layer below usually outlives them.',
    mechanism:
      'Every abstraction hides a mechanism and hides it imperfectly. When it leaks, the only people who can act are the ones who know what was being hidden. That knowledge does not depreciate when the abstraction is replaced, which is the part that compounds: the framework has a half-life, the thing it sits on mostly does not.',
    receipts: [
      {
        domain: 'engineering',
        text: 'A rendering bug that only makes sense to someone who knows the browser’s paint pipeline, not the framework’s API surface.',
      },
      {
        domain: 'knowledge work',
        text: 'Judging whether a model’s output is correct requires the domain knowledge the model appeared to make unnecessary.',
      },
    ],
    origin: {
      label: 'Joel Spolsky, The Law of Leaky Abstractions (2002)',
      href: 'https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/',
    },
  },
];

/**
 * The three shown on the landing page. Three, not four: the landing grid
 * resolves to three columns at desktop widths, so a fourth card orphans onto
 * a row of its own and reads as a layout bug rather than a teaser.
 */
export const TEASER_COUNT = 3;

export function teaserModels(): MentalModel[] {
  return MENTAL_MODELS.slice(0, TEASER_COUNT);
}

export function mentalModel(id: string): MentalModel | undefined {
  return MENTAL_MODELS.find((m) => m.id === id);
}

/** Distinct domains a model draws receipts from. Two is the publishable floor. */
export function receiptDomains(model: MentalModel): ModelDomain[] {
  return [...new Set(model.receipts.map((r) => r.domain))];
}

/**
 * Structural problems with a model, as human-readable strings; empty means
 * publishable. Used by the tests and usable from authoring scripts, the same
 * shape `caseStudyProblems` uses.
 */
export function modelProblems(model: MentalModel, noteSlugs: ReadonlySet<string>): string[] {
  const problems: string[] = [];
  if (!/^[a-z0-9-]+$/.test(model.id)) problems.push(`id "${model.id}" is not kebab-case`);
  if (!model.rule.trim()) problems.push(`${model.id}: rule is empty`);
  if (!model.mechanism.trim()) problems.push(`${model.id}: mechanism is empty`);
  if (!model.origin.label.trim()) problems.push(`${model.id}: origin is unnamed`);
  if (model.origin.href && !/^https:\/\//.test(model.origin.href))
    problems.push(`${model.id}: origin href is not https`);

  const domains = receiptDomains(model);
  if (domains.length < 2)
    problems.push(
      `${model.id}: receipts span ${domains.length} domain(s); a model needs 2 or it is a heuristic`,
    );
  for (const receipt of model.receipts) {
    if (!receipt.text.trim()) problems.push(`${model.id}: empty receipt in ${receipt.domain}`);
  }
  if (model.note && !noteSlugs.has(model.note))
    problems.push(`${model.id}: note "${model.note}" does not exist`);
  return problems;
}

/** Slugs of every shipped note, for `modelProblems` link resolution. */
export function noteSlugSet(): ReadonlySet<string> {
  return new Set(notesData.notes.map((n) => n.slug));
}
