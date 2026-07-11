import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CostSimulator } from '$lib/simulator.svelte';
import { SIMULATOR_LIMITS, STORAGE_COST_PER_GB } from '$lib/constants/config';
import type { PGlite } from '@electric-sql/pglite';

vi.mock('$app/environment', () => ({ browser: true }));

function fakeDb(results: Array<{ rows: unknown[] }>): PGlite {
  const query = vi.fn<(...args: any[]) => any>();
  for (const r of results) query.mockResolvedValueOnce(r);
  return { query } as unknown as PGlite;
}

let sim: CostSimulator;

beforeEach(() => {
  sim = new CostSimulator();
});

describe('initial state', () => {
  it('starts at default multipliers with an empty baseline', () => {
    expect(sim.trafficMultiplier).toBe(SIMULATOR_LIMITS.trafficMultiplier.default);
    expect(sim.storageGrowthGB).toBe(SIMULATOR_LIMITS.storageGrowthGB.default);
    expect(sim.baseline.total).toBe(0);
    expect(sim.isLoaded).toBe(false);
  });
});

describe('loadBaseline', () => {
  it('builds a categorized baseline from cost_items when present', async () => {
    const db = fakeDb([
      {
        rows: [
          { resource_type: 'aws_lambda_function', monthly_cost: '10' },
          { resource_type: 'aws_s3_bucket', monthly_cost: '5' },
          { resource_type: 'aws_route53_zone', monthly_cost: '0.5' },
        ],
      },
    ]);

    await sim.loadBaseline(db);

    expect(sim.isLoaded).toBe(true);
    expect(sim.baseline).toEqual({ compute: 10, storage: 5, fixed: 0.5, total: 15.5 });
  });

  it('falls back to the latest snapshot total when no cost_items exist', async () => {
    const db = fakeDb([{ rows: [] }, { rows: [{ total_monthly_estimate: '42.5' }] }]);

    await sim.loadBaseline(db);

    expect(sim.isLoaded).toBe(true);
    expect(sim.baseline).toEqual({ compute: 42.5, storage: 0, fixed: 0, total: 42.5 });
  });

  it('stays unloaded when the database has no data at all', async () => {
    const db = fakeDb([{ rows: [] }, { rows: [] }]);

    await sim.loadBaseline(db);

    expect(sim.isLoaded).toBe(false);
    expect(sim.baseline.total).toBe(0);
  });
});

describe('projections', () => {
  beforeEach(() => {
    sim.baseline = { compute: 100, storage: 20, fixed: 10, total: 130 };
  });

  it('projects compute scaled by traffic and storage growth by cost per GB', () => {
    sim.trafficMultiplier = 3;
    sim.storageGrowthGB = 100;

    // compute 100*3 + storage 20 + 100GB * rate + fixed 10
    const expected = 300 + 20 + 100 * STORAGE_COST_PER_GB + 10;
    expect(sim.projectedTotal).toBeCloseTo(expected);
    expect(sim.projectedDelta).toBeCloseTo(expected - 130);
  });

  it('projects the baseline itself at default settings', () => {
    expect(sim.projectedTotal).toBeCloseTo(130);
    expect(sim.projectedDelta).toBeCloseTo(0);
  });

  it('reset returns the sliders to defaults', () => {
    sim.trafficMultiplier = 50;
    sim.storageGrowthGB = 500;
    sim.reset();
    expect(sim.trafficMultiplier).toBe(SIMULATOR_LIMITS.trafficMultiplier.default);
    expect(sim.storageGrowthGB).toBe(SIMULATOR_LIMITS.storageGrowthGB.default);
    expect(sim.projectedDelta).toBeCloseTo(0);
  });
});
