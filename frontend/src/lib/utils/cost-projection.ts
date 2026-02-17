import type { CostBaseline, CostCategory } from '$lib/types';
import {
  DEFAULT_COST_CATEGORY,
  RESOURCE_TYPE_CATEGORY_MAP,
  STORAGE_COST_PER_GB,
} from '$lib/constants/config';

/**
 * Group cost items into compute/storage/fixed baselines.
 * Handles PGlite NUMERIC-as-string coercion.
 */
export function buildBaseline(
  items: Array<{ resource_type: string; monthly_cost: number | string }>,
): CostBaseline {
  const grouped: CostBaseline = { compute: 0, storage: 0, fixed: 0, total: 0 };
  for (const item of items) {
    const cost = Number(item.monthly_cost);
    const category: CostCategory =
      RESOURCE_TYPE_CATEGORY_MAP[item.resource_type] ?? DEFAULT_COST_CATEGORY;
    grouped[category] += cost;
    grouped.total += cost;
  }
  return grouped;
}

/**
 * Calculate projected monthly cost from baseline + slider inputs.
 * Compute scales with traffic, storage adds per-GB growth, fixed stays constant.
 */
export function projectCost(
  baseline: CostBaseline,
  trafficMultiplier: number,
  storageGrowthGB: number,
): number {
  const projectedCompute = baseline.compute * trafficMultiplier;
  const projectedStorage = baseline.storage + storageGrowthGB * STORAGE_COST_PER_GB;
  const projectedFixed = baseline.fixed;
  return projectedCompute + projectedStorage + projectedFixed;
}
