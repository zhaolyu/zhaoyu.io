<script lang="ts">
	interface Props {
		title: string;
		description: string;
		metrics: Array<{ label: string; value: string }>;
		tags: string[];
		image: string;
		diagram?: string;
	}

	let { title, description, metrics, tags, image, diagram }: Props = $props();
	let isHovered = $state(false);
</script>

<div
	class="project-card"
	role="presentation"
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
>
	<div class="card-grid">
		<div class="card-content">
			<div class="content-inner">
				<div class="tags-container">
					{#each tags as tag}
						<span class="tag">{tag}</span>
					{/each}
				</div>

				<h3 class="card-title">{title}</h3>
				<p class="card-description">{description}</p>

				<div class="metrics-grid">
					{#each metrics as metric}
						<div class="metric-item">
							<div class="metric-value">{metric.value}</div>
							<div class="metric-label">{metric.label}</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="card-footer">
				<button class="view-button">
					View Architecture
					<svg
						class="arrow-icon"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
				</button>
			</div>
		</div>

		<div class="card-visual">
			<div
				class="visual-overlay"
				class:opacity-0={isHovered}
				class:opacity-100={!isHovered}
			>
				<div class="ui-placeholder">
					[ UI SCREENSHOT: {image} ]
				</div>
			</div>

			<div
				class="diagram-overlay"
				class:opacity-100={isHovered}
				class:opacity-0={!isHovered}
			>
				<div class="diagram-placeholder">
					<span class="diagram-icon">⫷⫸</span>
					SYSTEM ARCHITECTURE<br />
					(Diagram View)
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.project-card {
		position: relative;
		width: 100%;
		border-radius: 0.75rem;
		border: 1px solid var(--border-color);
		background: var(--bg-secondary);
		overflow: hidden;
		transition: all 0.5s;
	}

	.project-card:hover {
		border-color: var(--text-muted);
		background: var(--bg-primary);
	}

	.card-grid {
		display: grid;
		grid-template-columns: 1fr;
		height: 100%;
	}

	@media (min-width: 1024px) {
		.card-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	.card-content {
		padding: 2rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
		position: relative;
		z-index: 10;
	}

	.content-inner {
		flex: 1;
	}

	.tags-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.tag {
		font-size: 0.625rem;
		font-family: var(--font-mono);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #60a5fa;
		background: rgba(59, 130, 246, 0.1);
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
	}

	.card-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 0.75rem;
		line-height: 1.2;
	}

	.card-description {
		color: var(--text-secondary);
		font-size: 0.875rem;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		border-top: 1px solid var(--border-color);
		padding-top: 1.5rem;
	}

	.metric-item {
		display: flex;
		flex-direction: column;
	}

	.metric-value {
		font-size: 1.25rem;
		font-family: var(--font-mono);
		font-weight: 700;
		color: var(--text-primary);
	}

	.metric-label {
		font-size: 0.625rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.card-footer {
		margin-top: 2rem;
	}

	.view-button {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-primary);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		transition: color 0.2s;
	}

	.project-card:hover .view-button {
		color: #60a5fa;
	}

	.arrow-icon {
		width: 1rem;
		height: 1rem;
		transition: transform 0.2s;
	}

	.project-card:hover .arrow-icon {
		transform: translateX(0.25rem);
	}

	.card-visual {
		position: relative;
		height: 300px;
		overflow: hidden;
		background: var(--bg-primary);
		border-top: 1px solid var(--border-color);
	}

	@media (min-width: 1024px) {
		.card-visual {
			height: auto;
			border-top: none;
			border-left: 1px solid var(--border-color);
		}
	}

	.visual-overlay,
	.diagram-overlay {
		position: absolute;
		inset: 0;
		transition: opacity 0.5s ease-in-out;
	}

	.ui-placeholder {
		width: 100%;
		height: 100%;
		background: var(--bg-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-muted);
		font-family: var(--font-mono);
		font-size: 0.75rem;
	}

	.diagram-overlay {
		background: rgba(30, 58, 138, 0.2);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.diagram-placeholder {
		width: 100%;
		height: 100%;
		border: 1px solid rgba(59, 130, 246, 0.3);
		border-radius: 0.25rem;
		border-style: dashed;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #60a5fa;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		text-align: center;
	}

	.diagram-icon {
		display: block;
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
	}
</style>
