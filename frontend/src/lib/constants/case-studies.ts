/**
 * Case-study registry — the flagship proof points, as decision records.
 *
 * A case study is long-form and structured: context → constraints → options
 * considered → the decision → architecture → measured outcomes → what went
 * wrong → my role vs. the team's. `case-studies.test.ts` enforces the shape
 * (every section present, ≥1,200 words, every outcome carrying a basis, at
 * least one source), so an entry cannot ship as a brochure.
 *
 * The same disclosure policy as content.ts applies: employer numbers carry a
 * public source, and anything not publicly disclosed stays out of the repo —
 * a `featureFlag` hides a page, not the shipped bundle, so embargoed studies
 * are written elsewhere and land here only when public.
 */
import type { FeatureFlag } from '$lib/constants/config';
import type { Source } from '$lib/constants/content';

export interface CaseStudyOutcome {
  metric: string;
  value: string;
  /** What the number measures, over what window — rendered with the metric. */
  basis: string;
  source?: Source;
}

export interface CaseStudySections {
  /** The business situation: what was at stake, in user and business terms. */
  context: string[];
  /** Traffic shape, compliance, team, deadline — what bounded the solution. */
  constraints: string[];
  /** The options considered and why the losers lost. */
  options: string[];
  /** The call that was made, and who made it. */
  decision: string[];
  /** Diagram id rendered by CaseStudyArticle, plus the caption that explains it. */
  architecture: { diagram: string; caption: string };
  /** Measured results, each with a basis. */
  outcome: CaseStudyOutcome[];
  /** What went wrong or what I would do differently — required, not optional. */
  regrets: string[];
  /** Explicit credit boundary: what was mine, what was the team's. */
  myRoleVsTeam: string[];
}

export interface CaseStudy {
  /** Canonical URL segment (/work/<slug>) and OG image filename. Permanent. */
  slug: string;
  title: string;
  /** One sentence for cards, meta description, and the OG subtitle. */
  oneLiner: string;
  role: string;
  /** Display period, e.g. "2023–2025". */
  period: string;
  /** Full publication date, YYYY-MM-DD. */
  dateISO: string;
  /** Date of the last substantive edit, when later than dateISO. */
  dateModified?: string;
  sections: CaseStudySections;
  /** At least one — the receipts a stranger can check. */
  sources: Source[];
  /** Slugs of engineering notes that document the same work in more depth. */
  relatedNotes: string[];
  stack: string[];
  /** Only shown (page, sitemap, OG, llms.txt) when the flag is on. */
  featureFlag?: FeatureFlag;
}

/**
 * Newest first. Starts empty by design: the machinery (route, OG, sitemap,
 * JSON-LD, validation) ships ahead of the content so writing a study is a
 * fill-in-the-record exercise, not a page build.
 */
export const CASE_STUDIES: CaseStudy[] = [];

const PROSE_KEYS = [
  'context',
  'constraints',
  'options',
  'decision',
  'regrets',
  'myRoleVsTeam',
] as const;

/** Every prose word in the study, for the length gate. */
export function caseStudyWordCount(cs: CaseStudy): number {
  const prose = [
    ...PROSE_KEYS.flatMap((key) => cs.sections[key]),
    cs.sections.architecture.caption,
    ...cs.sections.outcome.map((o) => `${o.metric} ${o.value} ${o.basis}`),
  ].join(' ');
  return prose
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

export const MIN_WORDS = 1200;

/**
 * Structural problems with a study, as human-readable strings; empty means
 * publishable. Used by the tests and usable from authoring scripts.
 */
export function caseStudyProblems(cs: CaseStudy, noteSlugs: ReadonlySet<string>): string[] {
  const problems: string[] = [];
  if (!/^[a-z0-9-]+$/.test(cs.slug)) problems.push(`slug "${cs.slug}" is not kebab-case`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cs.dateISO))
    problems.push(`dateISO "${cs.dateISO}" is not YYYY-MM-DD`);
  if (cs.dateModified && !/^\d{4}-\d{2}-\d{2}$/.test(cs.dateModified))
    problems.push(`dateModified "${cs.dateModified}" is not YYYY-MM-DD`);
  if (!cs.oneLiner.trim()) problems.push('oneLiner is empty');

  for (const key of PROSE_KEYS) {
    const section = cs.sections[key];
    if (section.length === 0 || section.some((p) => !p.trim()))
      problems.push(`section "${key}" is empty`);
  }
  if (!cs.sections.architecture.diagram.trim() || !cs.sections.architecture.caption.trim())
    problems.push('architecture diagram/caption is empty');
  if (cs.sections.outcome.length === 0) problems.push('no outcomes');
  for (const o of cs.sections.outcome) {
    if (!o.basis.trim()) problems.push(`outcome "${o.metric}" has no basis`);
  }
  if (cs.sources.length === 0) problems.push('no sources');
  for (const src of cs.sources) {
    if (!/^https:\/\//.test(src.href)) problems.push(`source "${src.label}" is not an https URL`);
  }
  for (const slug of cs.relatedNotes) {
    if (!noteSlugs.has(slug)) problems.push(`relatedNotes references unknown note "${slug}"`);
  }
  const words = caseStudyWordCount(cs);
  if (words < MIN_WORDS) problems.push(`${words} words — a case study argues at ≥${MIN_WORDS}`);
  return problems;
}

export function caseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.slug === slug);
}
