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

/** Human-readable source label for display in the UI. */
export function snapshotLabel(snapshot: CostSnapshot): string {
  return snapshot.source === 'gcp-billing' ? 'GCP Actual' : 'Estimate';
}

/**
 * Reference string for the snapshot:
 * - github: 7-char commit SHA
 * - gcp-billing: billing period derived from created_at (e.g. "Feb 2026")
 */
export function snapshotRef(snapshot: CostSnapshot): string {
  if (snapshot.source === 'gcp-billing') {
    const date = new Date(snapshot.created_at);
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
  }
  return snapshot.commit_hash ? snapshot.commit_hash.slice(0, 7) : '—';
}

/** Human-readable project name (may strip suffixes in future). */
export function snapshotProject(snapshot: CostSnapshot): string {
  return snapshot.project_id;
}
