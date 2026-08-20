/**
 * schema.org JSON-LD builders — one source for every page's structured data,
 * so the agent-facing layer cannot drift from the human-facing copy and the
 * required keys are asserted once (structured-data.test.ts).
 */
import { heroContent, socialDescriptions, type EngineeringNote } from '$lib/constants/content';

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

/** Full ISO date for schema.org; month-granular note dates anchor to the 1st. */
export function toIsoDate(dateISO: string): string {
  return dateISO.length === 7 ? `${dateISO}-01` : dateISO;
}

export function techArticleJsonLd(note: EngineeringNote, description: string) {
  const url = `${SITE_URL}/blog/${note.slug}`;
  const published = toIsoDate(note.dateISO);
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: note.title,
    description,
    url,
    mainEntityOfPage: url,
    datePublished: published,
    dateModified: toIsoDate(note.dateModified ?? note.dateISO),
    image: `${SITE_URL}/og/${note.slug}.png`,
    author: PERSON,
    publisher: PERSON,
    keywords: note.tags.join(', '),
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
