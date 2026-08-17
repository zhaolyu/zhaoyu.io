<script lang="ts">
  import ChartFrame from './ChartFrame.svelte';
  import type {
    ChartAnnotation,
    ChartLegendItem,
    ChartMarker,
    ChartPoint,
    StatusTone,
  } from '$lib/types';

  /**
   * A line chart that names the moment that mattered.
   *
   * The `annotation` is required, not optional: this component is the
   * storytelling primitive, and a line with no labelled event is just a series —
   * use ChartFrame directly for that. Ticks, axis rules and the dashed event
   * marker are drawn from --viz-* so a chart cannot drift from the system by
   * picking its own greys.
   */
  interface Props {
    title: string;
    caption?: string;
    points: ChartPoint[];
    /** Ticks in data space: `at` is an x value, `label` is what the axis reads. */
    xTicks: { at: number; label: string }[];
    /** Y values that get a gridline and a label. */
    yTicks: number[];
    formatY?: (value: number) => string;
    markers?: ChartMarker[];
    /** The event this chart is about. */
    annotation: ChartAnnotation;
    legend?: ChartLegendItem[];
    minWidth?: string;
  }

  let {
    title,
    caption,
    points,
    xTicks,
    yTicks,
    formatY = (v) => String(v),
    markers = [],
    annotation,
    legend,
    minWidth = '30rem',
  }: Props = $props();

  /* Viewbox space. The left gutter holds y labels, the bottom strip holds x
     labels; the plot is what's left. Fixed numbers, because the SVG scales as a
     unit and the frame owns the min-width. */
  const W = 520;
  const H = 210;
  const PAD = { left: 56, right: 20, top: 24, bottom: 38 };

  const xs = $derived(points.map((p) => p.x));
  const xMin = $derived(Math.min(...xs));
  const xMax = $derived(Math.max(...xs));
  const yMin = $derived(Math.min(...yTicks));
  const yMax = $derived(Math.max(...yTicks));

  const sx = $derived(
    (x: number) => PAD.left + ((x - xMin) / (xMax - xMin || 1)) * (W - PAD.left - PAD.right),
  );
  const sy = $derived(
    (y: number) => H - PAD.bottom - ((y - yMin) / (yMax - yMin || 1)) * (H - PAD.top - PAD.bottom),
  );

  const path = $derived(points.map((p) => `${sx(p.x)},${sy(p.y)}`).join(' '));

  const defaultLegend: ChartLegendItem[] = $derived([
    { label: title, color: 'var(--viz-series-1)', shape: 'line' },
  ]);

  const toneFill = (tone: StatusTone) =>
    tone === 'neutral' ? 'var(--text-muted)' : `var(--status-${tone})`;
</script>

<ChartFrame {title} {caption} legend={legend ?? defaultLegend} {minWidth}>
  <svg viewBox="0 0 {W} {H}" width="100%" role="img" aria-label="{title}. {annotation.label}.">
    {#each yTicks as tick (tick)}
      <line x1={PAD.left} y1={sy(tick)} x2={W - PAD.right} y2={sy(tick)} class="grid" />
      <text x={PAD.left - 8} y={sy(tick) + 4} class="tick" text-anchor="end">{formatY(tick)}</text>
    {/each}

    <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} class="axis" />

    <line
      x1={sx(annotation.at)}
      y1={PAD.top}
      x2={sx(annotation.at)}
      y2={H - PAD.bottom}
      class="event"
    />
    <text x={sx(annotation.at) + 6} y={PAD.top + 12} class="event-label">{annotation.label}</text>

    <polyline points={path} class="series" />

    {#each markers as marker (marker.x)}
      <circle cx={sx(marker.x)} cy={sy(marker.y)} r="4" fill={toneFill(marker.tone)} />
    {/each}

    {#each xTicks as tick (tick.at)}
      <text x={sx(tick.at)} y={H - PAD.bottom + 18} class="tick" text-anchor="middle">
        {tick.label}
      </text>
    {/each}
  </svg>
</ChartFrame>

<style>
  svg {
    display: block;
  }

  .grid {
    stroke: var(--viz-grid);
  }

  .axis {
    stroke: var(--viz-axis);
  }

  .series {
    fill: none;
    stroke: var(--viz-series-1);
    stroke-width: 2;
  }

  .event {
    stroke: var(--status-warning-text);
    stroke-width: 1;
    stroke-dasharray: 4 4;
  }

  .event-label,
  .tick {
    font-family: var(--font-mono);
    /* 10px in viewBox units, which the frame's min-width keeps at ~10px on
       screen. Do not scale the SVG below it. */
    font-size: 10px;
  }

  .event-label {
    fill: var(--status-warning-text);
  }

  .tick {
    fill: var(--text-muted);
  }
</style>
