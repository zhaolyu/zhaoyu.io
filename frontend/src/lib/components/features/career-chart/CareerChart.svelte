<script lang="ts">
  import { onMount } from 'svelte';
  import { careerHistory } from '$lib/constants/content';
  import { observeSection } from '$lib/utils/section-observer';

  const history = careerHistory.points;
  const first = history[0];
  const last = history[history.length - 1];

  /* SVG geometry, in user units. The viewBox scales them to the container. */
  const WIDTH = 1000;
  const PLOT_HEIGHT = 400;
  const PADDING = 50;
  /** Room under the plot for the year axis labels. */
  const LABEL_BAND = 60;
  const VIEW_HEIGHT = PLOT_HEIGHT + LABEL_BAND;

  /** Gap between each point's fade-in. Six points land inside the line draw. */
  const STAGGER_MS = 90;

  const getX = (i: number) => PADDING + (i / (history.length - 1)) * (WIDTH - PADDING * 2);
  const getY = (impact: number) =>
    PLOT_HEIGHT - PADDING - (impact / 100) * (PLOT_HEIGHT - PADDING * 2);

  const pathD = `M ${history.map((point, i) => `${getX(i)},${getY(point.impact)}`).join(' L ')}`;
  const areaD = `${pathD} L ${WIDTH - PADDING},${PLOT_HEIGHT} L ${PADDING},${PLOT_HEIGHT} Z`;

  /**
   * Length of the polyline, computed from the coordinates rather than measured
   * off the DOM, so the draw animation can be pure CSS (and therefore inert
   * under prefers-reduced-motion) instead of a JS transition.
   */
  const pathLength = Math.ceil(
    history.reduce(
      (total, point, i) =>
        i === 0
          ? total
          : total +
            Math.hypot(getX(i) - getX(i - 1), getY(point.impact) - getY(history[i - 1].impact)),
      0,
    ),
  );

  /** Edge labels anchor inward so they don't hang off the plot. */
  const anchorFor = (i: number) =>
    i === 0 ? 'start' : i === history.length - 1 ? 'end' : 'middle';

  const TOOLTIP_W = 150;
  const TOOLTIP_H = 66;
  /** Keep the card inside the viewBox horizontally. */
  const tooltipX = (i: number) => Math.min(Math.max(getX(i) - TOOLTIP_W / 2, 0), WIDTH - TOOLTIP_W);
  /** Sit above the marker, or flip below it when there's no room up top. */
  const tooltipY = (impact: number) => {
    const y = getY(impact);
    const above = y - TOOLTIP_H - 12;
    return above >= 0 ? above : y + 14;
  };

  const chartLabel =
    `Line chart of career progression from ${first.year} to ${last.year}: ` +
    `${first.role} at ${first.company} through ${last.role} at ${last.company}. ` +
    `Every point is listed in full below the chart.`;

  let sectionVisible = $state(false);
  let chartSection: HTMLElement;

  onMount(() =>
    observeSection(chartSection, {
      onVisible: () => {
        sectionVisible = true;
      },
      threshold: 0.2,
    }),
  );
</script>

