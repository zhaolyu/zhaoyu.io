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
 * Partial so a caller can name only the flags under test — an omitted flag
 * reads as off, and adding a new flag can't break unrelated call sites.
 */
export function visibleItems<T extends FeatureFlagged>(
  items: readonly T[],
  flags: Partial<Record<FeatureFlag, boolean>> = FEATURE_FLAGS,
): T[] {
  return items.filter((item) => !item.featureFlag || flags[item.featureFlag]);
}
