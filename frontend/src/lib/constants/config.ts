/**
 * Application configuration constants
 */

export const APP_CONFIG = {
  name: 'zhaoyu.io',
  description: 'Personal website and learning playground',
  version: '0.0.1',
} as const;

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
 * Cost-Guard ElectricSQL sync configuration
 */
export const ELECTRIC_SYNC_URL = 'https://electric-sync-604f87f-538316597788.us-central1.run.app';

export const PGLITE_DATA_DIR = 'idb://zhaoyu-cost-guard';

// Read-only API secret for ElectricSQL shape sync (public, client-side only)
export const ELECTRIC_API_SECRET =
  'f750a12f5407ef20b9250b5b3eea0ced2bf958948ee10e21496c1df82570c1dc';
