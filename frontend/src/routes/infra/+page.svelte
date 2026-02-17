<script lang="ts">
  import { costDB } from '$lib/db.svelte';
  import { ArchitectHUD } from '$lib/components/features/architect-hud';
  import type { CostSnapshot } from '$lib/types';

  let snapshots = $state<CostSnapshot[]>([]);
  let error = $state<string | null>(null);

  // Reactive metric derived from local data
  let totalMonthlySpend = $derived(
    snapshots.reduce((acc, s) => acc + Number(s.total_monthly_estimate), 0),
  );

  // Query local PGlite when sync completes (re-runs when status changes)
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
    }
  });
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
  <header class="mb-6">
    <h1 class="text-4xl font-bold">Infrastructure Pulse</h1>
  </header>

  <div class="mb-6">
    <ArchitectHUD />
  </div>

  <main class="space-y-6">
    {#if error}
      <div class="bg-red-500/20 border border-red-500 rounded-lg p-4">
        <p class="text-red-200">Error: {error}</p>
      </div>
    {/if}

    <div class="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
      <div class="text-slate-400 text-sm uppercase tracking-wide">Current Est. Monthly Spend</div>
      <p class="text-5xl font-bold mt-2">
        ${totalMonthlySpend.toFixed(2)}
      </p>
    </div>

    <div
      class="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 overflow-hidden"
    >
      <table class="w-full">
        <thead class="bg-slate-700/50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold">Date</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">Commit</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">Project</th>
            <th class="px-4 py-3 text-right text-sm font-semibold">Cost</th>
          </tr>
        </thead>
        <tbody>
          {#if snapshots.length === 0}
            <tr>
              <td colspan="4" class="px-4 py-8 text-center text-slate-400">
                {#if costDB.status === 'Syncing'}
                  Syncing data...
                {:else}
                  No cost snapshots found
                {/if}
              </td>
            </tr>
          {:else}
            {#each snapshots as snapshot}
              <tr class="border-t border-slate-700 hover:bg-slate-700/30 transition-colors">
                <td class="px-4 py-3 text-sm">
                  {new Date(snapshot.created_at).toLocaleDateString()}
                </td>
                <td class="px-4 py-3 text-sm font-mono">
                  {snapshot.commit_hash?.slice(0, 7) ?? 'N/A'}
                </td>
                <td class="px-4 py-3 text-sm">{snapshot.project_id}</td>
                <td class="px-4 py-3 text-sm text-right font-semibold">
                  ${Number(snapshot.total_monthly_estimate).toFixed(2)}
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </main>
</div>
