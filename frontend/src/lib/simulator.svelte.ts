import type { PGlite } from '@electric-sql/pglite';
import type { CostBaseline, CostItem } from '$lib/types';
import { SIMULATOR_LIMITS } from '$lib/constants/config';
import { buildBaseline, projectCost } from '$lib/utils/cost-projection';

export class CostSimulator {
  trafficMultiplier = $state(SIMULATOR_LIMITS.trafficMultiplier.default);
  storageGrowthGB = $state(SIMULATOR_LIMITS.storageGrowthGB.default);
  baseline = $state<CostBaseline>({ compute: 0, storage: 0, fixed: 0, total: 0 });
  isLoaded = $state(false);

  projectedTotal = $derived.by(() =>
    projectCost(this.baseline, this.trafficMultiplier, this.storageGrowthGB),
  );

  projectedDelta = $derived.by(() => this.projectedTotal - this.baseline.total);

  async loadBaseline(db: PGlite): Promise<void> {
    // Try cost_items first (granular per-resource breakdown)
    const itemsResult = await db.query<CostItem>(
      `SELECT ci.resource_type, ci.monthly_cost
       FROM cost_items ci
       INNER JOIN cost_snapshots cs ON ci.snapshot_id = cs.id
       WHERE cs.created_at = (SELECT MAX(created_at) FROM cost_snapshots)`,
    );

    if (itemsResult.rows.length > 0) {
      this.baseline = buildBaseline(itemsResult.rows);
      this.isLoaded = true;
      return;
    }

    // Fallback: use snapshot total as compute baseline
    const snapshotResult = await db.query<{ total_monthly_estimate: string }>(
      `SELECT total_monthly_estimate FROM cost_snapshots
       ORDER BY created_at DESC LIMIT 1`,
    );

    if (snapshotResult.rows.length > 0) {
      const total = Number(snapshotResult.rows[0].total_monthly_estimate);
      this.baseline = { compute: total, storage: 0, fixed: 0, total };
      this.isLoaded = true;
    }
  }

  reset(): void {
    this.trafficMultiplier = SIMULATOR_LIMITS.trafficMultiplier.default;
    this.storageGrowthGB = SIMULATOR_LIMITS.storageGrowthGB.default;
  }
}

export const simulator = new CostSimulator();
