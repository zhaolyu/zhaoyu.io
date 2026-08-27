import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { heroContent, socialDescriptions, narrativeBio, builderProjects } from './content';
import { personJsonLd } from './structured-data';
import { FEATURE_FLAGS } from './config';

/**
 * One positioning, told the same way on every surface. These assertions are
 * what stop a one-sided edit — the hero moves on, the meta description or
 * llms.txt silently keeps the old story — from shipping unnoticed.
 */
const llms = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), '../../../static/llms.txt'),
  'utf8',
);

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

const TITLE = 'Senior Manager, Engineering';
const EMPLOYER = 'Versant';
const SCOPE = /CNBC Core/;

describe('hero', () => {
  it('states audience, outcome and method in at most 40 words', () => {
    const headline = `${heroContent.headline.primary} ${heroContent.headline.accent}`;
    expect(words(headline)).toBeLessThanOrEqual(40);
    // audience + outcome live in the primary line; the method (edge, video,
    // governed AI) is named by the accent line or the bio directly beneath it
    expect(heroContent.headline.primary).toMatch(/teams|platforms/);
    expect(`${heroContent.headline.accent} ${heroContent.bio}`).toMatch(/edge|video|AI/);
  });

  it('carries at most one figure in the bio', () => {
    const figures = heroContent.bio.match(/\d[\d.,]*[KM%]?/g) ?? [];
    expect(figures.length).toBeLessThanOrEqual(1);
  });

  it('names the title and employer as facts', () => {
    // The badge carries the literal title/employer/org line; the bio is free
    // to read as prose as long as it stays anchored to the platform.
    expect(heroContent.badge).toMatch(/SENIOR MANAGER, ENGINEERING/);
    expect(heroContent.badge).toMatch(/VERSANT/);
    expect(heroContent.badge).toMatch(/CNBC CORE/);
    expect(heroContent.bio).toMatch(/CNBC/);
  });
});

describe('one story on every surface', () => {
  it('keeps the meta description inside the SERP budget and on-message', () => {
    expect(socialDescriptions.meta.length).toBeLessThanOrEqual(160);
    expect(socialDescriptions.meta).toMatch(TITLE);
    expect(socialDescriptions.meta).toMatch(EMPLOYER);
    expect(socialDescriptions.meta).toMatch(SCOPE);
    expect(socialDescriptions.twitter).toMatch(TITLE);
  });

  it('keeps the canonical scope phrasing — it must match the résumé', () => {
    // Scope claims are load-bearing and constrained: a direct team of 8
    // engineers and 2 QE, co-leading a ~20-engineer rebuild across 3 teams.
    // Both halves are asserted, because dropping either one is how the claim
    // drifts back into "runs a 20-engineer org".
    const surfaces: Array<[string, string]> = [
      ['hero accent', heroContent.headline.accent],
      ['narrative bio', narrativeBio.paragraphs[0]],
      ['meta description', socialDescriptions.meta],
      ['llms.txt', llms],
    ];
    for (const [name, text] of surfaces) {
      expect(text, `${name} must name the direct team`).toMatch(/8 engineers and 2 QE/);
      expect(text, `${name} must say co-lead, not direct or run`).toMatch(/co-lead/i);
    }
  });

  it('tells the same story in llms.txt and the JSON-LD Person', () => {
    expect(llms).toMatch(TITLE);
    expect(llms).toMatch(EMPLOYER);
    expect(llms).toMatch(SCOPE);
    const person = personJsonLd();
    expect(person.jobTitle).toBe(TITLE);
    expect(person.description).toMatch(SCOPE);
    expect(person.sameAs).toContain('https://linkedin.com/in/zhaolyu');
  });

  it('describes the AI work only at the publicly disclosed level', () => {
    // Versant has said "AI-powered investing tools" in the next-generation
    // platform; nothing beyond that ships until CNBC announces (D7a).
    const ai = builderProjects.find((p) => p.title.startsWith('AI-Powered Investing Tools'));
    expect(ai?.description).toMatch(/AI-powered investing tools/);
    expect(ai?.description).toMatch(/next-generation platform/);
    expect(llms).toMatch(/AI-powered investing tools/);
  });

  it('leads Selected Work with the platform rebuild', () => {
    expect(builderProjects[0].title).toBe('CNBC.com Next-Gen Rebuild');
  });
});

/**
 * Retired scope claims.
 *
 * The site once said, on three surfaces at once, that Zhao "directs a
 * 20-engineer organization" and had spent "nine years" going "intern to
 * Principal Engineer to running the web org". The résumé the site links to
 * says something narrower: a direct team of 8 engineers and 2 QE, co-leading a
 * ~20-engineer rebuild across three teams, ten years in. A recruiter reading
 * both could name the discrepancy — on a site whose llms.txt advertises that
 * every number is sourced.
 *
 * The fix is not just new copy, because the old copy was *pinned by a test*
 * asserting the phrase must appear. So this scans the shipped text for the
 * retired claims by shape, the way disclosure-guard.test.ts does: the source
 * of content.ts (which carries hero, bio, timeline, projects and note prose)
 * plus llms.txt. A future edit that reintroduces any of them fails here.
 */
const contentSource = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), './content.ts'),
  'utf8',
);

const RETIRED_CLAIMS: Array<{ pattern: RegExp; why: string }> = [
  {
    // "co-leads a ~20-engineer rebuild" is correct and must not trip this.
    pattern: /(?<!co-)(?:direct|lead|run)(?:s|ing)?\s+(?:a\s+|the\s+)?~?20-engineer/gi,
    why: 'the role co-leads the ~20-engineer rebuild; it does not direct, lead or run it',
  },
  {
    pattern: /20-engineer organization/gi,
    why: 'it is a rebuild across 3 teams, not an organization he owns',
  },
  {
    pattern: /running the web org|to running the web/gi,
    why: 'the title is Senior Manager, Engineering',
  },
  { pattern: /\bnine years\b/gi, why: 'tenure is ten years — intern since March 2016' },
  {
    // The negated form is the *correct* copy ("does not own gateway config"),
    // so only an affirmative ownership claim may trip this.
    pattern:
      /(?<!not )\bowns?\s+(?:the\s+)?(?:gateway|Router policy|supergraph composition|GraphQL)/gi,
    why: 'he works across the federated graph; he does not own gateway config or Router policy',
  },
];

describe('retired scope claims never come back', () => {
  for (const [rel, text] of [
    ['content.ts', contentSource],
    ['llms.txt', llms],
  ] as const) {
    for (const { pattern, why } of RETIRED_CLAIMS) {
      it(`${rel} does not claim: ${why}`, () => {
        const hits = [...text.matchAll(pattern)].map((m) => m[0].trim());
        expect(hits, `${rel} states a retired claim (${why}): ${hits.join(' | ')}`).toEqual([]);
      });
    }
  }
});

describe('shipped defaults', () => {
  it('keeps the AI case-study flag off until CNBC announces', () => {
    expect(FEATURE_FLAGS.showCnbcAiWork).toBe(false);
  });
});
