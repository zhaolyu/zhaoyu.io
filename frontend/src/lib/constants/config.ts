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
