/**
 * Display helpers for Cost-Guard snapshots.
 * Pure functions — formatting only, no I/O.
 */

import type { CostSnapshot } from '$lib/types';

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
