<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { costDB } from '$lib/db.svelte';
  import { ArchitectHUD } from '$lib/components/features/architect-hud';
  import { CostSimulator } from '$lib/components/features/cost-simulator';
  import { CostTrendChart } from '$lib/components/features/cost-chart';
  import { CostFilter } from '$lib/components/features/cost-filter';
  import { simulator } from '$lib/simulator.svelte';
  import { theme } from '$lib/stores';
  import { snapshotLabel, snapshotRef, snapshotProject } from '$lib/utils/cost-guard-display';
  import type { CostSnapshot, SnapshotSource } from '$lib/types';

  let snapshots = $state<CostSnapshot[]>([]);
  let filterSources = $state<SnapshotSource[]>([]);
  let filterProjects = $state<string[]>([]);
  let error = $state<string | null>(null);
  let isDark = $state(false);

  // Bumped on an interval so the snapshot query below re-runs and picks up
  // rows Electric synced after the initial load — without this the dashboard
  // is frozen at whatever the first query saw until a full page reload.
  let refreshTick = $state(0);
  const REFRESH_INTERVAL_MS = 15_000;

  onMount(() => {
    costDB.start();
    theme.init();
    const unsubscribe = theme.subscribe((value) => {
      isDark = value === 'dark';
    });
    const refreshInterval = setInterval(() => {
      refreshTick += 1;
    }, REFRESH_INTERVAL_MS);
    return () => {
      clearInterval(refreshInterval);
      unsubscribe();
    };
  });

  // Unique sources and projects for filter chips
  let allSources = $derived([...new Set(snapshots.map((s) => s.source))] as SnapshotSource[]);
  let allProjects = $derived([...new Set(snapshots.map((s) => s.project_id))]);

  // Filtered view — in-memory, no re-query needed for ≤ 50 rows
  let filteredSnapshots = $derived(
    snapshots.filter(
      (s) =>
        (filterSources.length === 0 || filterSources.includes(s.source)) &&
        (filterProjects.length === 0 || filterProjects.includes(s.project_id)),
    ),
  );

  // Metric totals — always unfiltered so the cards show global numbers
  let gcpActual = $derived(
    snapshots
      .filter((s) => s.source === 'gcp-billing')
      .reduce((acc, s) => acc + parseFloat(s.total_monthly_estimate), 0),
  );

  let iaCEstimate = $derived(
    snapshots
      .filter((s) => s.source === 'github')
      .reduce((acc, s) => acc + parseFloat(s.total_monthly_estimate), 0),
  );

  let gcpCount = $derived(snapshots.filter((s) => s.source === 'gcp-billing').length);
  let githubCount = $derived(snapshots.filter((s) => s.source === 'github').length);

  $effect(() => {
    const db = costDB.instance;
    const status = costDB.status;
    void refreshTick; // re-query on every tick — local PGlite reads are cheap
    if (db && status === 'Live') {
      db.query<CostSnapshot>('SELECT * FROM cost_snapshots ORDER BY created_at DESC LIMIT 50')
        .then((res) => {
          snapshots = res.rows;
        })
        .catch((err) => {
          error = err instanceof Error ? err.message : String(err);
        });

      if (!simulator.isLoaded) {
        simulator.loadBaseline(db).catch((err) => {
          error = err instanceof Error ? err.message : String(err);
        });
      }
    }
  });
</script>

