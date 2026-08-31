import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { ogCards, ogCard, noteCard, caseStudyCard, SITE_CARD_SLUG } from './og';
import { notesData, heroContent, roleLine } from './content';
import { CASE_STUDIES } from './case-studies';
import { visibleItems } from '$lib/utils/feature-flags';

const staticOg = resolve(dirname(fileURLToPath(import.meta.url)), '../../../static/og');

const REGENERATE = 'Run `pnpm build && pnpm og`, then commit static/og/.';

describe('og card definitions', () => {
  it('covers the site card, every note, and every visible case study', () => {
    const slugs = ogCards().map((c) => c.slug);
    expect(slugs).toEqual([
      SITE_CARD_SLUG,
      ...notesData.notes.map((n) => n.slug),
      ...visibleItems(CASE_STUDIES).map((cs) => cs.slug),
    ]);
  });

  it('builds case-study cards only for visible studies', () => {
    expect(caseStudyCard('not-a-study')).toBeUndefined();
    for (const cs of visibleItems(CASE_STUDIES)) {
      const card = caseStudyCard(cs.slug)!;
      expect(card.kind).toBe('case-study');
      expect(card.subtitle).toBe(cs.oneLiner);
    }
  });

  it('tracks the hero, so the card cannot advertise a retired tagline', () => {
    // The hand-made image this replaced survived a hero rewrite still showing
    // the old accent line. That is the regression this asserts against.
    const site = ogCard(SITE_CARD_SLUG)!;
    expect(site.subtitle).toBe(heroContent.tagline);
    expect(site.eyebrow).toBe(roleLine);
  });

  it('gives note cards their own title and tags', () => {
    const note = notesData.notes[0];
    const card = noteCard(note.slug)!;
    expect(card.title).toBe(note.title);
    expect(card.footnote).toEqual(note.tags);
  });

  it('returns undefined for an unknown slug', () => {
    expect(ogCard('not-a-real-slug')).toBeUndefined();
  });
});

describe('generated card images', () => {
  it('has a committed PNG for every card', () => {
    for (const card of ogCards()) {
      const png = resolve(staticOg, `${card.slug}.png`);
      expect(existsSync(png), `Missing static/og/${card.slug}.png. ${REGENERATE}`).toBe(true);
    }
  });

  it('matches the copy the images were generated from', () => {
    const manifestPath = resolve(staticOg, 'manifest.json');
    expect(existsSync(manifestPath), `Missing static/og/manifest.json. ${REGENERATE}`).toBe(true);

    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const current = Object.fromEntries(ogCards().map((card) => [card.slug, card]));

    // Content moved but the images didn't — exactly how the previous OG image
    // went stale. Deleting this assertion is not the fix.
    expect(manifest, `Card images are out of date. ${REGENERATE}`).toEqual(current);
  });

  it('keeps the legacy flat og-image.png for links shared before per-card images', () => {
    expect(existsSync(resolve(staticOg, '..', 'og-image.png'))).toBe(true);
  });
});
