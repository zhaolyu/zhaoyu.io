<script lang="ts">
	import { StandaloneNavbar } from '$lib/components/layout';
</script>

<div class="standalone-wrapper">
	<StandaloneNavbar />
	<slot />
</div>

<style>
	.standalone-wrapper {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
