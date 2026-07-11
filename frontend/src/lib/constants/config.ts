/**
 * Feature flags — gate content that isn't ready to be public.
 */
export const FEATURE_FLAGS = {
  /**
   * CNBC's consumer AI product hasn't launched publicly yet.
   * Flip to true to show the CNBC AI project/builder cards.
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
 * Cost-Guard ElectricSQL sync configuration
 */
export const ELECTRIC_SYNC_URL = 'https://ingestion-api-240dd81-538316597788.us-central1.run.app';

// v2: cost_items schema narrowed (resource_name/metadata no longer synced).
// Bumping the dir gives visitors a clean local DB; stale versions are purged
// by CostDB's init-time cleanup and data re-syncs from Electric.
export const PGLITE_DATA_DIR = 'idb://zhaoyu-cost-guard-v2';

/**
 * Cost Simulator configuration
 */
import type { CostCategory } from '$lib/types';

export const RESOURCE_TYPE_CATEGORY_MAP: Record<string, CostCategory> = {
  // Compute
  aws_instance: 'compute',
  aws_lambda_function: 'compute',
  google_compute_instance: 'compute',
  google_cloud_run_service: 'compute',
  google_cloud_run_v2_service: 'compute',
  // Storage
  aws_s3_bucket: 'storage',
  aws_rds_cluster: 'storage',
  google_storage_bucket: 'storage',
  google_sql_database_instance: 'storage',
  // Fixed
  aws_route53_zone: 'fixed',
  aws_cloudfront_distribution: 'fixed',
  google_dns_managed_zone: 'fixed',
};

export const DEFAULT_COST_CATEGORY: CostCategory = 'compute';

export const SIMULATOR_LIMITS = {
  trafficMultiplier: { min: 1, max: 100, default: 1, step: 1 },
  storageGrowthGB: { min: 0, max: 1000, default: 0, step: 10 },
} as const;

export const STORAGE_COST_PER_GB = 0.023;
