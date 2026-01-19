<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let latency = $state<number | null>(null);
	let time = $state(new Date());

	onMount(() => {
		if (!browser) return;

		// 1. Clock
		const timer = setInterval(() => {
			time = new Date();
		}, 1000);

		// 2. Latency Check
		const start = performance.now();
		fetch(window.location.href, { method: 'HEAD' })
			.then(() => {
				latency = Math.round(performance.now() - start);
			})
			.catch(() => {
				// Silently fail if latency check fails
			});

		return () => clearInterval(timer);
	});
</script>

<footer class="telemetry-footer">
	<div class="footer-container">
		<div class="footer-left">
			<div class="status-indicator">
				<span class="status-dot"></span>
				<span class="status-text">All Systems Operational</span>
			</div>

			<div class="footer-metric">
				<span class="metric-label">Latency:</span>
				<span class="metric-value" class:good={latency !== null && latency < 100} class:warning={latency !== null && latency >= 100}>
					{latency ? `${latency}ms` : '---'}
				</span>
			</div>

			<div class="footer-metric">
				<span class="metric-label">Local Time:</span>
				<span class="metric-value">
					{time.toLocaleTimeString('en-US', { hour12: false })}
				</span>
			</div>
		</div>

		<div class="footer-right">
			<a href="https://github.com/zhaolyu" class="footer-link">Source</a>
			<span class="footer-separator">//</span>
			<span class="footer-copyright">© 2026 Zhao Yu</span>
		</div>
	</div>
</footer>

<style>
	.telemetry-footer {
		width: 100%;
		border-top: 1px solid var(--border-color);
		background: var(--bg-primary);
		padding: 1rem 0;
		margin-top: auto;
		transition: background-color 0.2s, border-color 0.2s;
	}

	.footer-container {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.footer-container {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
	}

	.footer-left {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	@media (min-width: 768px) {
		.footer-left {
			flex-direction: row;
			align-items: center;
			gap: 1.5rem;
			margin-bottom: 0;
		}
	}

	.status-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.status-dot {
		position: relative;
		display: flex;
		height: 0.5rem;
		width: 0.5rem;
	}

	.status-dot::before {
		content: '';
		position: absolute;
		animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
		height: 100%;
		width: 100%;
		border-radius: 50%;
		background: #10b981;
		opacity: 0.75;
	}

	.status-dot::after {
		content: '';
		position: relative;
		display: inline-flex;
		height: 100%;
		width: 100%;
		border-radius: 50%;
		background: #10b981;
	}

	@keyframes ping {
		75%,
		100% {
			transform: scale(2);
			opacity: 0;
		}
	}

	.status-text {
		font-size: 0.625rem;
		font-family: var(--font-mono);
		color: #10b981;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.footer-metric {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.metric-label {
		font-size: 0.625rem;
		font-family: var(--font-mono);
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.metric-value {
		font-size: 0.625rem;
		font-family: var(--font-mono);
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.metric-value.good {
		color: #10b981;
	}

	.metric-value.warning {
		color: #fbbf24;
	}

	.footer-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.footer-link {
		font-size: 0.625rem;
		font-family: var(--font-mono);
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s;
	}

	.footer-link:hover {
		color: var(--text-primary);
	}

	.footer-separator {
		font-size: 0.625rem;
		font-family: var(--font-mono);
		color: var(--text-muted);
	}

	.footer-copyright {
		font-size: 0.625rem;
		font-family: var(--font-mono);
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	@media (max-width: 767px) {
		.footer-metric {
			display: none;
		}
	}
</style>