<script lang="ts">
  import TokenGrid from '$lib/components/design-system/TokenGrid.svelte';
  import BuilderCard from '$lib/components/features/builder/BuilderCard.svelte';
  import { NoteExcerptCard } from '$lib/components/features/notes';
  import {
    SectionHeader,
    StatCard,
    DataTable,
    ChartFrame,
    AnnotatedLineChart,
  } from '$lib/components/ui';
  import { tokenGroups } from '$lib/constants/design-tokens';
  import { builderProjects, notesData, type BuilderProject } from '$lib/constants/content';
  import type { ChartPoint, DataColumn, StatusTone } from '$lib/types';

  let { data } = $props();

  const group = $derived(tokenGroups.find((g) => g.id === data.card.slug));

  /**
   * Component previews use real site content so a card can never show a
   * component styled for data the site doesn't actually have. The status matrix
   * is synthesised from one real card, since no single page shows all six.
   */
  const leadProject = builderProjects[0];
  const STATUSES: BuilderProject['status'][] = [
    'active',
    'beta-pilot',
    'completed',
    'shipped',
    'in-progress',
    'exploring',
  ];

  const statusMatrix: BuilderProject[] = STATUSES.map((status) => ({
    ...leadProject,
    title: `Status: ${status}`,
    description: leadProject.description.slice(0, 120) + '…',
    status,
    link: undefined,
  }));

  const categoryMatrix: BuilderProject[] = (
    ['professional', 'independent', 'experiment'] as const
  ).map((category) => {
    const real = builderProjects.find((p) => p.category === category);
    return { ...(real ?? leadProject), category };
  });

  /* Dashboard kit previews. The site has no live dashboard yet, so these are
     real shapes with synthetic values — same rule the status matrix follows. */
  const equity: ChartPoint[] = [
    { x: 0, y: 10000 },
    { x: 1, y: 10150 },
    { x: 2, y: 10100 },
    { x: 3, y: 10600 },
    { x: 4, y: 10800 },
    { x: 5, y: 11300 },
    { x: 6, y: 11600 },
    { x: 7, y: 12100 },
    { x: 8, y: 12480 },
  ];

  const signalColumns: DataColumn[] = [
    { key: 'ticker', label: 'Ticker', mono: true },
    { key: 'side', label: 'Side' },
    { key: 'model', label: 'Model p', align: 'right', numeric: true },
    { key: 'quoted', label: 'Quoted p', align: 'right', numeric: true },
    { key: 'edge', label: 'Edge', align: 'right', numeric: true },
    { key: 'tier', label: 'Tier', pill: true },
  ];

  const signalRows = [
    {
      ticker: 'KXFED-25DEC50',
      side: 'YES',
      model: '71%',
      quoted: '58%',
      edge: '13.0%',
      tier: 'strong',
    },
    {
      ticker: 'KXFED-25DEC25',
      side: 'NO',
      model: '54%',
      quoted: '49%',
      edge: '7.4%',
      tier: 'marginal',
    },
    { ticker: 'KXAI-GA-Q4', side: 'YES', model: '39%', quoted: '41%', edge: '3.1%', tier: 'below' },
  ];

  const TIER_TONE: Record<string, StatusTone> = {
    strong: 'success',
    marginal: 'warning',
    below: 'neutral',
  };

  /* The edge figure and the tier pill carry the same tone, which is the rule
     the table encodes: a coloured number is never the only signal. */
  const signalTone = (row: Record<string, string>, column: DataColumn): StatusTone | undefined =>
    column.key === 'tier' || column.key === 'edge' ? TIER_TONE[row.tier] : undefined;

  let signalSort = $state('edge');

  /* Reliability scatter for the plain-ChartFrame half of the chart card:
     predicted vs observed, so the dashed diagonal is the reference. */
  const reliability = [
    { p: 0.1, actual: 0.08 },
    { p: 0.2, actual: 0.24 },
    { p: 0.3, actual: 0.27 },
    { p: 0.4, actual: 0.45 },
    { p: 0.5, actual: 0.48 },
    { p: 0.6, actual: 0.66 },
    { p: 0.7, actual: 0.64 },
    { p: 0.8, actual: 0.83 },
    { p: 0.9, actual: 0.86 },
  ];

  const RW = 340;
  const RH = 210;
  const RPAD = { left: 38, bottom: 30, edge: 14 };
  const rx = (v: number) => RPAD.left + v * (RW - RPAD.left - RPAD.edge);
  const ry = (v: number) => RH - RPAD.bottom - v * (RH - RPAD.bottom - RPAD.edge);
