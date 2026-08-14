import { ogCards } from '$lib/constants/og';

export const prerender = true;

/**
 * The exact card copy at render time. generate-og-images.mjs copies this
 * alongside the PNGs so og.test.ts can detect an image that no longer matches
 * the content it was generated from — without needing to read pixels.
 */
export function GET() {
  const manifest = Object.fromEntries(ogCards().map((card) => [card.slug, card]));

  return new Response(`${JSON.stringify(manifest, null, 2)}\n`, {
    headers: { 'Content-Type': 'application/json' },
  });
}
