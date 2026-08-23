import { describe, it, expect } from 'vitest';
import {
  CASE_STUDIES,
  caseStudy,
  caseStudyProblems,
  caseStudyWordCount,
  MIN_WORDS,
  type CaseStudy,
} from './case-studies';
import { visibleItems } from '$lib/utils/feature-flags';
import { notesData } from './content';

const noteSlugs = new Set(notesData.notes.map((n) => n.slug));

/** A minimal structurally-valid study for exercising the validator. */
function fixture(overrides: Partial<CaseStudy> = {}): CaseStudy {
  const paragraph = Array(100).fill('word').join(' ');
  return {
    slug: 'fixture-study',
    title: 'Fixture Study',
    oneLiner: 'A fixture used to prove the validator works.',
    role: 'Architect',
    period: '2024–2025',
    dateISO: '2026-08-20',
    sections: {
      context: [paragraph, paragraph],
      constraints: [paragraph, paragraph],
      options: [paragraph, paragraph, paragraph],
      decision: [paragraph, paragraph],
      architecture: { diagram: 'fixture-arch', caption: paragraph },
      outcome: [{ metric: 'p75 LCP', value: '1.7s', basis: 'CrUX, all devices, Jul 2026' }],
      regrets: [paragraph, paragraph],
      myRoleVsTeam: [paragraph, paragraph],
    },
    sources: [{ label: 'Chrome UX Report', href: 'https://treo.sh/sitespeed/www.cnbc.com' }],
    relatedNotes: [notesData.notes[0].slug],
    stack: ['Edge', 'React'],
    ...overrides,
  };
}

describe('validator (fixture-tested so an empty registry still proves the rules)', () => {
  it('accepts a structurally complete study', () => {
    expect(caseStudyProblems(fixture(), noteSlugs)).toEqual([]);
  });

  it('counts prose words across all sections', () => {
    expect(caseStudyWordCount(fixture())).toBeGreaterThanOrEqual(MIN_WORDS);
  });

  it.each([
    [
      'empty section',
      fixture({ sections: { ...fixture().sections, regrets: [] } }),
      /"regrets" is empty/,
    ],
    [
      'missing basis',
      fixture({
        sections: { ...fixture().sections, outcome: [{ metric: 'x', value: '1', basis: ' ' }] },
      }),
      /has no basis/,
    ],
    ['no sources', fixture({ sources: [] }), /no sources/],
    [
      'non-https source',
      fixture({ sources: [{ label: 'x', href: 'http://example.com' }] }),
      /not an https URL/,
    ],
    ['bad date', fixture({ dateISO: '2026-08' }), /not YYYY-MM-DD/],
    ['bad slug', fixture({ slug: 'Not A Slug' }), /not kebab-case/],
    ['unknown related note', fixture({ relatedNotes: ['no-such-note'] }), /unknown note/],
  ])('rejects a study with %s', (_name, broken, pattern) => {
    expect(caseStudyProblems(broken, noteSlugs).join('; ')).toMatch(pattern);
  });

  it('rejects a study under the word floor', () => {
    const thin = fixture();
    thin.sections.options = ['too short'];
    thin.sections.context = ['too short'];
    expect(caseStudyProblems(thin, noteSlugs).join('; ')).toMatch(/words — a case study argues/);
  });
});

describe('registry', () => {
  it('every registered study is publishable', () => {
    for (const cs of CASE_STUDIES) {
      expect(caseStudyProblems(cs, noteSlugs), cs.slug).toEqual([]);
    }
  });

  it('slugs are unique and titles distinct', () => {
    const slugs = CASE_STUDIES.map((cs) => cs.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const titles = CASE_STUDIES.map((cs) => cs.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it('looks up by slug and returns undefined for unknown slugs', () => {
    expect(caseStudy('definitely-not-registered')).toBeUndefined();
    for (const cs of CASE_STUDIES) expect(caseStudy(cs.slug)).toBe(cs);
  });

  it('flag-gated studies are excluded from the visible set under default flags', () => {
    const visible = visibleItems(CASE_STUDIES);
    for (const cs of visible) expect(cs.featureFlag).toBeUndefined();
  });
});
