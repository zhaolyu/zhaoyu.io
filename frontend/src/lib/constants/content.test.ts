import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { performanceMetrics, SOURCES, heroContent, footerManifesto } from './content';

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
