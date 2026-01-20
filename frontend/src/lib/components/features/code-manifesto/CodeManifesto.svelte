<script lang="ts">
	import { codeStandards } from '$lib/constants/content';

	let activeTab = $state('state');

	const standards = codeStandards.standards;
	const standardKeys = Object.keys(standards);

	const getNote = (tab: string): string => {
		return standards[tab]?.note || '';
	};

	const getFileName = (tab: string): string => {
		const fileMap: Record<string, string> = {
			state: 'single-source-of-truth.ts',
			dry: 'avoid-hasty-abstractions.tsx',
			server: 'edge-first-architecture.ts'
		};
		return fileMap[tab] || 'philosophy.ts';
	};
</script>

<section id="manifesto" class="code-manifesto-section">
	<div class="manifesto-container">
		<div class="manifesto-content">
			<div class="manifesto-header">
				<div class="header-content">
					<h2 class="section-badge">Engineering Philosophy</h2>
					<h3 class="section-title">Strong opinions, weakly held.</h3>
				</div>

				<div class="tab-container">
					{#each standardKeys as key}
						<button
							onclick={() => (activeTab = key)}
							class="tab-button"
							class:active={activeTab === key}
						>
							{standards[key].title}
						</button>
					{/each}
				</div>
			</div>

			<div class="code-viewer">
				<div class="viewer-header">
					<div class="window-controls">
						<div class="control-dot control-red"></div>
						<div class="control-dot control-yellow"></div>
						<div class="control-dot control-green"></div>
					</div>
					<div class="file-path">~/philosophy/{getFileName(activeTab)}</div>
				</div>

				<div class="code-grid">
					<div class="code-panel code-bad">
						<div class="panel-label">Anti-Pattern</div>
						<pre class="code-content">{standards[activeTab].bad}</pre>
					</div>

					<div class="code-panel code-good">
						<div class="panel-label">Preferred</div>
						<pre class="code-content">{standards[activeTab].good}</pre>
					</div>
				</div>
			</div>

			<div class="manifesto-note">
				<span class="note-label">NOTE:</span> {getNote(activeTab)}
			</div>
		</div>
	</div>
</section>

<style>
	.code-manifesto-section {
		padding: 6rem 1.5rem;
		border-bottom: 1px solid var(--border-color);
		background: var(--bg-primary);
		color: var(--text-primary);
		transition: background-color 0.2s, color 0.2s, border-color 0.2s;
		min-height: 400px;
		display: block;
		visibility: visible;
		opacity: 1;
		position: relative;
		width: 100%;
		z-index: 1;
	}

	.manifesto-container {
		max-width: 64rem;
		margin: 0 auto;
	}

	.manifesto-header {
		margin-bottom: 2.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.manifesto-header {
			flex-direction: row;
			justify-content: space-between;
			align-items: flex-end;
		}
	}

	.header-content {
		flex: 1;
	}

	.section-badge {
		font-size: 0.75rem;
		font-family: var(--font-mono);
		color: var(--accent-primary-light);
		letter-spacing: 0.2em;
		text-transform: uppercase;
		margin-bottom: 0.5rem;
	}

	.section-title {
		font-size: clamp(1.875rem, 4vw, 2.25rem);
		font-weight: 700;
		color: var(--text-primary);
		line-height: 1.2;
		transition: color 0.2s;
	}

	.tab-container {
		display: flex;
		background: var(--bg-secondary);
		border-radius: 0.5rem;
		padding: 0.25rem;
		border: 1px solid var(--border-color);
		gap: 0.25rem;
		transition: background-color 0.2s, border-color 0.2s;
	}

	:global(.dark) .tab-container {
		background: rgba(0, 0, 0, 0.3);
		border-color: rgba(255, 255, 255, 0.1);
	}

	.tab-button {
		padding: 0.375rem 1rem;
		font-size: 0.75rem;
		font-family: var(--font-mono);
		text-transform: uppercase;
		border-radius: 0.375rem;
		transition: all 0.2s;
		background: transparent;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
	}

	.tab-button:hover {
		color: var(--text-secondary);
	}

	.tab-button.active {
		background: var(--bg-primary);
		color: var(--text-primary);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		transition: background-color 0.2s, color 0.2s;
	}

	:global(.dark) .tab-button.active {
		background: rgba(0, 0, 0, 0.5);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	}

	.code-viewer {
		width: 100%;
		border-radius: 0.75rem;
		overflow: hidden;
		border: 1px solid var(--border-color);
		background: var(--bg-secondary);
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
		transition: background-color 0.2s, border-color 0.2s;
	}

	:global(.dark) .code-viewer {
		background: #0d0d0d;
		border-color: rgba(255, 255, 255, 0.1);
	}

	.viewer-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: var(--bg-primary);
		border-bottom: 1px solid var(--border-color);
		transition: background-color 0.2s, border-color 0.2s;
	}

	:global(.dark) .viewer-header {
		background: rgba(0, 0, 0, 0.3);
	}

	.window-controls {
		display: flex;
		gap: 0.5rem;
	}

	.control-dot {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
		border: 1px solid;
	}

	.control-red {
		background: rgba(239, 68, 68, 0.2);
		border-color: rgba(239, 68, 68, 0.5);
	}

	.control-yellow {
		background: rgba(234, 179, 8, 0.2);
		border-color: rgba(234, 179, 8, 0.5);
	}

	.control-green {
		background: rgba(34, 197, 94, 0.2);
		border-color: rgba(34, 197, 94, 0.5);
	}

	.file-path {
		margin-left: 1rem;
		font-size: 0.75rem;
		color: var(--text-muted);
		font-family: var(--font-mono);
		transition: color 0.2s;
	}

	.code-grid {
		display: grid;
		grid-template-columns: 1fr;
	}

	@media (min-width: 768px) {
		.code-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.code-panel {
		padding: 1.5rem;
		position: relative;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		line-height: 1.75;
		transition: background-color 0.2s;
	}

	.code-bad {
		background: rgba(239, 68, 68, 0.05);
		border-right: 1px solid var(--border-color);
		transition: background-color 0.2s, border-color 0.2s;
	}

	:global(.dark) .code-bad {
		background: rgba(127, 29, 29, 0.05);
	}

	@media (min-width: 768px) {
		.code-bad {
			border-right: 1px solid var(--border-color);
		}
	}

	.code-good {
		background: var(--accent-primary-10);
		transition: background-color 0.2s;
	}

	:global(.dark) .code-good {
		background: rgba(30, 58, 138, 0.05);
	}

	.panel-label {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		font-size: 0.625rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		opacity: 0.4;
		transition: opacity 0.2s;
	}

	.code-panel:hover .panel-label {
		opacity: 1;
	}

	.code-bad .panel-label {
		color: var(--status-error);
	}

	.code-good .panel-label {
		color: var(--accent-primary-light);
	}

	.code-content {
		margin: 0;
		color: var(--text-secondary);
		white-space: pre-wrap;
		word-wrap: break-word;
		overflow-x: auto;
		transition: color 0.2s;
	}

	.code-bad .code-content {
		color: var(--text-muted);
		opacity: 0.7;
		transition: opacity 0.2s;
	}

	.code-bad:hover .code-content {
		opacity: 1;
	}

	.code-good .code-content {
		color: var(--accent-primary-light);
		transition: color 0.2s;
	}

	:global(.dark) .code-good .code-content {
		color: #bfdbfe;
	}

	.manifesto-note {
		margin-top: 1rem;
		font-size: 0.75rem;
		color: var(--text-muted);
		font-family: var(--font-mono);
		max-width: 42rem;
		transition: color 0.2s;
	}

	.note-label {
		color: var(--accent-primary-light);
		margin-right: 0.5rem;
	}

	@media (max-width: 768px) {
		.code-manifesto-section {
			padding: 4rem 1rem;
		}

		.manifesto-header {
			margin-bottom: 2rem;
		}

		.code-panel {
			padding: 1rem;
		}
	}
</style>