<section id="career" class="career-chart-section" bind:this={chartSection}>
  <div class="chart-container">
    <div class="chart-header">
      <h2 class="section-badge">Career Velocity</h2>
      <h3 class="section-title">Both Tracks. On Purpose.</h3>
    </div>

    <!-- Always rendered so the chart prerenders and reads as data without JS;
         the draw and the staggered fades are animation-only enhancement. -->
    <div
      class="chart-wrapper reveal"
      class:revealed={sectionVisible}
      style="--chart-aspect: {WIDTH} / {VIEW_HEIGHT}; --path-length: {pathLength};"
    >
      <svg
        viewBox="0 0 {WIDTH} {VIEW_HEIGHT}"
        preserveAspectRatio="xMidYMin meet"
        class="chart-svg"
        role="img"
        aria-label={chartLabel}
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent-primary)" stop-opacity="0.2" />
            <stop offset="100%" stop-color="var(--accent-primary)" stop-opacity="0" />
          </linearGradient>
        </defs>

        <path d={areaD} fill="url(#chartGradient)" class="chart-area" />

        <path
          d={pathD}
          fill="none"
          stroke="var(--accent-primary)"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="chart-line"
        />

        {#each history as point, i (point.year)}
          <g class="point-group">
            <!-- Generous transparent hit area: the 6px marker is a hard target. -->
            <circle cx={getX(i)} cy={getY(point.impact)} r="26" class="point-hit" />

            <circle
              cx={getX(i)}
              cy={getY(point.impact)}
              r="6"
              class="chart-point"
              style="animation-delay: {i * STAGGER_MS}ms;"
            />

            <text
              x={getX(i)}
              y={PLOT_HEIGHT - PADDING + 22}
              class="year-label"
              text-anchor={anchorFor(i)}
              style="animation-delay: {i * STAGGER_MS}ms;"
            >
              {point.year}
            </text>

            <!-- Years only on the axis. Points are spaced by index, so 2025 and
                 2026 sit one slot apart, and "Senior Manager, Engineering" is
                 wide enough to overprint "Principal Engineer". The list below
                 carries role, company and note for every point, so dropping the
                 axis role label removes a collision and a duplication at once. -->
            <foreignObject
              x={tooltipX(i)}
              y={tooltipY(point.impact)}
              width={TOOLTIP_W}
              height={TOOLTIP_H}
              class="point-tooltip"
            >
              <div class="tooltip-content">
                <span class="tooltip-year">{point.year}</span>
                <span class="tooltip-company">{point.company}</span>
              </div>
            </foreignObject>
          </g>
        {/each}
      </svg>
    </div>

    <!-- One list for every point, at every breakpoint: the note travels with the
         point it belongs to, and a point without a note simply ends earlier. -->
    <ol class="career-points reveal" class:revealed={sectionVisible}>
      {#each history as point (point.year)}
        <li class="career-point">
          <div class="career-point-year">
            <span class="career-point-dot" aria-hidden="true"></span>
            {point.year}
          </div>
          <div class="career-point-role">{point.role}</div>
          <div class="career-point-company">{point.company}</div>
          {#if point.note}
            <p class="career-point-note">{point.note}</p>
          {/if}
        </li>
      {/each}
    </ol>
  </div>
</section>

<style>
  .career-chart-section {
    padding: var(--section-y) var(--section-x) var(--space-2xl);
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
    color: var(--text-primary);
    transition:
      background-color var(--duration-base),
      color var(--duration-base),
      border-color var(--duration-base);
    scroll-margin-top: var(--space-3xl);
    position: relative;
    overflow: visible;
  }

  .chart-container {
    max-width: 80rem;
    margin: 0 auto;
  }

  .chart-header {
    margin-bottom: var(--space-2xl);
    text-align: center;
  }

  .section-badge {
    font-size: var(--type-xs);
    font-family: var(--font-mono);
    color: var(--accent-primary-text);
    letter-spacing: var(--tracking-widest);
    text-transform: uppercase;
    margin-bottom: var(--space-xs);
  }

  .section-title {
    font-size: clamp(var(--type-2xl), 4vw, 2.25rem);
    font-weight: var(--weight-bold);
    color: var(--text-primary);
    line-height: var(--leading-tight);
  }

  /* ---------- Chart ---------- */

  .chart-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: var(--chart-aspect);
    margin-bottom: var(--space-2xl);
    overflow: visible;
  }

  .chart-svg {
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  /* The SVG is too dense to read below 768px; the list carries the data there,
     so the wrapper goes with it rather than leaving an empty band. */
  @media (max-width: 767px) {
    .career-chart-section {
      padding: var(--section-y-mobile) var(--section-x) var(--space-2xl);
    }

    .chart-wrapper {
      display: none;
    }
  }

  .chart-line {
    stroke-width: 3;
  }

  .point-hit {
    fill: transparent;
  }

  .point-group {
    cursor: crosshair;
  }

  .chart-point {
    fill: var(--bg-primary);
    stroke: var(--accent-primary);
    stroke-width: 2;
    transition:
      fill var(--duration-base),
      stroke-width var(--duration-base);
  }

  .point-group:hover .chart-point {
    fill: var(--accent-primary);
  }

  /* Axis label sizes are in SVG user units, not DOM pixels: the viewBox scales
     them up by roughly 1.3x at the container's max width, which is why they sit
     below the --type-* scale rather than on it. */
  .year-label {
    font-size: 0.7rem;
    font-family: var(--font-mono);
    fill: var(--text-primary);
    font-weight: var(--weight-bold);
    transition: fill var(--duration-base);
  }

  /* ---------- Hover detail: the one datum the axis doesn't carry ---------- */

  .point-tooltip {
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--duration-base);
  }

  .point-group:hover .point-tooltip {
    opacity: 1;
  }

  .tooltip-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2xs);
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    padding: var(--space-xs);
    border-radius: var(--radius-xs);
    text-align: center;
    box-shadow: var(--shadow-lg);
    transition:
      background-color var(--duration-base),
      border-color var(--duration-base);
  }

  .tooltip-year {
    font-size: var(--type-xs);
    font-family: var(--font-mono);
    font-weight: var(--weight-bold);
    color: var(--text-secondary);
  }

  .tooltip-company {
    font-size: var(--type-2xs);
    font-family: var(--font-mono);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  /* ---------- Per-point list ---------- */

  .career-points {
    display: grid;
    grid-template-columns: 1fr;
    align-items: start;
    gap: var(--space-md);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  @media (min-width: 768px) {
    .career-points {
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-lg);
    }
  }

  .career-point {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--space-md);
    text-align: left;
    transition:
      background-color var(--duration-base),
      border-color var(--duration-base);
  }

  .career-point-year {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-size: var(--type-sm);
    font-family: var(--font-mono);
    color: var(--accent-primary-text);
    font-weight: var(--weight-bold);
    margin-bottom: var(--space-2xs);
  }

  /* Echoes the plot marker so a row reads as "this point", not a loose caption. */
  .career-point-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: var(--radius-full);
    border: 2px solid var(--accent-primary);
    background: var(--bg-primary);
    flex: none;
    transition: background-color var(--duration-base);
  }

  .career-point-role {
    font-size: var(--type-base);
    color: var(--text-primary);
    font-weight: var(--weight-semibold);
    line-height: var(--leading-snug);
    margin-bottom: var(--space-2xs);
  }

  .career-point-company {
    font-size: var(--type-xs);
    font-family: var(--font-mono);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .career-point-note {
    font-size: var(--type-sm);
    line-height: var(--leading-normal);
    color: var(--text-secondary);
    margin-top: var(--space-xs);
    transition: color var(--duration-base);
  }

  /* ---------- Animation-only enhancement ----------
     Everything above renders the finished chart. The rules below are the only
     ones that hide anything, and they apply solely when JS can run the observer
     and the reader hasn't asked for reduced motion — so no-JS readers, crawlers
     and reduced-motion readers get the complete, static chart. Total sequence:
     ~690ms (650ms line draw; last point lands at 5 x 90ms + 240ms). */
  @media (scripting: enabled) and (prefers-reduced-motion: no-preference) {
    .reveal .chart-line {
      stroke-dasharray: var(--path-length);
      stroke-dashoffset: var(--path-length);
    }

    .reveal.revealed .chart-line {
      animation: draw-line 650ms var(--ease-out) forwards;
    }

    .reveal .chart-area,
    .reveal .chart-point,
    .reveal .year-label {
      opacity: 0;
    }

    .reveal.revealed .chart-area,
    .reveal.revealed .chart-point,
    .reveal.revealed .year-label {
      animation: fade-in 240ms var(--ease-out) forwards;
    }

    .career-points.reveal {
      opacity: 0;
      transform: translateY(12px);
      transition:
        opacity var(--duration-slow) var(--ease-out) 0.1s,
        transform var(--duration-slow) var(--ease-out) 0.1s;
    }

    .career-points.reveal.revealed {
      opacity: 1;
      transform: none;
    }
  }

  @keyframes draw-line {
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes fade-in {
    to {
      opacity: 1;
    }
  }
</style>
