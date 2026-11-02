<script lang="ts">
  import { ChartFrame } from '$lib/components/ui';
  import type { ChartLegendItem, FleetDay } from '$lib/types';
  import { formatUsd, formatUsdTick, shortDate } from '$lib/utils/fleet';

  /**
   * One small multiple per measure. Runs and dollars share a date axis but not
   * a scale, and a second y-axis would let the eye read a ratio that is not
   * there, so the page renders this component twice instead of once with two
   * axes. Columns stack routine over interactive with a surface gap between the
   * segments; the dollar column is a single series and needs no legend.
   */
  interface Props {
    days: FleetDay[];
    mode: 'runs' | 'value';
  }

  let { days, mode }: Props = $props();

  // SVG coordinate system. Width is fixed and the frame scrolls on narrow
  // screens so axis text never shrinks below --type-2xs.
  const W = 800;
  const H = 220;
  const PL = 44;
  const PR = 12;
  const PT = 18;
  const PB = 36;
  const IW = W - PL - PR;
  const IH = H - PT - PB;
  const BASE = PT + IH;
  const GAP = 2; // surface gap between stacked segments
  const MAX_BAR = 24; // a column is never thicker than this; the slot's leftover is air
  const RADIUS = 4; // rounded data-end, square at the baseline

  const hasOverhead = $derived(days.some((d) => (d.overhead ?? 0) > 0));
  const legend = $derived<ChartLegendItem[]>(
    mode === 'runs'
      ? [
          { label: 'routine', color: 'var(--viz-series-1)' },
          { label: 'interactive', color: 'var(--viz-series-2)' },
          ...(hasOverhead ? [{ label: 'overhead', color: 'var(--viz-series-3)' }] : []),
        ]
      : [],
  );

  const title = $derived(mode === 'runs' ? 'Runs per day' : 'API-equivalent value per day');
  const caption = $derived(
    mode === 'runs'
      ? 'Closed days only. A routine run is a scheduled, unattended session; an interactive run is mine; overhead is a validator, reviewer or probe run that checks the others.'
      : 'Tokens priced at Claude API list rates. The runs themselves ran on a subscription.',
  );

  const value = (d: FleetDay) => (mode === 'runs' ? d.runs : d.api_equivalent_usd);
  const fmt = (v: number) => (mode === 'runs' ? String(Math.round(v)) : formatUsd(v));

  let hovered = $state<number | null>(null);

  // A rounded-top rectangle path: square corners at the baseline, radius r at
  // the data end, with the radius clamped so a short bar never inverts.
  function roundedTop(x: number, y: number, w: number, h: number, r: number): string {
    const rr = Math.min(r, w / 2, h);
    return [
      `M${x},${y + h}`,
      `V${y + rr}`,
      `Q${x},${y} ${x + rr},${y}`,
      `H${x + w - rr}`,
      `Q${x + w},${y} ${x + w},${y + rr}`,
      `V${y + h}`,
      'Z',
    ].join(' ');
  }

  function niceMax(v: number): number {
    if (v <= 0) return 1;
    const mag = 10 ** Math.floor(Math.log10(v));
    const n = v / mag;
    const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
    return step * mag;
  }

  interface Segment {
    path: string;
    color: string;
  }

  let chart = $derived.by(() => {
    if (days.length === 0) return null;
    const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
    const max = niceMax(Math.max(...sorted.map(value), 0));
    const slot = IW / sorted.length;
    const bw = Math.min(MAX_BAR, Math.max(2, slot * 0.6));
    const py = (v: number) => BASE - (v / max) * IH;

    const columns = sorted.map((d, i) => {
      const x = PL + slot * i + (slot - bw) / 2;
      const total = value(d);
      const top = py(total);
      const segments: Segment[] = [];
      if (mode === 'value') {
        segments.push({
          path: roundedTop(x, top, bw, BASE - top, RADIUS),
          color: 'var(--viz-series-1)',
        });
      } else {
        // Stack from the baseline: interactive, routine, then overhead, with a
        // surface gap between touching segments. The topmost segment present
        // takes the rounded cap; a remainder the record does not split out is
        // left as air, so a column never overstates a kind.
        const parts = [
          { n: d.interactive, color: 'var(--viz-series-2)' },
          { n: d.routine, color: 'var(--viz-series-1)' },
          { n: d.overhead ?? 0, color: 'var(--viz-series-3)' },
        ].filter((p) => p.n > 0);
        let acc = 0;
        parts.forEach((p, k) => {
          const y0 = py(acc);
          const y1 = py(acc + p.n);
          const last = k === parts.length - 1;
          segments.push({
            path: last
              ? roundedTop(x, y1, bw, y0 - y1, RADIUS)
              : `M${x},${y0} V${y1 + GAP} H${x + bw} V${y0} Z`,
            color: p.color,
          });
          acc += p.n;
        });
      }
      return { d, x, w: bw, cx: x + bw / 2, top, total, segments };
    });

    const ticks = [0, 0.5, 1].map((f) => ({
      y: py(max * f),
      label: mode === 'runs' ? String(Math.round(max * f)) : formatUsdTick(max * f),
    }));
    const step = Math.max(1, Math.ceil(sorted.length / 7));
    const xLabels = columns
      .filter((_, i) => i % step === 0 || i === columns.length - 1)
      .map((c) => ({ x: c.cx, label: shortDate(c.d.date) }));
    const peak = columns.reduce((a, c) => (c.total > a.total ? c : a), columns[0]);

    return { columns, ticks, xLabels, peak, slot };
  });

  const readout = $derived.by(() => {
    if (!chart) return '';
    const c = hovered === null ? chart.peak : chart.columns[hovered];
    const d = c.d;
    const who = hovered === null ? `Peak day, ${shortDate(d.date)}` : shortDate(d.date);
    if (mode === 'runs') {
      const overhead = d.overhead ? ` and ${d.overhead} overhead` : '';
      return `${who}: ${d.runs} runs, ${d.routine} routine, ${d.interactive} interactive${overhead}; ${d.edit_runs} edited files and ${d.verified} of those were verified.`;
    }
    return `${who}: ${formatUsd(d.api_equivalent_usd)} across ${d.runs} runs.`;
  });
