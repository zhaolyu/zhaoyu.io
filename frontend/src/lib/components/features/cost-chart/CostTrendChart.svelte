<script lang="ts">
  import type { CostSnapshot } from '$lib/types';
  import { snapshotRef } from '$lib/utils/cost-guard-display';

  let { snapshots }: { snapshots: CostSnapshot[] } = $props();

  // SVG coordinate system
  const W = 800;
  const H = 200;
  const PL = 52; // left — y-axis labels
  const PR = 16; // right
  const PT = 12; // top
  const PB = 44; // bottom — x-axis labels
  const IW = W - PL - PR; // inner width
  const IH = H - PT - PB; // inner height
  const BASE_Y = PT + IH; // baseline y for area fills

  let chart = $derived.by(() => {
    if (snapshots.length === 0) return null;

    const sorted = [...snapshots].sort((a, b) => a.created_at.localeCompare(b.created_at));
    const gcpSorted = sorted.filter((s) => s.source === 'gcp-billing');
    const githubSorted = sorted.filter((s) => s.source === 'github');

    // Time domain — pad by a day whenever the span is zero (single snapshot OR
    // multiple snapshots sharing one created_at) so px() never divides by zero
    const times = sorted.map((s) => new Date(s.created_at).getTime());
    const minTs = Math.min(...times);
    const realMax = Math.max(...times);
    const maxTs = realMax > minTs ? realMax : minTs + 86_400_000;

    // Value domain — floor at 0, min range 0.01 to avoid /0
    const vals = sorted.map((s) => parseFloat(s.total_monthly_estimate));
    const maxVal = Math.max(...vals, 0.01);

    const px = (ts: string) => PL + ((new Date(ts).getTime() - minTs) / (maxTs - minTs)) * IW;
    const py = (val: string) => PT + IH - (parseFloat(val) / maxVal) * IH;

    const buildLine = (pts: CostSnapshot[]) =>
      pts.length === 0
        ? ''
        : pts
            .map(
              (p, i) => `${i === 0 ? 'M' : 'L'}${px(p.created_at)},${py(p.total_monthly_estimate)}`,
            )
            .join(' ');

    const buildArea = (pts: CostSnapshot[]) => {
      if (pts.length < 2) return '';
      const line = buildLine(pts);
      const lastX = px(pts[pts.length - 1].created_at);
      const firstX = px(pts[0].created_at);
      return `${line} L${lastX},${BASE_Y} L${firstX},${BASE_Y} Z`;
    };

    const mapPts = (pts: CostSnapshot[]) =>
      pts.map((p) => ({
        x: px(p.created_at),
        y: py(p.total_monthly_estimate),
        val: parseFloat(p.total_monthly_estimate),
        label: snapshotRef(p),
        project: p.project_id,
      }));

    // Y-axis ticks: 0, mid, max
    const yTicks = [0, maxVal / 2, maxVal].map((v) => ({
      y: PT + IH - (v / maxVal) * IH,
      label: `$${v.toFixed(2)}`,
    }));

    // X-axis labels — thin out to ≤ 6
    const step = Math.max(1, Math.ceil(sorted.length / 6));
    const xLabels = sorted
      .filter((_, i) => i % step === 0 || i === sorted.length - 1)
      .map((s) => ({ x: px(s.created_at), label: snapshotRef(s) }));

    return {
      gcpLine: buildLine(gcpSorted),
      gcpArea: buildArea(gcpSorted),
      gcpPts: mapPts(gcpSorted),
      githubLine: buildLine(githubSorted),
      githubArea: buildArea(githubSorted),
      githubPts: mapPts(githubSorted),
      yTicks,
      xLabels,
      hasData: gcpSorted.length > 0 || githubSorted.length > 0,
    };
  });
</script>

