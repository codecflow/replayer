<script lang="ts">
	import { Replayer, zip, type Turns } from '$lib/index.js';
	import { onMount } from 'svelte';

	let iterator = $state<Turns | null>(null);

	onMount(() => {
		try {
			iterator = zip('/demo.zip');
		} catch (error) {
			console.error('Failed to load demo data:', error);
		}
	});
</script>

{#if iterator}
	<Replayer {iterator} />
{:else}
	<div class="flex h-screen items-center justify-center">
		<div class="text-center">
			<div class="loading-spinner mb-4"></div>
			<p>Loading demo...</p>
		</div>
	</div>
{/if}

<style>
	.loading-spinner {
		height: 2rem;
		width: 2rem;
		animation: spin 1s linear infinite;
		border-radius: 9999px;
		border: 3px solid #d1d5db;
		border-top-color: #2563eb;
		margin: 0 auto;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
