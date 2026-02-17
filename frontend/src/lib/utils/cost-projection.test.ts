import { describe, it, expect } from 'vitest';
import { buildBaseline, projectCost } from './cost-projection';
import { STORAGE_COST_PER_GB } from '$lib/constants/config';
import type { CostBaseline } from '$lib/types';

describe('buildBaseline', () => {
  it('returns all zeros for empty items', () => {
    const result = buildBaseline([]);
    expect(result).toEqual({ compute: 0, storage: 0, fixed: 0, total: 0 });
  });

  it('maps known compute resource types', () => {
    const result = buildBaseline([
      { resource_type: 'google_compute_instance', monthly_cost: 50 },
      { resource_type: 'google_cloud_run_v2_service', monthly_cost: 30 },
    ]);
    expect(result.compute).toBe(80);
    expect(result.storage).toBe(0);
    expect(result.fixed).toBe(0);
    expect(result.total).toBe(80);
  });

  it('maps known storage resource types', () => {
    const result = buildBaseline([
      { resource_type: 'google_storage_bucket', monthly_cost: 10 },
      { resource_type: 'google_sql_database_instance', monthly_cost: 25 },
    ]);
    expect(result.compute).toBe(0);
    expect(result.storage).toBe(35);
    expect(result.total).toBe(35);
  });

  it('maps known fixed resource types', () => {
    const result = buildBaseline([{ resource_type: 'google_dns_managed_zone', monthly_cost: 5 }]);
    expect(result.fixed).toBe(5);
    expect(result.total).toBe(5);
  });

  it('defaults unknown resource types to compute', () => {
    const result = buildBaseline([{ resource_type: 'some_unknown_service', monthly_cost: 42 }]);
    expect(result.compute).toBe(42);
    expect(result.total).toBe(42);
  });

  it('handles mixed categories', () => {
    const result = buildBaseline([
      { resource_type: 'google_compute_instance', monthly_cost: 100 },
      { resource_type: 'google_storage_bucket', monthly_cost: 20 },
      { resource_type: 'google_dns_managed_zone', monthly_cost: 5 },
    ]);
    expect(result.compute).toBe(100);
    expect(result.storage).toBe(20);
    expect(result.fixed).toBe(5);
    expect(result.total).toBe(125);
  });

  it('handles string monthly_cost from PGlite NUMERIC', () => {
    const result = buildBaseline([
      { resource_type: 'google_compute_instance', monthly_cost: '123.45' as unknown as number },
    ]);
    expect(result.compute).toBe(123.45);
    expect(result.total).toBe(123.45);
  });
});

describe('projectCost', () => {
  const baseline: CostBaseline = { compute: 100, storage: 20, fixed: 5, total: 125 };

  it('returns baseline total at default slider values', () => {
    expect(projectCost(baseline, 1, 0)).toBe(125);
  });

  it('scales compute by traffic multiplier', () => {
    const result = projectCost(baseline, 10, 0);
    expect(result).toBe(100 * 10 + 20 + 5);
  });

  it('adds per-GB cost for storage growth', () => {
    const result = projectCost(baseline, 1, 100);
    expect(result).toBeCloseTo(100 + 20 + 100 * STORAGE_COST_PER_GB + 5);
  });

  it('leaves fixed costs unchanged regardless of inputs', () => {
    const result = projectCost(baseline, 50, 500);
    const expected = 100 * 50 + 20 + 500 * STORAGE_COST_PER_GB + 5;
    expect(result).toBeCloseTo(expected);
  });

  it('handles zero baseline', () => {
    const zero: CostBaseline = { compute: 0, storage: 0, fixed: 0, total: 0 };
    const result = projectCost(zero, 100, 1000);
    expect(result).toBeCloseTo(1000 * STORAGE_COST_PER_GB);
  });

  it('handles large multiplier values', () => {
    const result = projectCost(baseline, 100, 1000);
    const expected = 100 * 100 + 20 + 1000 * STORAGE_COST_PER_GB + 5;
    expect(result).toBeCloseTo(expected);
  });
});
