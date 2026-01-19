<script lang="ts">
	import '../app.css';
	import '../app.print.css';
	import { Navbar, TelemetryFooter } from '$lib/components/layout';
</script>

<div class="layout-wrapper">
	<Navbar />

	<slot />

	<TelemetryFooter />
</div>

<style>
	:global(html),
	:global(body) {
		margin: 0;
		width: 100%;
		min-height: 100%;
	}

	:global(body) {
		font-family: var(--font-sans);
	}

	.layout-wrapper {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
