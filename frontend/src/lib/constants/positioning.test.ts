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

  it('keeps the canonical team phrasing — it must match LinkedIn', () => {
    expect(heroContent.headline.accent).toMatch(/20 engineers/);
    expect(narrativeBio.paragraphs[0]).toMatch(/20-engineer organization/);
    expect(llms).toMatch(/20-engineer organization/);
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

describe('shipped defaults', () => {
  it('keeps the AI case-study flag off until CNBC announces', () => {
    expect(FEATURE_FLAGS.showCnbcAiWork).toBe(false);
  });
});
