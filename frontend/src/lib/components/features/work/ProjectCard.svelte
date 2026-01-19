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
					<div class="browser-window">
						<div class="browser-header">
							<div class="window-controls">
								<div class="control-dot control-red"></div>
								<div class="control-dot control-yellow"></div>
								<div class="control-dot control-green"></div>
							</div>
							<div class="url-bar"></div>
						</div>
						<div class="browser-content">
							<div class="sidebar"></div>
							<div class="main-content">
								<div class="content-header"></div>
								<div class="content-line content-line-1"></div>
								<div class="content-line content-line-2"></div>
								<div class="content-block"></div>
							</div>
						</div>
					</div>
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
		color: var(--accent-primary-light);
		background: var(--accent-primary-10);
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
		color: var(--accent-primary-light);
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
		padding: 1rem;
	}

	.browser-window {
		width: 100%;
		height: 100%;
		background: #171717;
		border-radius: 0.25rem;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.browser-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: #0a0a0a;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.window-controls {
		display: flex;
		gap: 0.5rem;
	}

	.control-dot {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
	}

	.control-red {
		background: rgba(239, 68, 68, 0.2);
		border: 1px solid rgba(239, 68, 68, 0.5);
	}

	.control-yellow {
		background: rgba(234, 179, 8, 0.2);
		border: 1px solid rgba(234, 179, 8, 0.5);
	}

	.control-green {
		background: rgba(34, 197, 94, 0.2);
		border: 1px solid rgba(34, 197, 94, 0.5);
	}

	.url-bar {
		flex: 1;
		height: 0.5rem;
		background: #262626;
		border-radius: 0.125rem;
		margin-left: 0.5rem;
	}

	.browser-content {
		flex: 1;
		display: flex;
		gap: 1rem;
		padding: 1rem;
	}

	.sidebar {
		width: 25%;
		height: 75%;
		background: rgba(38, 38, 38, 0.5);
		border-radius: 0.25rem;
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.content-header {
		width: 100%;
		height: 8rem;
		background: rgba(59, 130, 246, 0.1);
		border: 1px solid rgba(59, 130, 246, 0.2);
		border-radius: 0.25rem;
		position: relative;
		overflow: hidden;
	}

	.content-header::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(59, 130, 246, 0.1),
			transparent
		);
		animation: shimmer 2s infinite;
		transform: translateX(-100%);
	}

	.content-line {
		height: 1rem;
		background: rgba(38, 38, 38, 0.5);
		border-radius: 0.125rem;
	}

	.content-line-1 {
		width: 75%;
	}

	.content-line-2 {
		width: 50%;
	}

	.content-block {
		width: 100%;
		height: 6rem;
		background: rgba(38, 38, 38, 0.3);
		border-radius: 0.25rem;
		margin-top: 0.5rem;
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
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
		color: var(--accent-primary-light);
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
