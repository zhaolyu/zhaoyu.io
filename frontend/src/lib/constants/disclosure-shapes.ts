// Disclosure shapes, one source. disclosure-guard.test.ts scans every surface
// of the site with these; scripts/artifact-guard.mjs scans a page that is not
// in the site yet (a proof, a draft post) with the same patterns. The rule is
// an allowlist, not a deny-list: each pattern matches the SHAPE of an employer
// claim, never its value, so this file can live in a public repository and a
// figure nobody anticipated is still caught. Node 24 strips the types.

export interface MetricShape {
  pattern: RegExp;
  kind: string;
}

/**
 * Shapes that read as an employer claim. Each describes a kind of number, so
 * the list stays publishable, and it generalises: a future "185K subscribers"
 * trips the same rule any other subscriber count does, which a literal never
 * would.
 */
export const METRIC_SHAPES: MetricShape[] = [
  {
    pattern: /\$\s?\d[\d,.]*\s?(?:[–—-]\s?\d[\d,.]*\s?)?[MBK]?\+?\s*(?:ARR|revenue|subscription)/gi,
    kind: 'revenue or ARR',
  },
  {
    pattern: /\b\d[\d,.]*\s?[MK]\+?\s*(?:premium\s+|paying\s+)?subscribers?\b/gi,
    kind: 'subscriber count',
  },
  {
    // The qualifier slot is why this is not a two-word match: an
    // "<n>-subscriber *production* beta" reads as the same disclosure and
    // slipped straight through the tighter pattern this replaces.
    pattern:
      /\b\d[\d,.]*\s?[- ]?(?:subscriber|user|customer)\s+(?:\w+\s+){0,2}?(?:beta|pilot|cohort|trial)/gi,
    kind: 'unannounced pilot size',
  },
  {
    pattern: /\b\d[\d,.]*\s?[MBK]\+?\s*(?:monthly\s+|daily\s+)?(?:unique|visitor|user|reader)/gi,
    kind: 'audience scale',
  },
  {
    pattern: /\b\d[\d,.]*\s?%\s*(?:cache|hit\b)|\bHIT:\s*\d/gi,
    kind: 'cache-hit rate',
  },
  {
    pattern: /\b\d[\d,.]*\s?%\s*(?:velocity|fewer|faster|more|defects?|incidents?)/gi,
    kind: 'internal governance metric',
  },
  {
    pattern:
      /\b(?:p\d{2}\s*)?(?:LCP|TTFB|INP|CLS)\b[^.\d]{0,20}\d[\d.]*\s?(?:s|ms)?|\b\d[\d.]*\s?(?:s|ms)\s*(?:LCP|TTFB|INP)\b/gi,
    kind: 'field performance figure',
  },
  { pattern: /\bTop\s+\d+\s?%/gi, kind: 'ranking superlative' },
];

/**
 * Numbers that are not employer claims and never needed a source. Each entry
 * says why it is here; an unexplained exemption is how a deny-list rots.
 */
export const NOT_EMPLOYER_CLAIMS: Array<{ text: string; why: string }> = [
  { text: '50K ultra', why: 'an ultramarathon distance, a personal fact' },
  { text: '20% faster', why: "the METR study's own figure, cited inline to its source" },
];

/** Prose in an illustrative code block asserts nothing about production. */
export const stripIllustrativeCode = (text: string): string =>
  text.replace(/<code>[\s\S]*?<\/code>/g, ' ');
/** URL-encoded characters (%20) look like percentages to a regex. */
export const stripUrls = (text: string): string => text.replace(/https?:\/\/\S+/g, ' ');

const escapeRe = (v: string) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/**
 * A sourced value exempts a match only when it appears as a *complete* figure.
 * Substring matching is not safe: a team size of "20" is a substring of a
 * pilot-cohort claim beginning "20…", which silently exempted a real leak
 * shape until this was tightened.
 */
export const asWholeFigure = (value: string): RegExp =>
  new RegExp(`(?<![\\d.])${escapeRe(value)}(?![\\d.%])`, 'i');

/** Build the exemption test from the values a public source already backs. */
export function makeExempt(sourcedValues: string[]): (match: string) => boolean {
  const lower = sourcedValues.map((v) => v.toLowerCase());
  return (match: string) =>
    lower.some((v) => asWholeFigure(v).test(match)) ||
    NOT_EMPLOYER_CLAIMS.some((e) => match.toLowerCase().includes(e.text.toLowerCase()));
}

export interface ShapeHit {
  kind: string;
  match: string;
}

/** Every unsourced employer-shaped figure in a text, after code and URLs are stripped. */
export function findUnsourced(text: string, exempt: (m: string) => boolean): ShapeHit[] {
  const scannable = stripUrls(stripIllustrativeCode(text));
  const hits: ShapeHit[] = [];
  for (const { pattern, kind } of METRIC_SHAPES) {
    for (const m of scannable.matchAll(pattern)) {
      const match = m[0].trim();
      if (!exempt(match)) hits.push({ kind, match });
    }
  }
  return hits;
}