</script>

<svelte:head>
  <title>{data.card.name} — zhaoyu.io design system</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="ds-card">
  <header class="ds-head">
    <p class="ds-group">{data.card.group}</p>
    <h1>{data.card.name}</h1>
    <p class="ds-subtitle">{data.card.subtitle}</p>
    {#if group}
      <p class="ds-description">{group.description}</p>
    {/if}
  </header>

  {#if group}
    <div class="ds-themes">
      <TokenGrid {group} />
      <TokenGrid {group} dark />
    </div>
  {:else if data.card.slug === 'system-card'}
    <section class="ds-section">
      <h2>Categories</h2>
      <div class="ds-grid">
        {#each categoryMatrix as project (project.category)}
          <BuilderCard {project} />
        {/each}
      </div>
    </section>
    <section class="ds-section">
      <h2>Statuses</h2>
      <div class="ds-grid">
        {#each statusMatrix as project (project.status)}
          <BuilderCard {project} />
        {/each}
      </div>
    </section>
    <section class="ds-section dark ds-dark-scope">
      <h2>Dark</h2>
      <div class="ds-grid">
        {#each categoryMatrix as project (project.category)}
          <BuilderCard {project} />
        {/each}
      </div>
    </section>
  {:else if data.card.slug === 'note-card'}
    <section class="ds-section">
      <h2>Light</h2>
      <div class="ds-grid">
        {#each notesData.notes.slice(0, 3) as note (note.slug)}
          <NoteExcerptCard {note} />
        {/each}
      </div>
    </section>
    <section class="ds-section dark ds-dark-scope">
      <h2>Dark</h2>
      <div class="ds-grid">
        {#each notesData.notes.slice(0, 3) as note (note.slug)}
          <NoteExcerptCard {note} />
        {/each}
      </div>
    </section>
  {:else if data.card.slug === 'section-header'}
    <section class="ds-section">
      <h2>Light</h2>
      <SectionHeader badge="Selected Work & Systems">
        Systems I've architected,<br />
        <span class="headline-accent">from CNBC to architectural sandboxes.</span>
      </SectionHeader>
    </section>
    <section class="ds-section dark ds-dark-scope">
      <h2>Dark</h2>
      <SectionHeader badge="Digital Garden" headline="Engineering Notes." accentText="" />
    </section>
  {:else if data.card.slug === 'stat-card'}
    {#snippet spark()}
      <svg viewBox="0 0 64 20" width="64" height="20" aria-hidden="true" class="spark">
        <polyline points="0,17 8,15 16,16 24,11 32,9 40,6 48,5 56,3 64,1" />
      </svg>
    {/snippet}
    <section class="ds-section">
      <h2>Light</h2>
      <div class="ds-grid">
        <StatCard
          label="Bankroll"
          value="$12,480"
          delta="4.2%"
          tone="success"
          direction="up"
          caption="vs seed"
          trend={spark}
        />
        <StatCard
          label="Drawdown"
          value="-6.1%"
          delta="peak-to-trough"
          tone="error"
          direction="down"
        />
        <StatCard
          label="Regime"
          value="PIVOT_WATCH"
          tone="warning"
          live
          caption="3 of 5 signals non-normal"
        />
      </div>
    </section>
    <section class="ds-section dark ds-dark-scope">
      <h2>Dark</h2>
      <div class="ds-grid">
        <StatCard
          label="Bankroll"
          value="$12,480"
          delta="4.2%"
          tone="success"
          direction="up"
          caption="vs seed"
          trend={spark}
        />
        <StatCard label="Open positions" value="3" caption="$1,850 net exposure" />
      </div>
    </section>
  {:else if data.card.slug === 'data-table'}
    <section class="ds-section">
      <h2>Light — sortable header</h2>
      <DataTable
        columns={signalColumns}
        rows={signalRows}
        sortKey={signalSort}
        toneFor={signalTone}
        onsort={(key) => (signalSort = key)}
      />
    </section>
    <section class="ds-section dark ds-dark-scope">
      <h2>Dark — static header</h2>
      <DataTable columns={signalColumns} rows={signalRows} sortKey="edge" toneFor={signalTone} />
    </section>
  {:else if data.card.slug === 'annotated-chart'}
    <section class="ds-section">
      <h2>Light — annotated series</h2>
      <AnnotatedLineChart
        title="Paper equity, Sep–Dec"
        caption="Dot colour is trade outcome; the dashed rule is the event the chart is about."
        points={equity}
        xTicks={[
          { at: 0, label: 'Sep' },
          { at: 3, label: 'Oct' },
          { at: 6, label: 'Nov' },
          { at: 8, label: 'Dec' },
        ]}
        yTicks={[10000, 11000, 12000, 13000]}
        formatY={(v) => `$${v / 1000}k`}
        markers={[
          { x: 1, y: 10150, tone: 'success' },
          { x: 2, y: 10100, tone: 'error' },
          { x: 8, y: 12480, tone: 'neutral' },
        ]}
        annotation={{ at: 4, label: 'LLM strategy on' }}
      />
    </section>
    <section class="ds-section dark ds-dark-scope">
      <h2>Dark — plain frame</h2>
      <ChartFrame
        title="Reliability"
        caption="Predicted vs actual — near the diagonal is calibrated."
        legend={[
          { label: 'Observed', color: 'var(--viz-series-2)', shape: 'dot' },
          { label: 'Perfect calibration', color: 'var(--viz-reference)', shape: 'dashed' },
        ]}
      >
        <svg
          viewBox="0 0 {RW} {RH}"
          width="100%"
          role="img"
          aria-label="Reliability diagram: observed frequency against predicted probability."
        >
          <line x1={rx(0)} y1={ry(0)} x2={rx(0)} y2={ry(1)} class="rel-axis" />
          <line x1={rx(0)} y1={ry(0)} x2={rx(1)} y2={ry(0)} class="rel-axis" />
          <line x1={rx(0)} y1={ry(0)} x2={rx(1)} y2={ry(1)} class="rel-ref" />
          {#each reliability as bin (bin.p)}
            <circle cx={rx(bin.p)} cy={ry(bin.actual)} r="4" class="rel-dot" />
          {/each}
          {#each [0, 0.5, 1] as tick (tick)}
            <text x={rx(tick)} y={ry(0) + 16} class="rel-tick" text-anchor="middle">{tick}</text>
            <text x={rx(0) - 8} y={ry(tick) + 4} class="rel-tick" text-anchor="end">{tick}</text>
          {/each}
        </svg>
      </ChartFrame>
    </section>
  {/if}
</main>

<style>
  .ds-card {
    background: var(--bg-primary);
    color: var(--text-primary);
    padding: var(--space-xl);
    display: flex;
    flex-direction: column;
    gap: var(--space-xl);
    min-height: 100vh;
    font-family: var(--font-sans);
  }

  .ds-head {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: var(--space-md);
  }

  .ds-group {
    font-family: var(--font-mono);
    font-size: var(--type-2xs);
    letter-spacing: var(--tracking-widest);
    text-transform: uppercase;
    color: var(--accent-primary-text);
    margin: 0;
  }

  h1 {
    font-size: var(--type-xl);
    font-weight: var(--weight-bold);
    line-height: var(--leading-snug);
    margin: 0;
  }

  h2 {
    font-family: var(--font-mono);
    font-size: var(--type-2xs);
    letter-spacing: var(--tracking-widest);
    text-transform: uppercase;
    color: var(--text-muted);
    margin: 0;
  }

  .ds-subtitle {
    font-size: var(--type-sm);
    color: var(--text-secondary);
    margin: 0;
  }

  .ds-description {
    font-size: var(--type-sm);
    color: var(--text-muted);
    max-width: 68ch;
    margin: 0;
    line-height: var(--leading-normal);
  }

  .ds-themes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-lg);
    align-items: start;
  }

  .ds-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  /* `.dark` only redefines tokens, so scoping it to a container renders the
     dark theme inline — no second page, no screenshot pair to keep in sync. */
  .ds-dark-scope {
    background: var(--bg-primary);
    color: var(--text-primary);
    padding: var(--space-lg);
    border-radius: var(--radius-lg);
  }

  .ds-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(19rem, 1fr));
    gap: var(--space-lg);
  }

  /* Preview-only marks. The components own their own chrome; these style the
     sparkline and the reliability scatter this page hands them as content. */
  .spark polyline {
    fill: none;
    stroke: var(--viz-series-1);
    stroke-width: 2;
  }

  .rel-axis {
    stroke: var(--viz-axis);
  }

  .rel-ref {
    stroke: var(--viz-reference);
    stroke-width: 1;
    stroke-dasharray: 4 4;
  }

  .rel-dot {
    fill: var(--viz-series-2);
  }

  .rel-tick {
    font-family: var(--font-mono);
    font-size: 10px;
    fill: var(--text-muted);
  }

  @media (max-width: 900px) {
    .ds-themes {
      grid-template-columns: 1fr;
    }
  }
</style>
