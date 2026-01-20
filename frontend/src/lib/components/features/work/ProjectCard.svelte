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
	let showDiagram = $state(false);

	function handleViewArchitecture() {
		showDiagram = true;
	}
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
				<button class="view-button" onclick={handleViewArchitecture}>
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
				class:opacity-0={isHovered || showDiagram}
				class:opacity-100={!isHovered && !showDiagram}
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
				class:opacity-100={isHovered || showDiagram}
				class:opacity-0={!isHovered && !showDiagram}
			>
				<div class="diagram-container">
					<svg viewBox="0 0 600 300" class="diagram-svg" preserveAspectRatio="xMidYMid meet">
						<defs>
							<filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
								<feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
								<feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
							</filter>
							<filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
								<feGaussianBlur stdDeviation="4" result="coloredBlur"/>
								<feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
							</filter>

							<linearGradient id="shield-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
								<stop offset="0%" class="shield-stop" stop-opacity="0" />
								<stop offset="50%" class="shield-stop" stop-opacity="0.6" />
								<stop offset="100%" class="shield-stop" stop-opacity="0" />
							</linearGradient>
							
							<linearGradient id="trail-green" x1="100%" y1="0%" x2="0%" y2="0%">
								<stop offset="0%" class="trail-stop" stop-opacity="1" />
								<stop offset="100%" class="trail-stop" stop-opacity="0" />
							</linearGradient>
						</defs>

						<g class="connection-lines" stroke-width="1">
							<line x1="50" y1="150" x2="300" y2="120" />
							<line x1="50" y1="150" x2="300" y2="150" />
							<line x1="50" y1="150" x2="300" y2="180" />
							<line x1="300" y1="150" x2="500" y2="150" stroke-dasharray="4 4" />
						</g>

						<g transform="translate(500, 150)">
							<text x="0" y="-40" text-anchor="middle" class="label-text" font-family="monospace" font-size="10" letter-spacing="2">ORIGIN</text>
							<g>
								<path class="origin-box" d="M-20 -25 L20 -25 L20 25 L-20 25 Z" stroke-width="2" />
								<ellipse class="origin-box" cx="0" cy="-25" rx="20" ry="6" stroke-width="2" />
								<circle cx="10" cy="15" r="2" class="status-indicator" opacity="0.3">
									<animate attributeName="opacity" values="0.3;1;0.3" dur="4s" begin="2s" repeatCount="indefinite" />
								</circle>
							</g>
						</g>

						<g transform="translate(300, 150)">
							<text x="0" y="-80" text-anchor="middle" class="edge-label" font-family="monospace" font-size="10" letter-spacing="2" font-weight="bold">EDGE</text>
							<rect x="-2" y="-60" width="4" height="120" fill="url(#shield-gradient)" class="pulse-slow">
								<animate attributeName="fill-opacity" values="0.6; 1; 0.6" dur="2s" repeatCount="indefinite" />
							</rect>
						</g>

						<g transform="translate(50, 150)">
							<text x="0" y="-40" text-anchor="middle" class="label-text" font-family="monospace" font-size="10" letter-spacing="2">CLIENT</text>
							<circle class="client-dot" cx="0" cy="0" r="4" />
						</g>

						<g>
							<path id="path-top" d="M50 150 Q 175 120 300 120 Q 175 120 50 150" fill="none" />
							<path id="path-mid" d="M50 150 L 300 150 L 50 150" fill="none" />
							<path id="path-bot" d="M50 150 Q 175 180 300 180 Q 175 180 50 150" fill="none" />

							<rect width="12" height="3" fill="url(#trail-green)" rx="1.5" filter="url(#glow-green)">
								<animateMotion dur="2s" repeatCount="indefinite" rotate="auto">
									<mpath href="#path-top"/>
								</animateMotion>
							</rect>
							
							<rect width="12" height="3" fill="url(#trail-green)" rx="1.5" filter="url(#glow-green)">
								<animateMotion dur="2.3s" begin="0.5s" repeatCount="indefinite" rotate="auto">
									<mpath href="#path-mid"/>
								</animateMotion>
							</rect>
							
							<rect width="12" height="3" fill="url(#trail-green)" rx="1.5" filter="url(#glow-green)">
								<animateMotion dur="1.8s" begin="0.2s" repeatCount="indefinite" rotate="auto">
									<mpath href="#path-bot"/>
								</animateMotion>
							</rect>
						</g>

						<g>
							<path id="path-ssr" d="M50 150 L 500 150 L 50 150" fill="none" />
							
							<circle class="ssr-circle" r="4" filter="url(#glow-blue)">
								<animateMotion dur="4s" repeatCount="indefinite" begin="1s" keyPoints="0;0.5;0.5;1" keyTimes="0;0.4;0.6;1">
									<mpath href="#path-ssr"/>
								</animateMotion>
							</circle>
						</g>
						
						<g transform="translate(450, 50)" font-family="monospace" font-size="10">
							<text x="0" y="0" class="hit-rate-text" font-weight="bold">HIT: 98.4%</text>
						</g>
					</svg>
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
		transition: opacity 0.5s ease-in-out, visibility 0.5s ease-in-out;
		pointer-events: none;
	}

	.visual-overlay.opacity-100,
	.diagram-overlay.opacity-100 {
		pointer-events: auto;
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
		background: var(--bg-secondary);
		border-radius: 0.25rem;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border: 1px solid var(--border-color);
		transition: background-color 0.2s, border-color 0.2s;
	}

	.browser-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: var(--bg-primary);
		border-bottom: 1px solid var(--border-color);
		transition: background-color 0.2s, border-color 0.2s;
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
		background: var(--bg-secondary);
		border-radius: 0.125rem;
		margin-left: 0.5rem;
		border: 1px solid var(--border-color);
		transition: background-color 0.2s, border-color 0.2s;
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
		background: var(--bg-secondary);
		border-radius: 0.25rem;
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		opacity: 0.6;
		transition: background-color 0.2s, opacity 0.2s;
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
		background: var(--accent-primary-10);
		border: 1px solid var(--accent-primary-20);
		border-radius: 0.25rem;
		position: relative;
		overflow: hidden;
		transition: background-color 0.2s, border-color 0.2s;
	}

	.content-header::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			transparent,
			var(--accent-primary-10),
			transparent
		);
		animation: shimmer 2s infinite;
		transform: translateX(-100%);
		transition: background 0.2s;
	}

	.content-line {
		height: 1rem;
		background: var(--bg-secondary);
		border-radius: 0.125rem;
		opacity: 0.6;
		transition: background-color 0.2s, opacity 0.2s;
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
		background: var(--bg-secondary);
		border-radius: 0.25rem;
		margin-top: 0.5rem;
		opacity: 0.4;
		transition: background-color 0.2s, opacity 0.2s;
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
		background: var(--bg-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		z-index: 2;
		visibility: hidden;
		transition: background-color 0.2s, opacity 0.5s ease-in-out, visibility 0.5s ease-in-out;
	}

	.diagram-overlay.opacity-100 {
		visibility: visible;
	}

	.visual-overlay {
		z-index: 1;
		visibility: visible;
		background: var(--bg-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		transition: background-color 0.2s, opacity 0.5s ease-in-out, visibility 0.5s ease-in-out;
	}

	.visual-overlay.opacity-0 {
		visibility: hidden;
	}

	.diagram-container {
		width: 100%;
		height: 100%;
		min-height: 240px;
		background: var(--bg-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: visible;
		position: relative;
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		transition: background-color 0.2s, border-color 0.2s;
	}

	.diagram-svg {
		width: 100%;
		height: 100%;
		max-width: 36rem;
		min-height: 240px;
	}

	/* Connection lines */
	.connection-lines {
		stroke: var(--text-primary);
		stroke-opacity: 0.1;
		transition: stroke-opacity 0.2s;
	}

	:global(.dark) .connection-lines {
		stroke-opacity: 0.03;
	}

	/* Labels */
	.label-text {
		fill: var(--text-muted);
		transition: fill 0.2s;
	}

	.edge-label {
		fill: var(--accent-primary);
		transition: fill 0.2s;
	}

	/* Origin box */
	.origin-box {
		fill: var(--bg-secondary);
		stroke: var(--border-color);
		transition: fill 0.2s, stroke 0.2s;
	}

	/* Status indicator */
	.status-indicator {
		fill: var(--status-error);
	}

	/* Client dot */
	.client-dot {
		fill: var(--text-primary);
		transition: fill 0.2s;
	}

	/* SSR circle */
	.ssr-circle {
		fill: var(--accent-primary);
		transition: fill 0.2s;
	}

	/* Hit rate text */
	.hit-rate-text {
		fill: var(--status-success);
		transition: fill 0.2s;
	}


	/* Gradient stops */
	.shield-stop {
		stop-color: var(--accent-primary);
		transition: stop-color 0.2s;
	}

	.trail-stop {
		stop-color: var(--status-success);
		transition: stop-color 0.2s;
	}

	.pulse-slow {
		animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse-slow {
		0%,
		100% {
			opacity: 0.6;
		}
		50% {
			opacity: 1;
		}
	}
</style>
