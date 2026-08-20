import { describe, it, expect } from 'vitest';
import {
  personJsonLd,
  techArticleJsonLd,
  articleJsonLd,
  jsonLdScript,
  toIsoDate,
  SAME_AS,
} from './structured-data';
import { notesData } from './content';
import { caseStudyJsonLd } from './structured-data';
import type { CaseStudy } from './case-studies';

describe('personJsonLd', () => {
  const person = personJsonLd();

  it('identifies the same person on GitHub and LinkedIn', () => {
    expect(person.sameAs).toEqual([...SAME_AS]);
    expect(person.sameAs).toContain('https://linkedin.com/in/zhaolyu');
    expect(person.sameAs).toContain('https://github.com/zhaolyu');
  });

  it('carries the required keys', () => {
    expect(person['@type']).toBe('Person');
    expect(person.name).toBe('Zhao Yu');
    expect(person.jobTitle).toMatch(/\S/);
    expect(person.url).toBe('https://zhaoyu.io');
    expect(person.image).toMatch(/^https:\/\/zhaoyu\.io\/og\//);
    expect(person.worksFor.name).toMatch(/Versant/);
    expect(person.knowsAbout.length).toBeGreaterThan(5);
  });
});

describe('techArticleJsonLd', () => {
  const note = notesData.notes[0];
  const article = techArticleJsonLd(note, 'excerpt');

  it('has full dates, an image, an author and a publisher', () => {
    expect(article.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(article.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(article.image).toBe(`https://zhaoyu.io/og/${note.slug}.png`);
    expect(article.author.name).toBe('Zhao Yu');
    expect(article.publisher.name).toBe('Zhao Yu');
    expect(article.url).toBe(`https://zhaoyu.io/blog/${note.slug}`);
    expect(article.mainEntityOfPage).toBe(article.url);
  });

  it('prefers an explicit dateModified when a note has one', () => {
    const edited = techArticleJsonLd({ ...note, dateModified: '2026-08-19' }, 'x');
    expect(edited.dateModified).toBe('2026-08-19');
  });
});

describe('caseStudyJsonLd', () => {
  const study = {
    slug: 'fixture-study',
    title: 'Fixture Study',
    oneLiner: 'One sentence.',
    role: 'Architect',
    period: '2024–2025',
    dateISO: '2026-08-20',
    sections: {} as CaseStudy['sections'],
    sources: [],
    relatedNotes: [],
    stack: ['Edge', 'React'],
  } as CaseStudy;

  it('carries full dates, image, author, publisher and canonical URL', () => {
    const article = caseStudyJsonLd(study);
    expect(article['@type']).toBe('TechArticle');
    expect(article.url).toBe('https://zhaoyu.io/work/fixture-study');
    expect(article.mainEntityOfPage).toBe(article.url);
    expect(article.datePublished).toBe('2026-08-20');
    expect(article.dateModified).toBe('2026-08-20');
    expect(article.image).toBe('https://zhaoyu.io/og/fixture-study.png');
    expect(article.author.name).toBe('Zhao Yu');
    expect(article.keywords).toBe('Edge, React');
  });

  it('prefers an explicit dateModified', () => {
    expect(caseStudyJsonLd({ ...study, dateModified: '2026-09-01' }).dateModified).toBe(
      '2026-09-01',
    );
  });
});

describe('articleJsonLd', () => {
  it('defaults dateModified to datePublished', () => {
    const a = articleJsonLd({
      headline: 'h',
      description: 'd',
      path: '/ai-manifesto',
      datePublished: '2026-07-01',
      keywords: 'k',
    });
    expect(a.dateModified).toBe('2026-07-01');
    expect(a.url).toBe('https://zhaoyu.io/ai-manifesto');
    expect(a.image).toMatch(/og\/site\.png$/);
  });
});

describe('helpers', () => {
  it('anchors month-granular dates to the first of the month', () => {
    expect(toIsoDate('2026-07')).toBe('2026-07-01');
    expect(toIsoDate('2026-07-15')).toBe('2026-07-15');
  });

  it('emits a script tag that survives Svelte template parsing', () => {
    const out = jsonLdScript({ a: 1 });
    expect(out.startsWith('<script type="application/ld+json">')).toBe(true);
    expect(out.endsWith('</script>')).toBe(true);
    expect(out).toContain('{"a":1}');
  });
});
