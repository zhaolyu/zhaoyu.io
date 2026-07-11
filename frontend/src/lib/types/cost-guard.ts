export type SnapshotSource = 'github' | 'gcp-billing';

export interface CostSnapshot {
  id: string;
  org_id: string;
  project_id: string;
  commit_hash: string | null;
  total_monthly_estimate: string; // Electric returns NUMERIC as string — use parseFloat()
  source: SnapshotSource;
  created_at: string; // ISO 8601
}

export interface CostItem {
  id: string;
  snapshot_id: string;
  resource_type: string;
  resource_name: string;
  monthly_cost: string; // Electric returns NUMERIC as string — use parseFloat()
  change_type: 'added' | 'modified' | 'removed' | 'unchanged';
  metadata: Record<string, unknown> | null;
}

export type CostCategory = 'compute' | 'storage' | 'fixed';

export interface CostBaseline {
  compute: number;
  storage: number;
  fixed: number;
  total: number;
}
