import { describe, it, expect } from 'vitest';
import { snapshotLabel, snapshotRef, snapshotProject } from './cost-guard-display';
import type { CostSnapshot } from '$lib/types';

const base: CostSnapshot = {
  id: 'snap-1',
  org_id: 'org-1',
  project_id: 'zhaoyu-io',
  commit_hash: 'abcdef1234567890',
  total_monthly_estimate: '12.34',
  source: 'github',
  created_at: '2026-02-15T12:00:00Z',
};

describe('snapshotLabel', () => {
  it('labels gcp-billing snapshots as GCP Actual', () => {
    expect(snapshotLabel({ ...base, source: 'gcp-billing' })).toBe('GCP Actual');
  });

  it('labels github snapshots as Estimate', () => {
    expect(snapshotLabel({ ...base, source: 'github' })).toBe('Estimate');
  });
});

describe('snapshotRef', () => {
  it('returns a 7-char short SHA for github snapshots', () => {
    expect(snapshotRef({ ...base, source: 'github' })).toBe('abcdef1');
  });

  it('returns an em dash when a github snapshot has no commit hash', () => {
    expect(snapshotRef({ ...base, source: 'github', commit_hash: null })).toBe('—');
  });

  it('returns a billing period (month + year) for gcp-billing snapshots', () => {
    expect(snapshotRef({ ...base, source: 'gcp-billing' })).toBe('Feb 2026');
  });
});

describe('snapshotProject', () => {
  it('returns the project id', () => {
    expect(snapshotProject(base)).toBe('zhaoyu-io');
  });
});
