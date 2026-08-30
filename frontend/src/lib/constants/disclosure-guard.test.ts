import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { performanceMetrics } from './content';

/**
 * Disclosure guard — allowlist, not deny-list.
 *
 * Versant is a public company, so no employer figure ships unless it traces to
 * a public disclosure. This used to be enforced with a list of forbidden
 * strings, which failed twice and in opposite directions:
 *
 *  1. It could only catch what someone thought to forbid. An unsourced
 *     cache-hit rate sat inside an SVG in ProjectCard.svelte and shipped to
 *     production for months while the guard ran green, because that file was
 *     not on the hand-picked scan list.
 *  2. Worse, a deny-list only works by *spelling the secrets*. The file became
 *     an annotated index of exactly which employer numbers were confidential
 *     and why — the single most damaging thing in a repository that is meant to
 *     be public.
 *
 * So the question is inverted. Instead of "does this text contain a forbidden
 * string", it asks "does this text state an employer metric that no public
 * source backs". The patterns below match the *shape* of such a claim — a
 * subscriber count, an ARR figure, a cache-hit rate — never its value. Nothing
 * here discloses anything, and a figure nobody anticipated is caught anyway.
 */

const here = dirname(fileURLToPath(import.meta.url));

/** Every file that can put a string in front of a reader, walked not enumerated. */
function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(svelte|ts)$/.test(entry.name) && !/\.test\.ts$/.test(entry.name) ? [full] : [];
  });
}

const SURFACES = [
  ...['./content.ts', './case-studies.ts', './og.ts', './structured-data.ts'].map((rel) =>
    resolve(here, rel),
  ),
  resolve(here, '../../../static/llms.txt'),
  ...walk(resolve(here, '../../routes')),
  ...walk(resolve(here, '../../lib/components')),
].map((abs) => ({ rel: abs.slice(abs.indexOf('/src/') + 1), text: readFileSync(abs, 'utf8') }));

/**
 * Shapes that read as an employer claim. Each describes a kind of number, so
 * the list stays publishable — and it generalises: a future "185K subscribers"
 * trips the same rule any other subscriber count does, which a literal never would.
 */
