/**
 * Shapes shared by the dashboard/data-viz components.
 *
 * These live here rather than in the components because a Svelte instance
 * script cannot export types, and because a page building rows for DataTable
 * or points for AnnotatedLineChart should be able to type them without
 * importing a component.
 */

/** Semantic state. Maps to the --status-* token family. */
export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface DataColumn {
  key: string;
  label: string;
  align?: 'left' | 'right';
  /** Mono figures + tabular-nums, semibold. */
  numeric?: boolean;
  /** Mono, but not a figure — tickers, ids. */
  mono?: boolean;
  /** Render the cell as a StatusPill. */
  pill?: boolean;
}

export interface ChartLegendItem {
  label: string;
  /** Any CSS colour — use a --viz-series-* or --status-* token. */
  color: string;
  shape?: 'line' | 'dot' | 'dashed';
}

export interface ChartPoint {
  x: number;
  y: number;
}

export interface ChartMarker extends ChartPoint {
  tone: StatusTone;
}

export interface ChartAnnotation {
  /** x value in data space where the event happened. */
  at: number;
  label: string;
}