<div class="chart-card">
  <div class="chart-header">
    <span class="chart-title">Cost Trend</span>
    <div class="chart-legend">
      {#if chart && chart.gcpPts.length > 0}
        <span class="legend-dot legend-gcp"></span>
        <span class="legend-label">GCP Actual</span>
      {/if}
      {#if chart && chart.githubPts.length > 0}
        <span class="legend-dot legend-github"></span>
        <span class="legend-label">Estimate</span>
      {/if}
    </div>
  </div>

  {#if !chart || !chart.hasData}
    <div class="chart-empty">No data to chart yet</div>
  {:else}
    <svg
      viewBox="0 0 {W} {H}"
      class="chart-svg"
      preserveAspectRatio="xMidYMid meet"
      aria-label="Cost trend chart"
    >
      <defs>
        <linearGradient id="cg-grad-gcp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--status-success)" stop-opacity="0.18" />
          <stop offset="100%" stop-color="var(--status-success)" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="cg-grad-github" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent-infra)" stop-opacity="0.18" />
          <stop offset="100%" stop-color="var(--accent-infra)" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- Y-axis gridlines + labels -->
      {#each chart.yTicks as tick (tick.y)}
        <line x1={PL} y1={tick.y} x2={W - PR} y2={tick.y} class="grid-line" />
        <text x={PL - 6} y={tick.y + 4} class="axis-text y-axis" text-anchor="end">
          {tick.label}
        </text>
      {/each}

      <!-- GCP Actual series -->
      {#if chart.gcpArea}
        <path d={chart.gcpArea} fill="url(#cg-grad-gcp)" />
      {/if}
      {#if chart.gcpLine}
        <path d={chart.gcpLine} class="series-line line-gcp" fill="none" />
      {/if}
      {#each chart.gcpPts as pt (pt)}
        <circle cx={pt.x} cy={pt.y} r="4" class="dot dot-gcp">
          <title>GCP Actual • ${pt.val.toFixed(2)} • {pt.label} • {pt.project}</title>
        </circle>
      {/each}

      <!-- IaC Estimate series -->
      {#if chart.githubArea}
        <path d={chart.githubArea} fill="url(#cg-grad-github)" />
      {/if}
      {#if chart.githubLine}
        <path d={chart.githubLine} class="series-line line-github" fill="none" />
      {/if}
      {#each chart.githubPts as pt (pt)}
        <circle cx={pt.x} cy={pt.y} r="4" class="dot dot-github">
          <title>Estimate • ${pt.val.toFixed(2)} • {pt.label} • {pt.project}</title>
        </circle>
      {/each}

      <!-- X-axis labels -->
      {#each chart.xLabels as lbl (lbl)}
        <text x={lbl.x} y={H - 6} class="axis-text x-axis" text-anchor="middle">
          {lbl.label}
        </text>
      {/each}
    </svg>
  {/if}
</div>

<style>
  .chart-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    overflow: hidden;
    transition:
      background-color 0.2s,
      border-color 0.2s;
  }

  .chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-md) var(--space-lg);
    border-bottom: 1px solid var(--border-color);
  }

  .chart-title {
    font-family: var(--font-sans);
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .chart-legend {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .legend-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .legend-gcp {
    background: var(--status-success);
  }

  .legend-github {
    background: var(--accent-infra);
  }

  .legend-label {
    margin-left: -6px;
  }

  .chart-empty {
    padding: var(--space-2xl) var(--space-lg);
    text-align: center;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .chart-svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }

  .grid-line {
    stroke: var(--border-color);
    stroke-width: 1;
    stroke-dasharray: 3 4;
  }

  .axis-text {
    font-family: var(--font-mono);
    font-size: 10px;
    fill: var(--text-muted);
  }

  .y-axis {
    font-size: 9px;
  }

  .series-line {
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .line-gcp {
    stroke: var(--status-success);
  }

  .line-github {
    stroke: var(--accent-infra);
  }

  .dot {
    stroke-width: 2;
    transition:
      r 0.15s,
      opacity 0.15s;
    cursor: crosshair;
  }

  .dot-gcp {
    fill: var(--bg-secondary);
    stroke: var(--status-success);
  }

  .dot-gcp:hover {
    fill: var(--status-success);
    r: 6;
  }

  .dot-github {
    fill: var(--bg-secondary);
    stroke: var(--accent-infra);
  }

  .dot-github:hover {
    fill: var(--accent-infra);
    r: 6;
  }
</style>
