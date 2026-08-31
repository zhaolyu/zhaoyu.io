/**
 * Open Graph card definitions.
 *
 * Cards are derived from the site's own content constants so a card can never
 * contradict the page it represents — the previous hand-made og-image.png
 * survived a hero rewrite still advertising the old tagline. Rendered to PNG by
 * scripts/generate-og-images.mjs via the prerendered /og/<slug> routes.
 */
import { notesData, heroContent, roleLine } from '$lib/constants/content';
import { CASE_STUDIES } from '$lib/constants/case-studies';
import { visibleItems } from '$lib/utils/feature-flags';

export interface OgCard {
  slug: string;
  kind: 'profile' | 'note' | 'case-study';
  eyebrow: string;
  title: string;
  /** Empty for note cards, whose title already carries the message. */
  subtitle: string;
  footnote: string[];
}

/** Slug of the site-wide card used by the home page, blog index, and manifesto. */
export const SITE_CARD_SLUG = 'site';

function siteCard(): OgCard {
  return {
    slug: SITE_CARD_SLUG,
    kind: 'profile',
    eyebrow: roleLine,
    subtitle: heroContent.tagline,
    title: 'Zhao Yu',
    footnote: ['Agents', 'Edge Architecture', 'Reliability'],
  };
}

export function noteCard(slug: string): OgCard | undefined {
  const note = notesData.notes.find((n) => n.slug === slug);
  if (!note) return undefined;

  return {
    slug,
    kind: 'note',
    eyebrow: `ENGINEERING NOTE · ${note.date.toUpperCase()}`,
    title: note.title,
    subtitle: '',
    footnote: note.tags,
  };
}

export function caseStudyCard(slug: string): OgCard | undefined {
  const cs = visibleItems(CASE_STUDIES).find((c) => c.slug === slug);
  if (!cs) return undefined;

  return {
    slug,
    kind: 'case-study',
    eyebrow: `CASE STUDY · ${cs.period}`,
    title: cs.title,
    subtitle: cs.oneLiner,
    footnote: cs.stack,
  };
}

export function ogCard(slug: string): OgCard | undefined {
  if (slug === SITE_CARD_SLUG) return siteCard();
  return noteCard(slug) ?? caseStudyCard(slug);
}

export function ogCards(): OgCard[] {
  return [
    siteCard(),
    ...notesData.notes.map((note) => noteCard(note.slug)!),
    ...visibleItems(CASE_STUDIES).map((cs) => caseStudyCard(cs.slug)!),
  ];
}