</script>

<ChartFrame {title} {caption} {legend} minWidth="36rem">
  {#if chart}
    <svg
      viewBox="0 0 {W} {H}"
      class="plot"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={title}
      onmouseleave={() => (hovered = null)}
    >
      {#each chart.ticks as t (t.label)}
        <line x1={PL} x2={W - PR} y1={t.y} y2={t.y} class="grid" />
        <text x={PL - 6} y={t.y} class="tick" text-anchor="end" dominant-baseline="middle">
          {t.label}
        </text>
      {/each}
      <line x1={PL} x2={W - PR} y1={BASE} y2={BASE} class="axis" />

      {#each chart.columns as c, i (c.d.date)}
        <g class="column" class:dim={hovered !== null && hovered !== i}>
          {#each c.segments as s, j (j)}
            <path d={s.path} fill={s.color} />
          {/each}
          <!-- Hit target wider than the mark: the whole slot, baseline to top. Hover is
               an enhancement only: the readout below is aria-live and the page carries a
               table view, so a keyboard or screen-reader user loses nothing. -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <rect
            x={c.x - (chart.slot - c.w) / 2}
            y={PT}
            width={chart.slot}
            height={IH}
            class="hit"
            onmouseenter={() => (hovered = i)}
          >
            <title>{shortDate(c.d.date)}: {fmt(c.total)}</title>
          </rect>
        </g>
      {/each}

      <!-- One direct label, at the cap of the peak column. The rest is the axis,
           the tooltip and the table. -->
      <text x={chart.peak.cx} y={chart.peak.top - 6} class="peak" text-anchor="middle">
        {fmt(chart.peak.total)}
      </text>

      {#each chart.xLabels as l (l.x)}
        <text x={l.x} y={H - 10} class="tick" text-anchor="middle">{l.label}</text>
      {/each}
    </svg>
    <p class="readout" aria-live="polite">{readout}</p>
  {:else}
    <p class="readout">No closed days in the record.</p>
  {/if}
</ChartFrame>

<style>
  .plot {
    display: block;
    width: 100%;
    height: auto;
  }

  .grid {
    stroke: var(--viz-grid);
    stroke-width: 1;
  }

  .axis {
    stroke: var(--viz-axis);
    stroke-width: 1;
  }

  .tick,
  .peak {
    font-family: var(--font-mono);
    /* SVG user units, not CSS px: the viewBox scales them with the plot. */
    font-size: 11px;
    fill: var(--text-muted);
  }

  .peak {
    fill: var(--text-secondary);
    font-weight: var(--weight-semibold);
  }

  .column {
    transition: opacity var(--duration-fast) var(--ease-out);
  }

  .column.dim {
    opacity: 0.45;
  }

  .hit {
    fill: transparent;
  }

  .readout {
    margin: var(--space-xs) 0 0;
    min-height: 1.5em;
    font-family: var(--font-mono);
    font-size: var(--type-xs);
    color: var(--text-secondary);
  }
</style>
