<script lang="ts">
	import { Navbar, TelemetryFooter } from '$lib/components/layout';
</script>

<div class="layout-wrapper">
	<Navbar />

	<slot />

	<TelemetryFooter />
</div>

<style>
	.layout-wrapper {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
