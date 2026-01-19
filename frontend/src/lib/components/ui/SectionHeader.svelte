<script lang="ts">
	interface Props {
		badge: string;
		headline: string;
		accentText?: string;
	}

	let { badge, headline, accentText }: Props = $props();
</script>

<div class="section-header">
	<div class="header-badge">
		<div class="badge-line"></div>
		<h2 class="badge-text">{badge}</h2>
	</div>
	<h3 class="section-headline">
		{@html headline}
		{#if accentText}
			<span class="headline-accent">{accentText}</span>
		{/if}
	</h3>
</div>

<style>
	.section-header {
		margin-bottom: 4rem;
	}

	@media (max-width: 768px) {
		.section-header {
			margin-bottom: 3rem;
		}
	}

	.header-badge {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.badge-line {
		height: 1px;
		width: 3rem;
		background: var(--border-color);
		transition: background-color 0.2s;
	}

	.badge-text {
		font-size: 0.75rem;
		font-family: var(--font-mono);
		color: var(--accent-primary-light);
		letter-spacing: 0.2em;
		text-transform: uppercase;
	}

	.section-headline {
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: 700;
		color: var(--text-primary);
		max-width: 48rem;
		line-height: 1.2;
		letter-spacing: -0.02em;
		transition: color 0.2s;
	}

	.headline-accent {
		color: var(--text-muted);
		transition: color 0.2s;
	}
</style>
