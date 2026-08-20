import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

/**
 * Disclosure guard. Versant is a public company; the figures and product
 * details below have not been disclosed in any filing, earnings call, press
 * release, or investor deck as of 2026-08-19, so they do not ship on any
 * surface — human or agent-facing. A flag is not an exemption: content.ts is
 * bundled into the client JS whether or not a card renders.
 *
 * Remove an entry only when the fact appears in a public Versant/CNBC
 * disclosure, and add that disclosure to SOURCES in content.ts first.
 */
const DENY_LIST: Array<{ pattern: RegExp; why: string }> = [
  { pattern: /\$5\d/, why: 'subscription ARR is not publicly disclosed' },
  { pattern: /170K/, why: 'subscriber count is not publicly disclosed' },
  {
    pattern: /200-subscriber|200 subscribers|200 Subs/i,
    why: 'AI beta cohort size is not announced',
  },
  {
    pattern: /sole frontend architect/i,
    why: 'overclaims scope; reads as bus-factor, not leadership',
  },
  { pattern: /\bI own the\b/, why: 'overclaims scope' },
  {
    pattern: /rotat(e|ing) through|no dedicated PM/i,
    why: 'publicly criticises internal staffing',
  },
  { pattern: /resumable sessions|five in flight/i, why: 'unannounced video roadmap' },
  { pattern: /query planner|tool grader/i, why: 'unannounced AI product internals' },
  { pattern: /25% velocity|15% fewer/i, why: 'internal governance metrics' },
  { pattern: /50M\+?/, why: 'the public ComScore figure is 47M (Versant Investor Day 2025)' },
  { pattern: /Top 1%/i, why: 'contradicted by public CrUX data (origin fails CWV on CLS)' },
  { pattern: /98\.4%/, why: 'cache-hit rate has no public source' },
  { pattern: /<\s?300ms/, why: 'edge TTFB has no public source; public CrUX p75 TTFB is 0.7s' },
  { pattern: /1\.1s LCP/i, why: 'public CrUX p75 LCP is 1.7s (Jul 2026)' },
];

const here = dirname(fileURLToPath(import.meta.url));
const SURFACES = [
  './content.ts',
  './og.ts',
  './structured-data.ts',
  '../../../static/llms.txt',
  '../../routes/(main)/+page.svelte',
  '../../routes/(standalone)/ai-manifesto/+page.svelte',
].map((rel) => ({ rel, text: readFileSync(resolve(here, rel), 'utf8') }));

describe('disclosure guard', () => {
  for (const { rel, text } of SURFACES) {
    for (const { pattern, why } of DENY_LIST) {
      it(`${rel} does not contain ${pattern} (${why})`, () => {
        // Strip this very list if the surface happens to include it.
        expect(text).not.toMatch(pattern);
      });
    }
  }
});
