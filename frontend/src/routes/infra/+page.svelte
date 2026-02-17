<script lang="ts">
	import { costDB } from '$lib/db.svelte';
	import type { CostSnapshot } from '$lib/types';

	let snapshots = $state<CostSnapshot[]>([]);
	let error = $state<string | null>(null);

	// Reactive metric derived from local data
	let totalMonthlySpend = $derived(
		snapshots.reduce((acc, s) => acc + Number(s.total_monthly_estimate), 0)
	);

	// Query local PGlite when DB is ready
	$effect(() => {
		if (costDB.instance) {
			const query = async () => {
				try {
					const res = await costDB.instance!.query<CostSnapshot>(
						'SELECT * FROM cost_snapshots ORDER BY created_at DESC LIMIT 10'
					);
					snapshots = res.rows;
				} catch (err) {
					error = err instanceof Error ? err.message : String(err);
				}
			};
			query();
		}
	});
</script>

<div class="dashboard-layout min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
	<header class="mb-8">
		<div class="flex items-center justify-between">
			<h1 class="text-4xl font-bold">Infrastructure Pulse</h1>
			<span
				class="status-badge px-4 py-2 rounded-full text-sm font-medium transition-colors"
				class:bg-green-500={costDB.status === 'Live'}
				class:bg-yellow-500={costDB.status === 'Syncing'}
			>
				{costDB.status}
			</span>
		</div>
	</header>

	<main class="space-y-6">
		{#if error}
			<div class="bg-red-500/20 border border-red-500 rounded-lg p-4">
				<p class="text-red-200">Error: {error}</p>
			</div>
		{/if}

		<div class="metric-card bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
			<div class="text-slate-400 text-sm uppercase tracking-wide">Current Est. Monthly Spend</div>
			<p class="value text-5xl font-bold mt-2">
				${totalMonthlySpend.toFixed(2)}
			</p>
		</div>

		<div class="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 overflow-hidden">
			<table class="cost-table w-full">
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
									${snapshot.total_monthly_estimate.toFixed(2)}
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>

		<!-- Debug info -->
		<details class="text-xs text-slate-500 mt-8">
			<summary class="cursor-pointer hover:text-slate-300">Debug Info</summary>
			<pre class="mt-2 bg-slate-900 p-4 rounded overflow-x-auto">{JSON.stringify(
					{
						dbReady: costDB.instance !== null,
						status: costDB.status,
						snapshotCount: snapshots.length,
						error
					},
					null,
					2
				)}</pre>
		</details>
	</main>
</div>
