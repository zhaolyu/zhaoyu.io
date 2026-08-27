/**
 * schema.org JSON-LD builders — one source for every page's structured data,
 * so the agent-facing layer cannot drift from the human-facing copy and the
 * required keys are asserted once (structured-data.test.ts).
 */
import { heroContent, socialDescriptions, type EngineeringNote } from '$lib/constants/content';
import type { CaseStudy } from '$lib/constants/case-studies';

export const SITE_URL = 'https://zhaoyu.io';
export const SITE_CARD_IMAGE = `${SITE_URL}/og/site.png`;

/** Public profiles that identify the same person. */
export const SAME_AS = ['https://github.com/zhaolyu', 'https://linkedin.com/in/zhaolyu'] as const;

export const PERSON = {
  '@type': 'Person',
  name: 'Zhao Yu',
  url: SITE_URL,
} as const;

export const KNOWS_ABOUT = [
  'Engineering Leadership',
  'AI Governance',
  'LLM Streaming Interfaces',
  'System Prompt Architecture',
  'Video Platforms',
  'Edge Computing',
  'Akamai EdgeWorkers',
  'Isomorphic React',
  'SvelteKit',
  'AI-Assisted Software Engineering',
  'Agentic AI Workflows',
  'Performance Engineering',
  'Distributed Systems',
] as const;

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    ...PERSON,
    jobTitle: 'Senior Manager, Engineering',
    sameAs: [...SAME_AS],
    worksFor: { '@type': 'Organization', name: 'Versant Media / CNBC' },
    // The same story the hero and meta description tell — role and scope,
    // no internal specifics (see content.ts header).
    description: `${socialDescriptions.meta} ${heroContent.bio}`,
    knowsAbout: [...KNOWS_ABOUT],
    image: SITE_CARD_IMAGE,
  };
}

/**
 * Author identity for the Open Graph article namespace.
 *
 * The JSON-LD already carries `author`, but LinkedIn's Post Inspector — and
 * the Featured-section card it drives — reads Open Graph, not schema.org. A
 * page that declares `og:type="article"` and then omits `article:*` is making
 * a promise the rest of the head does not keep, which is what surfaced as a
 * missing author on the note cards.
 *
 * `article:author` is a profile URL by spec, so it points at the LinkedIn
 * profile rather than repeating the display name.
 */
export const AUTHOR_NAME = 'Zhao Yu';
export const AUTHOR_PROFILE = 'https://linkedin.com/in/zhaolyu';

export interface OgTag {
  property: string;
  content: string;
}

/**
 * The `article:*` half of an article page's head. Returned as data rather than
 * markup so every article route renders the same set from one definition, and
 * so it can be asserted without mounting a component.
 */
export function articleOgTags(meta: {
  /** YYYY-MM-DD */
  datePublished: string;
  /** YYYY-MM-DD; defaults to datePublished. */
  dateModified?: string;
  tags?: readonly string[];
}): OgTag[] {
  return [
    { property: 'article:author', content: AUTHOR_PROFILE },
    { property: 'article:published_time', content: meta.datePublished },
    { property: 'article:modified_time', content: meta.dateModified ?? meta.datePublished },
    ...(meta.tags ?? []).map((tag) => ({ property: 'article:tag', content: tag })),
  ];
}

export function techArticleJsonLd(note: EngineeringNote, description: string) {
  const url = `${SITE_URL}/blog/${note.slug}`;
  const published = note.dateISO;
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: note.title,
    description,
    url,
    mainEntityOfPage: url,
    datePublished: published,
    dateModified: note.dateModified ?? note.dateISO,
    image: `${SITE_URL}/og/${note.slug}.png`,
    author: PERSON,
    publisher: PERSON,
    keywords: note.tags.join(', '),
  };
}

export function caseStudyJsonLd(cs: CaseStudy) {
  const url = `${SITE_URL}/work/${cs.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: cs.title,
    description: cs.oneLiner,
    url,
    mainEntityOfPage: url,
    datePublished: cs.dateISO,
    dateModified: cs.dateModified ?? cs.dateISO,
    image: `${SITE_URL}/og/${cs.slug}.png`,
    author: PERSON,
    publisher: PERSON,
    keywords: cs.stack.join(', '),
  };
}

export interface ArticleMeta {
  headline: string;
  description: string;
  path: string;
  /** YYYY-MM-DD */
  datePublished: string;
  /** YYYY-MM-DD; defaults to datePublished. */
  dateModified?: string;
  keywords: string;
}

export function articleJsonLd(meta: ArticleMeta) {
  const url = `${SITE_URL}${meta.path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.headline,
    description: meta.description,
    url,
    mainEntityOfPage: url,
    datePublished: meta.datePublished,
    dateModified: meta.dateModified ?? meta.datePublished,
    image: SITE_CARD_IMAGE,
    author: PERSON,
    publisher: PERSON,
    keywords: meta.keywords,
  };
}

/**
 * Serialised for `{@html}` inside <svelte:head>. The tag is assembled from
 * split parts because a literal script open/close token anywhere in a Svelte
 * component (even in a string) ends the surrounding block.
 */
export function jsonLdScript(data: object): string {
  return '<scr' + 'ipt type="application/ld+json">' + JSON.stringify(data) + '</scr' + 'ipt>';
}
