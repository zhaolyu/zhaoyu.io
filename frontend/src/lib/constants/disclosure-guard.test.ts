import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
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
/**
 * Every file that can put a string in front of a reader. This list was
 * previously hand-picked and missed `ProjectCard.svelte`, which shipped an
 * unsourced 98.4% cache-hit rate inside an SVG to production — the guard was
 * green the whole time because it never read the file. Component markup is now
 * walked rather than enumerated, so a new component is covered by default.
 */
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