const METRIC_SHAPES: Array<{ pattern: RegExp; kind: string }> = [
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
    // slipped straight through the tighter pattern this replaces. The real
    // figure stays out of this file like every other one — the invented
    // "450-subscriber production beta" case below is what proves the slot works.
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

/** Values a public source already backs, via performanceMetrics (basis + SOURCES). */
const SOURCED_VALUES = performanceMetrics.map((m) => m.value.toLowerCase());

/**
 * Numbers that are not employer claims and never needed a source. Each entry
 * says why it is here — an unexplained exemption is how a deny-list rots.
 */
const NOT_EMPLOYER_CLAIMS: Array<{ text: string; why: string }> = [
  { text: '50K ultra', why: 'an ultramarathon distance, a personal fact' },
  { text: '20% faster', why: "the METR study's own figure, cited inline to its source" },
];

/** Prose in an illustrative code block asserts nothing about production. */
const stripIllustrativeCode = (text: string) => text.replace(/<code>[\s\S]*?<\/code>/g, ' ');
/** URL-encoded characters (%20) look like percentages to a regex. */
const stripUrls = (text: string) => text.replace(/https?:\/\/\S+/g, ' ');

/**
 * A sourced value exempts a match only when it appears as a *complete* figure.
 * Substring matching is not safe here: performanceMetrics carries short values
 * like a team size of "20", and a pilot-cohort claim beginning "20…" contains it
 * as a substring — which silently exempted a real leak shape until this was
 * tightened.
 * The lookarounds require the value not to be a fragment of a longer number.
 */
const escapeRe = (v: string) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const asWholeFigure = (value: string) =>
  new RegExp(`(?<![\\d.])${escapeRe(value)}(?![\\d.%])`, 'i');

const exempt = (match: string) =>
  SOURCED_VALUES.some((v) => asWholeFigure(v).test(match)) ||
  NOT_EMPLOYER_CLAIMS.some((e) => match.toLowerCase().includes(e.text.toLowerCase()));

describe('disclosure guard (allowlist)', () => {
  for (const { rel, text } of SURFACES) {
    const scannable = stripUrls(stripIllustrativeCode(text));
    for (const { pattern, kind } of METRIC_SHAPES) {
      it(`${rel} states no unsourced ${kind}`, () => {
        const unsourced = [...scannable.matchAll(pattern)]
          .map((m) => m[0].trim())
          .filter((m) => !exempt(m));
        expect(
          unsourced,
          `${rel} states a ${kind} with no entry in performanceMetrics: ${unsourced.join(' | ')}. ` +
            'Add the figure with a basis and a SOURCES citation, or cut it.',
        ).toEqual([]);
      });
    }
  }

  it('every sourced value it allows is itself backed by a public source', () => {
    // The allowlist is only as trustworthy as performanceMetrics, which
    // content.test.ts holds to basis + SOURCES membership. Assert it is not
    // empty, so an accidental truncation cannot silently widen the exemption.
    expect(SOURCED_VALUES.length).toBeGreaterThanOrEqual(3);
    for (const value of SOURCED_VALUES) expect(value).toMatch(/\S/);
  });

  it('scans every rendered surface, not a hand-picked list', () => {
    // The cache-hit-rate regression shipped because ProjectCard.svelte was
    // never scanned at all.
    expect(SURFACES.length).toBeGreaterThan(40);
    expect(SURFACES.some((s) => s.rel.endsWith('features/work/ProjectCard.svelte'))).toBe(true);
    expect(SURFACES.some((s) => s.rel.endsWith('constants/content.ts'))).toBe(true);
  });
});

/**
 * Coverage proof. Every figure below is invented — the point is the shape, and
 * inventing them is what lets this live in a public repository at all.
 *
 * The `wouldEvadeALiteralList` cases are the argument for the inversion: each
 * is the same class of claim as one that really did ship, with a different
 * number. A deny-list of literals passes all of them.
 */
describe('the guard catches the shape, not a memorised value', () => {
  const catches = (text: string) =>
    METRIC_SHAPES.some(({ pattern }) =>
      [...text.matchAll(pattern)].map((m) => m[0].trim()).some((m) => !exempt(m)),
    );

  // Shapes that really did ship at some point, with the numbers changed. The
  // originals are deliberately absent: writing them here to prove the guard
  // works would re-disclose precisely what the guard exists to keep out, and
  // the shape is what is being tested anyway.
  const shapesThatOnceShipped = [
    '$88-92M ARR',
    '310K+ subscribers',
    '640-subscriber beta pilot',
    '73M+ monthly uniques',
    'HIT: 88.6%',
    '44% velocity increase',
    'Top 7%',
    '2.4s LCP',
  ];
  for (const claim of shapesThatOnceShipped) {
    it(`flags ${claim}`, () => expect(catches(claim)).toBe(true));
  }

  // Same classes again at different magnitudes. A deny-list of literals passes
  // every one of these, which is the whole argument for matching shape instead.
  const wouldEvadeALiteralList = [
    '$72M ARR',
    '185K+ subscribers',
    '450-subscriber beta cohort',
    '450-subscriber production beta',
    '450-user limited access pilot',
    '62M monthly uniques',
    'HIT: 91.2%',
    '31% fewer incidents',
    'Top 3%',
    '0.9s LCP',
  ];
  for (const claim of wouldEvadeALiteralList) {
    it(`flags ${claim} — a deny-list of literals would not`, () =>
      expect(catches(claim)).toBe(true));
  }

  const mustNotFlag = [
    ['a 3:07 marathon and a 50K ultra', 'personal, not employer'],
    ['felt 20% faster while measuring slower', "METR's own figure, cited inline"],
    ["the browser's 16ms frame budget", 'a universal platform fact'],
    ['47M monthly uniques', 'the public ComScore figure, in performanceMetrics'],
    ['p75 LCP of 1.7s', 'CrUX field data, in performanceMetrics'],
  ] as const;
  for (const [claim, why] of mustNotFlag) {
    it(`allows "${claim}" (${why})`, () => expect(catches(claim)).toBe(false));
  }
});
