import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { performanceMetrics, SOURCES, heroContent, footerManifesto, notesData } from './content';

/**
 * Metrics discipline: every headline number is public, cites its source, and
 * appears as a figure in one place — the metrics grid — rather than being
 * repeated until it reads as the only number there is.
 */
const contentSource = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), './content.ts'),
  'utf8',
);

const occurrences = (needle: string) => contentSource.split(needle).length - 1;

describe('performanceMetrics', () => {
  it('carries a basis and a public source for every figure', () => {
    expect(performanceMetrics.length).toBeGreaterThanOrEqual(3);
    for (const metric of performanceMetrics) {
      expect(metric.basis, `${metric.label} has no basis`).toMatch(/\S/);
      expect(metric.source.href, `${metric.label} has no source`).toMatch(/^https:\/\//);
      expect(Object.values(SOURCES)).toContainEqual(metric.source);
    }
  });

  it('uses the publicly reported audience figure, not the rounded-up one', () => {
    expect(occurrences('50M')).toBe(0);
    expect(occurrences('47M')).toBeLessThanOrEqual(4);
    const audience = performanceMetrics.find((m) => m.value === '47M');
    expect(audience?.source).toEqual(SOURCES.versantInvestorDay2025);
  });

  it('states field performance from CrUX, not lab or internal numbers', () => {
    const lcp = performanceMetrics.find((m) => m.label === 'p75 LCP');
    expect(lcp?.source).toEqual(SOURCES.cruxCnbc);
    expect(lcp?.basis).toMatch(/Chrome UX Report/);
  });
});

describe('figures stay where they are load-bearing', () => {
  it('keeps the footer manifesto free of numbers', () => {
    for (const item of footerManifesto) {
      expect(item.body, item.title).not.toMatch(/\d/);
    }
  });

  it('keeps the hero bio to one figure', () => {
    expect((heroContent.bio.match(/\d[\d.,]*[KM%]?/g) ?? []).length).toBeLessThanOrEqual(1);
  });
});

describe('note sources and dates (3.1)', () => {
  it('gives every note a full YYYY-MM-DD publication date', () => {
    // Month-granular dates forced shims in the RSS, sitemap and JSON-LD
    // builders, and made every note in a month share one pubDate.
    for (const note of notesData.notes) {
      expect(note.dateISO, note.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(note.dateISO)), `${note.slug} parses`).toBe(false);
    }
  });

  it('never dates a note in the future', () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const note of notesData.notes) {
      expect(note.dateISO <= today, `${note.slug} is dated ${note.dateISO}`).toBe(true);
    }
  });

  it('keeps dateModified on or after dateISO when present', () => {
    for (const note of notesData.notes) {
      if (note.dateModified) {
        expect(note.dateModified, note.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(note.dateModified >= note.dateISO, note.slug).toBe(true);
      }
    }
  });

  it('gives every note at least one source', () => {
    // The site's own standard: done without an attached receipt is
    // self-attestation. A note with nothing behind it should not ship.
    for (const note of notesData.notes) {
      expect(note.sources?.length ?? 0, `${note.slug} has no sources`).toBeGreaterThan(0);
    }
  });

  it('gives every source a non-empty label, and a valid https href when linked', () => {
    for (const note of notesData.notes) {
      for (const source of note.sources) {
        expect(source.label.trim().length, `${note.slug} source label`).toBeGreaterThan(0);
        if (source.href !== undefined) {
          expect(source.href, `${note.slug} -> ${source.label}`).toMatch(/^https:\/\//);
        }
      }
    }
  });

  it('labels unlinked sources as first-hand rather than leaving them ambiguous', () => {
    // An unlinked source is the author's own practice. Saying so is the point;
    // a bare label that looks like a citation but resolves nowhere is worse
    // than no source at all.
    for (const note of notesData.notes) {
      for (const source of note.sources) {
        if (source.href === undefined) {
          expect(source.label, `${note.slug} -> ${source.label}`).toMatch(
            /^(First-hand|This site)/,
          );
        }
      }
    }
  });

  it('does not reuse one source label twice within a note', () => {
    for (const note of notesData.notes) {
      const labels = note.sources.map((s) => s.label);
      expect(new Set(labels).size, note.slug).toBe(labels.length);
    }
  });
});
