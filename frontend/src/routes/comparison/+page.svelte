<script lang="ts">
	import FrameworkCard from './components/FrameworkCard.svelte';
</script>

<svelte:head>
	<title>Framework Comparison - zhaoyu.io</title>
</svelte:head>

<article>
	<h1>Astro vs SvelteKit Comparison</h1>
	
	<section class="comparison-section">
		<h2>SPA Experience</h2>
		<div class="comparison-grid">
			<FrameworkCard
				title="Astro"
				items={[
					'✅ View Transitions (opt-in)',
					'✅ Smooth page transitions',
					'⚠️ Requires configuration',
					'⚠️ Not true SPA by default'
				]}
			/>
			<FrameworkCard
				title="SvelteKit"
				items={[
					'✅ Built-in SPA mode',
					'✅ True client-side routing',
					'✅ Persistent layouts',
					'✅ Prefetching'
				]}
			/>
		</div>
	</section>

	<section class="comparison-section">
		<h2>Performance</h2>
		<div class="comparison-grid">
			<FrameworkCard
				title="Astro"
				items={[
					'⭐⭐⭐⭐⭐ Islands architecture',
					'⭐⭐⭐⭐⭐ Minimal JS by default',
					'⭐⭐⭐⭐⭐ Fast initial load',
					'⭐⭐⭐⭐ Build time optimization'
				]}
			/>
			<FrameworkCard
				title="SvelteKit"
				items={[
					'⭐⭐⭐⭐⭐ Compiled, no virtual DOM',
					'⭐⭐⭐⭐ Small bundle sizes',
					'⭐⭐⭐⭐ Fast runtime',
					'⭐⭐⭐⭐ Code splitting'
				]}
			/>
		</div>
	</section>

	<section class="comparison-section">
		<h2>Backend/DevOps Learning</h2>
		<div class="comparison-grid">
			<FrameworkCard
				title="Astro"
				items={[
					'✅ API routes (`src/pages/api/`)',
					'✅ SSR adapters',
					'✅ Multiple deployment options',
					'⚠️ Less backend-focused'
				]}
			/>
			<FrameworkCard
				title="SvelteKit"
				items={[
					'✅ Server endpoints (`+server.ts`)',
					'✅ Form actions',
					'✅ Multiple adapters',
					'✅ Server/client boundaries'
				]}
			/>
		</div>
	</section>

	<section class="comparison-section">
		<h2>Code Comparison</h2>
		<div class="code-comparison">
			<div class="code-block">
				<h3>Astro - API Route</h3>
				<pre><code>{`// src/pages/api/test.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ message: 'Hello' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
};`}</code></pre>
			</div>
			<div class="code-block">
				<h3>SvelteKit - API Route</h3>
				<pre><code>{`// src/routes/api/test/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  return json({ message: 'Hello' });
}`}</code></pre>
			</div>
		</div>
	</section>

	<section class="comparison-section">
		<h2>Recommendation</h2>
		<div class="recommendation">
			<p><strong>For your priorities:</strong></p>
			<ul>
				<li>✅ <strong>SvelteKit</strong> - Best for SPA experience + backend learning</li>
				<li>✅ <strong>Astro</strong> - Best for performance + content sites</li>
			</ul>
			<p>See the documentation in <code>docs/</code> for more details.</p>
		</div>
	</section>
</article>

<style>
	article {
		max-width: 1200px;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 2rem;
	}

	.comparison-section {
		margin-bottom: 3rem;
	}

	h2 {
		font-size: 1.75rem;
		margin-bottom: 1.5rem;
		color: #111827;
		transition: color 0.2s;
	}

	:global(.dark) h2 {
		color: #f9fafb;
	}

	.comparison-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.code-comparison {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 1.5rem;
	}

	.code-block {
		background: #1f2937;
		border-radius: 8px;
		overflow: hidden;
	}

	.code-block h3 {
		padding: 1rem;
		margin: 0;
		background: #111827;
		color: #f9fafb;
		font-size: 1rem;
	}

	.code-block pre {
		margin: 0;
		padding: 1rem;
		overflow-x: auto;
	}

	.code-block code {
		color: #f9fafb;
		font-family: 'Monaco', 'Courier New', monospace;
		font-size: 0.875rem;
		line-height: 1.6;
	}

	.recommendation {
		padding: 1.5rem;
		background: #eff6ff;
		border-left: 4px solid #3b82f6;
		border-radius: 6px;
		transition: background 0.2s, border-color 0.2s;
	}

	:global(.dark) .recommendation {
		background: rgba(59, 130, 246, 0.1);
		border-left-color: #60a5fa;
	}

	.recommendation ul {
		margin: 1rem 0;
	}

	.recommendation li {
		margin: 0.5rem 0;
	}

	code {
		background: #1f2937;
		color: #f9fafb;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.875rem;
	}
</style>
