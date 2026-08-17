import { error } from '@sveltejs/kit';
import { DESIGN_SYSTEM_CARDS, designSystemCard } from '$lib/constants/design-system';

export const prerender = true;

/** Prerender one page per registered card — the bundle `pnpm design-system` copies. */
export function entries() {
  return DESIGN_SYSTEM_CARDS.map((card) => ({ card: card.slug }));
}

export function load({ params }) {
  const card = designSystemCard(params.card);
  if (!card) error(404, `Unknown design system card: ${params.card}`);
  return { card };
}