<svelte:head>
  <title>Infrastructure Pulse - zhaoyu.io</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="infra-page">
  <div class="infra-container">
    <div class="infra-chrome">
      <header class="infra-header">
        <div class="infra-badge">INFRA</div>
        <h1 class="infra-title">Infrastructure Pulse</h1>
        <button class="theme-toggle" onclick={() => theme.toggle()} aria-label="Toggle dark mode">
          {#if isDark}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          {:else}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          {/if}
        </button>
      </header>
      <ArchitectHUD />
    </div>

    {#if error}
      <div class="infra-error">
        <p>{error}</p>
      </div>
    {/if}

    <main id="main" class="infra-main">
      <!-- Summary metrics (always unfiltered) -->
      <div class="infra-metric-card">
        <div class="metric-col">
          <span class="metric-label">GCP Actual</span>
          <span class="metric-value metric-value-gcp">${gcpActual.toFixed(2)}</span>
          <span class="metric-context">
            {gcpCount} snapshot{gcpCount !== 1 ? 's' : ''}
          </span>
        </div>
        <div class="metric-divider"></div>
        <div class="metric-col">
          <span class="metric-label">IaC Estimate</span>
          <span class="metric-value metric-value-iac">${iaCEstimate.toFixed(2)}</span>
          <span class="metric-context">
            {githubCount} snapshot{githubCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <!-- Trend chart (respects active filters) -->
      <CostTrendChart snapshots={filteredSnapshots} />

      <!-- Table with inline filter bar -->
      <div class="infra-table-card">
        <div class="table-header-row">
          <span class="table-title">Cost Snapshots</span>
          <span class="table-count">{filteredSnapshots.length} records</span>
        </div>

        <CostFilter
          sources={allSources}
          projects={allProjects}
          bind:selectedSources={filterSources}
          bind:selectedProjects={filterProjects}
        />

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Source</th>
                <th>Project</th>
                <th>Ref</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {#if filteredSnapshots.length === 0}
                <tr>
                  <td colspan="5" class="table-empty">
                    {#if costDB.status === 'Syncing'}
                      Syncing data...
                    {:else if snapshots.length > 0}
                      No snapshots match the current filters
                    {:else}
                      <span class="empty-title">No cost snapshots synced yet.</span>
                      <span class="empty-detail">
                        Snapshots arrive via an HMAC-signed GitHub Actions dispatch &rarr; ingestion
                        API &rarr; ElectricSQL, then replicate into this in-browser Postgres
                        (PGlite). The pipeline is live — the publishing workflow just hasn't been
                        dispatched recently.
                      </span>
                    {/if}
                  </td>
                </tr>
              {:else}
                {#each filteredSnapshots as snapshot (snapshot.id)}
                  <tr
                    class={snapshot.source === 'gcp-billing' ? 'row-gcp' : 'row-github'}
                    in:fly={{ y: 6, duration: 150 }}
                  >
                    <td>
                      {new Date(snapshot.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <span
                        class="source-badge"
                        class:badge-gcp={snapshot.source === 'gcp-billing'}
                        class:badge-github={snapshot.source === 'github'}
                      >
                        {snapshotLabel(snapshot)}
                      </span>
                    </td>
                    <td class="project-cell">{snapshotProject(snapshot)}</td>
                    <td class="ref-cell">{snapshotRef(snapshot)}</td>
                    <td class="cost-cell">
                      ${parseFloat(snapshot.total_monthly_estimate).toFixed(2)}
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
      </div>

      <CostSimulator />
    </main>
  </div>
</div>

<style>
  .infra-page {
    min-height: 100vh;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    transition:
      background-color 0.2s,
      color 0.2s;
  }

  .infra-container {
    max-width: 64rem;
    margin: 0 auto;
    padding: var(--space-2xl) var(--space-xl);
  }

  /* Chrome: header + HUD — tight grouping, these are metadata not content */
  .infra-chrome {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    margin-bottom: var(--space-2xl);
  }

  .infra-header {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .theme-toggle {
    margin-left: auto;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    padding: 0.375rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    transition:
      color 0.2s,
      border-color 0.2s,
      background-color 0.2s;
  }

  .theme-toggle:hover {
    color: var(--accent-infra);
    border-color: var(--accent-infra);
  }

  .infra-badge {
    font-family: var(--font-mono);
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--accent-infra);
    background: var(--accent-infra-10);
    padding: 0.25rem 0.625rem;
    border-radius: 0.25rem;
  }

  .infra-title {
    font-family: var(--font-sans);
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-primary);
  }

  /* Error — sits between chrome and main, outside the flow */
  .infra-error {
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.25);
    border-radius: 0.5rem;
    padding: var(--space-md);
    margin-bottom: var(--space-lg);
    color: var(--status-error);
    font-family: var(--font-mono);
    font-size: 0.8rem;
  }

  /* Main content — the working area */
  .infra-main {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  /* Hero metric — side-by-side GCP Actual vs IaC Estimate */
  .infra-metric-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-top: 2px solid var(--accent-infra);
    border-radius: 0.75rem;
    padding: var(--space-xl);
    display: flex;
    align-items: stretch;
    gap: 0;
    transition:
      background-color 0.2s,
      border-color 0.2s;
  }

  .metric-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
  }

  .metric-divider {
    width: 1px;
    background: var(--border-color);
    margin: 0 var(--space-xl);
    align-self: stretch;
  }

  .metric-label {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
  }

  .metric-value {
    font-family: var(--font-mono);
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .metric-value-gcp {
    color: var(--status-success);
  }

  .metric-value-iac {
    color: var(--accent-infra);
  }

  .metric-context {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
    margin-top: var(--space-2xs);
  }

  /* Table card */
  .infra-table-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    overflow: hidden;
    transition:
      background-color 0.2s,
      border-color 0.2s;
  }

  .table-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-md) var(--space-lg);
    border-bottom: 1px solid var(--border-color);
  }

  .table-title {
    font-family: var(--font-sans);
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .table-count {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .table-wrap {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-mono);
    font-size: 0.8rem;
  }

  thead {
    background: var(--bg-primary);
  }

  th {
    padding: var(--space-sm) var(--space-lg);
    text-align: left;
    font-size: 0.65rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border-color);
  }

  td {
    padding: var(--space-sm) var(--space-lg);
    color: var(--text-secondary);
    border-bottom: 1px solid var(--border-color);
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr {
    transition: background-color 0.15s;
  }

  tbody tr:hover {
    background-color: var(--bg-primary);
  }

  /* Source-specific row accent via left border on first td */
  .row-gcp td:first-child {
    border-left: 2px solid var(--status-success);
    padding-left: calc(var(--space-lg) - 2px);
  }

  .row-github td:first-child {
    border-left: 2px solid var(--accent-infra);
    padding-left: calc(var(--space-lg) - 2px);
  }

  /* Source badges */
  .source-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.1875rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  .badge-gcp {
    background: rgba(16, 185, 129, 0.1);
    color: var(--status-success);
  }

  .badge-github {
    background: var(--accent-infra-10);
    color: var(--accent-infra);
  }

  .text-right {
    text-align: right;
  }

  .project-cell {
    color: var(--text-muted);
    font-size: 0.75rem;
  }

  .ref-cell {
    color: var(--text-secondary);
    font-size: 0.75rem;
  }

  .cost-cell {
    text-align: right;
    font-weight: 600;
    color: var(--text-primary);
  }

  .table-empty {
    text-align: center;
    padding: var(--space-2xl) var(--space-lg);
    color: var(--text-muted);
  }

  .empty-title {
    display: block;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: var(--space-xs);
  }

  .empty-detail {
    display: block;
    max-width: 32rem;
    margin: 0 auto;
    font-size: 0.8125rem;
    line-height: 1.6;
  }

  @media (max-width: 640px) {
    .infra-container {
      padding: var(--space-lg) var(--space-md);
    }

    .infra-chrome {
      margin-bottom: var(--space-lg);
    }

    .infra-metric-card {
      flex-direction: column;
      gap: var(--space-lg);
    }

    .metric-divider {
      width: auto;
      height: 1px;
      margin: 0;
    }
  }
</style>
