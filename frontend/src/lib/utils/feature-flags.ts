/**
 * Feature-flag filtering for content items.
 */

import { FEATURE_FLAGS, type FeatureFlag } from '$lib/constants/config';

export interface FeatureFlagged {
  /** Only shown when the named flag is enabled in FEATURE_FLAGS. */
  featureFlag?: FeatureFlag;
}

/**
 * Keep items that carry no flag, or whose flag is enabled.
 * `flags` is injectable for tests; production callers use the default.
 */
export function visibleItems<T extends FeatureFlagged>(
  items: readonly T[],
  flags: Record<FeatureFlag, boolean> = FEATURE_FLAGS,
): T[] {
  return items.filter((item) => !item.featureFlag || flags[item.featureFlag]);
}
