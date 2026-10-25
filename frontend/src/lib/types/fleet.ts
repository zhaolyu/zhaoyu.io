/**
 * The public fleet record: what `bin/fleet-public` in the forge workspace
 * publishes from the shared run ledger, and what /fleet renders.
 *
 * Schema 1. The publisher writes closed days only and never includes session
 * minutes, open sessions, prompts, paths, repo roots or the human outcome axis;
 * the types below have no slot for any of them, so the page cannot render what
 * the policy excludes.
 */

export interface FleetWindow {
  /** YYYY-MM-DD, first closed day in the record. */
  from: string;
  /** YYYY-MM-DD, last closed day in the record. */
  to: string;
}

export interface FleetTotals {
  days: number;
  runs: number;
  routine_runs: number;
  interactive_runs: number;
  /** Runs that edited at least one file; the process axis applies to these. */
  edit_runs: number;
  verified: number;
  unverified: number;
  unaudited: number;
  /** Tokens priced at Claude API list rates. */
  api_equivalent_usd: number;
}

export interface FleetDay {
  /** YYYY-MM-DD, local to the machine that ran the fleet. */
  date: string;
  runs: number;
  routine: number;
  interactive: number;
  edit_runs: number;
  verified: number;
  api_equivalent_usd: number;
}

export interface FleetRoutine {
  name: string;
  /** Five-field cron, local time, or null for a routine that runs on demand. */
  cadence: string | null;
  runs: number;
  first_run: string;
  last_run: string;
  median_usd: number;
  /** Verified edit-runs over edit-runs, 0..1; null when the routine never edits. */
  verified_share: number | null;
}

export interface FleetRecord {
  schema: 1;
  generated_at: string;
  source: string;
  pricing_note: string;
  window: FleetWindow;
  totals: FleetTotals;
  days: FleetDay[];
  routines: FleetRoutine[];
}
