import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import {
  heroContent,
  roleLine,
  roleTitle,
  scopeLine,
  tenureLine,
  socialDescriptions,
  narrativeBio,
  builderProjects,
} from './content';
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

/**
 * The canon, owner decision 2026-11-09: one title, one scope line and one
 * tenure line, word for word on every surface that states the role. Spelled
 * out here as literals, not imported, so an edit to the constants in
 * content.ts has to be made twice to get through.
 */
const CANON_TITLE = 'Senior Manager, Engineering · Versant · CNBC Core';
const CANON_SCOPE =
  '8 engineers and 2 QE direct, co-leading the ~20-engineer CNBC.com rebuild across 3 teams.';
const CANON_TENURE = "Ten years on CNBC's platforms since March 2016, intern to Senior Manager.";

describe('hero', () => {
  it('states the work in at most 40 words, with the role kept out of the headline', () => {
    // Owner decision, 2026-11-09, superseding the craft-first hero (2026-09-01,
    // and the headline rule of 2026-10-04): the headline says what Zhao builds,
    // and the role and scope sit on their own lines beneath it. Title and
    // headcount never ride inside the headline itself.
    const headline = `${heroContent.headline.primary} ${heroContent.headline.accent}`;
    expect(words(headline)).toBeLessThanOrEqual(40);
    expect(headline).not.toMatch(/senior manager|versant|QE|20-engineer|player-coach/i);
    expect(headline).not.toMatch(/\b(leads|directs|runs)\b/i);
  });

  it('puts the canon scope line directly under the headline, verbatim', () => {
    expect(scopeLine).toBe(CANON_SCOPE);
    expect(heroContent.scope).toBe(CANON_SCOPE);
  });

  it('states identity as the role of record and nothing more', () => {
    const { identity } = heroContent;
    expect(roleTitle).toBe(CANON_TITLE);
    expect(identity.role).toBe(roleTitle);
    const line = `${identity.name} ${identity.role} ${identity.location}`;
    expect(line).not.toMatch(/QE|20-engineer|player-coach|\b(leads|directs|runs)\b/i);
  });

  it('opens the bio on the canon tenure line and carries at most one figure', () => {
    expect(tenureLine).toBe(CANON_TENURE);
    expect(heroContent.bio.startsWith(CANON_TENURE)).toBe(true);
    const figures = heroContent.bio.match(/\d[\d.,]*[KM%]?/g) ?? [];
    expect(figures.length).toBeLessThanOrEqual(1);
  });

  it('keeps the OG tagline in step with the headline', () => {
    expect(heroContent.tagline).toBe(heroContent.headline.primary);
  });

  it('keeps the role line intact for the finding-aid surfaces', () => {
    // The OG card eyebrow states the role as fact in its all-caps register.
    expect(roleLine).toBe(CANON_TITLE.toUpperCase());
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
    // drifts back into "runs a 20-engineer org". Since 2026-11-09 the hero
    // carries it too (asserted above); About and the agent-facing surfaces
    // keep it verbatim.
    const surfaces: Array<[string, string]> = [
      ['narrative bio', narrativeBio.paragraphs[0]],
      ['meta description', socialDescriptions.meta],
      ['llms.txt', llms],
    ];
    for (const [name, text] of surfaces) {
      expect(text, `${name} must name the direct team`).toMatch(/8 engineers and 2 QE/);
      expect(text, `${name} must say co-lead, not direct or run`).toMatch(/co-lead/i);
    }
  });

  it('states the same title, scope line and tenure word for word on every surface', () => {
    const surfaces: Array<[string, string]> = [
      ['About', narrativeBio.paragraphs.join(' ')],
      ['llms.txt', llms],
    ];
    expect(narrativeBio.title).toBe(CANON_TITLE);
    expect(llms).toContain(CANON_TITLE);
    for (const [name, text] of surfaces) {
      expect(text, `${name} must carry the scope line verbatim`).toContain(CANON_SCOPE);
      expect(text, `${name} must carry the tenure line verbatim`).toContain(CANON_TENURE);
    }
    expect(socialDescriptions.meta).toBe(`${CANON_TITLE}. ${CANON_SCOPE}`);
    expect(personJsonLd().description).toBe(socialDescriptions.meta);
    expect(personJsonLd().worksFor.name).toBe(EMPLOYER);
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
 * ~20-engineer rebuild across three teams, ten years in. Anyone reading
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
    pattern: /both tracks|player-coach/gi,
    why: 'the role is engineering leadership, not a choice between two tracks',
  },
  {
    // A dated past role is fine: the timeline entry (its year sits beside it)
    // or "Principal Engineer (July 2025 to April 2026)". Undated, it reads as
    // the current title.
    pattern: /Principal Engineer(?!\s+\(July 2025 to\s+April 2026\))(?!',\s*company)/g,
    why: 'Principal Engineer appears only as a dated past role',
  },
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
