import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  personJsonLd,
  techArticleJsonLd,
  articleJsonLd,
  jsonLdScript,
  SAME_AS,
  articleOgTags,
  AUTHOR_PROFILE,
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
  it('emits a script tag that survives Svelte template parsing', () => {
    const out = jsonLdScript({ a: 1 });
    expect(out.startsWith('<script type="application/ld+json">')).toBe(true);
    expect(out.endsWith('</script>')).toBe(true);
    expect(out).toContain('{"a":1}');
  });
});

describe('articleOgTags', () => {
  it('carries the author as a profile URL', () => {
    const tags = articleOgTags({ datePublished: '2026-07-11' });
    const author = tags.find((t) => t.property === 'article:author');
    expect(author?.content).toMatch(/^https:\/\//);
    expect(author?.content).toBe(AUTHOR_PROFILE);
  });

  it('defaults modified_time to published_time', () => {
    const tags = articleOgTags({ datePublished: '2026-07-11' });
    const at = (p: string) => tags.find((t) => t.property === p)?.content;
    expect(at('article:published_time')).toBe('2026-07-11');
    expect(at('article:modified_time')).toBe('2026-07-11');
  });

  it('emits one article:tag per tag, and none when there are none', () => {
    const withTags = articleOgTags({
      datePublished: '2026-07-11',
      tags: ['AI Engineering', 'Reliability'],
    });
    expect(withTags.filter((t) => t.property === 'article:tag').map((t) => t.content)).toEqual([
      'AI Engineering',
      'Reliability',
    ]);
    expect(
      articleOgTags({ datePublished: '2026-07-11' }).filter((t) => t.property === 'article:tag'),
    ).toEqual([]);
  });
});

/**
 * The gap this file exists to prevent: three routes declared
 * og:type="article" and none of them emitted the article namespace, so
 * LinkedIn's Post Inspector reported the note cards as having no author.
 * Every route that claims to be an article must render articleOgTags, and
 * any route promising a large summary card must supply the image for it.
 */
describe('article routes keep the promises their head makes', () => {
  const routes = [
    'src/routes/(main)/blog/[slug]/+page.svelte',
    'src/routes/(main)/work/[slug]/+page.svelte',
    'src/routes/(standalone)/ai-manifesto/+page.svelte',
  ];
  const read = (rel: string) =>
    readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../../', rel), 'utf8');

  for (const rel of routes) {
    const source = read(rel);

    it(`${rel} backs og:type=article with the article namespace`, () => {
      expect(source).toMatch(/og:type"\s+content="article"/);
      expect(source, 'must render articleOgTags, not hand-rolled article:* tags').toContain(
        'articleOgTags',
      );
      expect(source).toMatch(/\{#each ogTags as tag/);
    });

    it(`${rel} supplies an image for the card it promises`, () => {
      if (/twitter:card"\s+content="summary_large_image"/.test(source)) {
        expect(source, 'summary_large_image with no twitter:image renders blank').toMatch(
          /twitter:image"/,
        );
      }
      expect(source).toMatch(/og:image"/);
    });
  }
});
