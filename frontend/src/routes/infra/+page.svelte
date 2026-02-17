<script lang="ts">
  import { onMount } from 'svelte';
  import { costDB } from '$lib/db.svelte';
  import { ArchitectHUD } from '$lib/components/features/architect-hud';
  import { CostSimulator } from '$lib/components/features/cost-simulator';
  import { simulator } from '$lib/simulator.svelte';
  import { theme } from '$lib/stores';
  import type { CostSnapshot } from '$lib/types';

  let snapshots = $state<CostSnapshot[]>([]);
  let error = $state<string | null>(null);
  let isDark = $state(false);

  onMount(() => {
    theme.init();
    const unsubscribe = theme.subscribe((value) => {
      isDark = value === 'dark';
    });
    return unsubscribe;
  });

  let totalMonthlySpend = $derived(
    snapshots.reduce((acc, s) => acc + Number(s.total_monthly_estimate), 0),
  );

  $effect(() => {
    const db = costDB.instance;
    const status = costDB.status;
    if (db && status === 'Live') {
      db.query<CostSnapshot>('SELECT * FROM cost_snapshots ORDER BY created_at DESC LIMIT 10')
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

    <main class="infra-main">
      <div class="infra-metric-card">
        <span class="metric-label">Monthly Spend</span>
        <span class="metric-value">${totalMonthlySpend.toFixed(2)}</span>
        <span class="metric-context">
          {snapshots.length} snapshot{snapshots.length !== 1 ? 's' : ''} tracked
        </span>
      </div>

      <div class="infra-table-card">
        <div class="table-header-row">
          <span class="table-title">Cost Snapshots</span>
          <span class="table-count">{snapshots.length} records</span>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Commit</th>
                <th>Project</th>
                <th class="text-right">Cost</th>
              </tr>
            </thead>
            <tbody>
              {#if snapshots.length === 0}
                <tr>
                  <td colspan="4" class="table-empty">
                    {#if costDB.status === 'Syncing'}
                      Syncing data...
                    {:else}
                      No cost snapshots found
                    {/if}
                  </td>
                </tr>
              {:else}
                {#each snapshots as snapshot}
                  <tr>
                    <td>{new Date(snapshot.created_at).toLocaleDateString()}</td>
                    <td class="commit-cell">{snapshot.commit_hash?.slice(0, 7) ?? '—'}</td>
                    <td>{snapshot.project_id}</td>
                    <td class="cost-cell">${Number(snapshot.total_monthly_estimate).toFixed(2)}</td>
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
    padding: var(--space-8) var(--space-6);
  }

  /* Chrome: header + HUD — tight grouping, these are metadata not content */
  .infra-chrome {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    margin-bottom: var(--space-8);
  }

  .infra-header {
    display: flex;
    align-items: center;
    gap: var(--space-4);
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
    padding: var(--space-4);
    margin-bottom: var(--space-5);
    color: var(--status-error);
    font-family: var(--font-mono);
    font-size: 0.8rem;
  }

  /* Main content — the working area */
  .infra-main {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
  }

  /* Hero metric — the focal point of the dashboard */
  .infra-metric-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-top: 2px solid var(--accent-infra);
    border-radius: 0.75rem;
    padding: var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    transition:
      background-color 0.2s,
      border-color 0.2s;
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
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .metric-context {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
    margin-top: var(--space-1);
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
    padding: var(--space-4) var(--space-5);
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
    padding: var(--space-3) var(--space-5);
    text-align: left;
    font-size: 0.65rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border-color);
  }

  td {
    padding: var(--space-3) var(--space-5);
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

  .text-right {
    text-align: right;
  }

  .commit-cell {
    color: var(--accent-infra);
  }

  .cost-cell {
    text-align: right;
    font-weight: 600;
    color: var(--text-primary);
  }

  .table-empty {
    text-align: center;
    padding: var(--space-8) var(--space-5);
    color: var(--text-muted);
  }

  @media (max-width: 640px) {
    .infra-container {
      padding: var(--space-5) var(--space-4);
    }

    .infra-chrome {
      margin-bottom: var(--space-5);
    }
  }
</style>
