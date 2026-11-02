/**
 * Feature flags — gate content that isn't ready to be public.
 */
export const FEATURE_FLAGS = {
  /**
   * Reserved for the AI-product case study and any copy that goes beyond what
   * Versant has disclosed publicly ("AI-powered investing tools" in CNBC's
   * next-generation platform). Nothing gated by this flag lives in this
   * repository until CNBC announces: a flag only hides content from the
   * rendered page, not from the shipped JS bundle. Flip to true at launch and
   * add the content in the same change.
   */
  showCnbcAiWork: false,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

/**
 * Animation and interaction constants
 */
export const ANIMATION_CONFIG = {
  scrollThreshold: {
    nav: 20, // pixels - navbar backdrop blur trigger
  },
  scrollPastThreshold: 200, // pixels - threshold for "scrolled past" detection (used in intersection observers)
  intersectionObserver: {
    threshold: 0.2, // 20% visibility (desktop)
    rootMargin: '0px 0px -50px 0px', // desktop
    mobile: {
      threshold: 0.15, // 15% visibility (more lenient for smaller viewports)
      rootMargin: '0px 0px -80px 0px', // larger bottom margin to prevent premature triggers
    },
  },
  touchTarget: {
    min: 44, // pixels - minimum touch target size
  },
} as const;

/**
 * Fleet record — the public JSON that /fleet renders. Published by the forge
 * workspace's `bin/fleet-public` into a public Supabase Storage bucket; the
 * page falls back to static/fleet.sample.json when the fetch fails or the
 * shape is not schema 1. The origin is allowed in connect-src (svelte.config.js).
 */
export const FLEET_JSON_URL =
  'https://ohnidsebeqjroypztfcs.supabase.co/storage/v1/object/public/fleet/fleet.json';
export const FLEET_SAMPLE_PATH = '/fleet.sample.json';
export const FLEET_FETCH_TIMEOUT_MS = 8_000;
