import { error } from '@sveltejs/kit';
import { ogCard, ogCards } from '$lib/constants/og';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => ogCards().map((card) => ({ slug: card.slug }));

export const load: PageLoad = ({ params }) => {
  const card = ogCard(params.slug);
  if (!card) error(404, 'No Open Graph card for this slug');

  return { card };
};
