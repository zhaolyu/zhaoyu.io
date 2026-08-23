import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

/**
 * Guards the metric-matched fallback that keeps the font swap from moving the
 * page. @fontsource ships `font-display: swap`, so the fallback paints first
 * and the real face replaces it — if the two occupy different space, every
 * block of body copy reflows and CLS is charged for it.
 *
 * Measured on the built site: with the fallback below, total prose height
 * differs from Geist Sans by 1.7px across ~19,930px of content. Without it
 * (plain system-ui) the same page differs by 77.4px.
 *
 * These four values are a matched set derived from one measurement. Changing
 * or re-subsetting the font invalidates all of them together — re-measure the
 * width ratio over real page copy and recompute, rather than nudging one.
 */

const here = dirname(fileURLToPath(import.meta.url));
const appCss = readFileSync(resolve(here, '../../app.css'), 'utf8');

const FALLBACK_FAMILY = 'Geist Sans Fallback';

// The @font-face block for the fallback, so assertions can't accidentally match
// a value that lives somewhere else in the stylesheet.
const fallbackFace = (() => {
  const start = appCss.indexOf(`font-family: '${FALLBACK_FAMILY}'`);
  if (start === -1) return null;
  const end = appCss.indexOf('}', start);
  return end === -1 ? null : appCss.slice(start, end);
})();

/** Geist Sans, read from the OS/2 + hhea tables of the shipped woff. */
const GEIST = { unitsPerEm: 1000, ascent: 920, descent: 220, lineGap: 100 };
/** Empirical width ratio vs Arial over 12,393 chars of the site's own prose. */
const SIZE_ADJUST = 1.0404;

const pct = (block: string, prop: string): number | null => {
  const m = block.match(new RegExp(`${prop}:\\s*([\\d.]+)%`));
  return m ? Number(m[1]) : null;
};

describe('metric-matched font fallback', () => {
  it('declares the fallback @font-face', () => {
    expect(fallbackFace, `app.css must define an @font-face for ${FALLBACK_FAMILY}`).not.toBeNull();
  });

  it('is reachable from the sans stack, ahead of the generic fallbacks', () => {
    const stack = appCss.match(/--font-sans:\s*([^;]+);/)?.[1] ?? '';
    expect(stack).toContain(FALLBACK_FAMILY);
    // It must sit after the real face but before system-ui, otherwise the
    // unmatched system font paints first and the override does nothing.
    expect(stack.indexOf('Geist Sans'), 'real face comes first').toBeLessThan(
      stack.indexOf(FALLBACK_FAMILY),
    );
    expect(stack.indexOf(FALLBACK_FAMILY)).toBeLessThan(stack.indexOf('system-ui'));
  });

  it('resolves to a font that exists on the major platforms', () => {
    // macOS/Windows get Arial or Helvetica; most Linux images ship Liberation
    // Sans, which is metric-compatible with Arial. Losing these makes the
    // overrides apply to whatever the browser picks, which is not measurable.
    expect(fallbackFace).toMatch(/local\(['"]?Arial/);
    expect(fallbackFace).toMatch(/Liberation Sans/);
  });

  it('carries all four overrides — a partial set is worse than none', () => {
    for (const prop of [
      'size-adjust',
      'ascent-override',
      'descent-override',
      'line-gap-override',
    ]) {
      expect(pct(fallbackFace ?? '', prop), `${prop} must be set`).not.toBeNull();
    }
  });

  it('derives the vertical overrides from the real font metrics and size-adjust', () => {
    const adjustedEm = GEIST.unitsPerEm * SIZE_ADJUST;
    const expected = {
      'ascent-override': (GEIST.ascent / adjustedEm) * 100,
      'descent-override': (GEIST.descent / adjustedEm) * 100,
      'line-gap-override': (GEIST.lineGap / adjustedEm) * 100,
    };
    for (const [prop, want] of Object.entries(expected)) {
      // Tight tolerance: these are rounded to 2dp in the stylesheet, so a real
      // drift shows up immediately while rounding does not.
      expect(pct(fallbackFace ?? '', prop), prop).toBeCloseTo(want, 1);
    }
  });

  it('keeps size-adjust near the measured ratio, not the OS/2 one', () => {
    const size = pct(fallbackFace ?? '', 'size-adjust');
    expect(size).toBeCloseTo(SIZE_ADJUST * 100, 1);
    // The OS/2 xAvgCharWidth ratio for this pair implies 132.76%, which
    // overshoots badly enough to add two lines of wrap to the hero copy. If
    // someone recomputes from the tables instead of measuring, catch it here.
    expect(size).toBeLessThan(115);
  });
});
