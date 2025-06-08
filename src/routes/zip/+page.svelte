<script lang="ts">
	import { Replayer, zip, type Turns } from '$lib/index.js';
	import { onMount } from 'svelte';

	let iterator = $state<Turns | null>(null);
	let error = $state<string | null>(null);

	onMount(() => {
		try {
			iterator = zip('/demo.zip');
		} catch (err) {
			console.error('Failed to load demo data:', err);
			error = 'Failed to load demo data';
		}
	});
</script>

<svelte:head>
	<title>ZIP File Demo - CodecFlow Replayer</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<div class="container mx-auto p-4">
		<div class="mb-6">
			<h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">ZIP File Demo</h1>
			<p class="text-gray-600 dark:text-gray-400">
				This demo loads replay data from a ZIP file and displays it in the timeline.
			</p>
			<div class="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
				<h3 class="mb-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
					What this demonstrates:
				</h3>
				<ul class="list-inside list-disc space-y-1 text-blue-800 dark:text-blue-200">
					<li>Loading replay data from a ZIP file</li>
					<li>Static timeline with pre-recorded turns</li>
					<li>Timeline controls (play, pause, speed, navigation)</li>
					<li>Screenshot display with cursor overlay</li>
					<li>Action visualization (clicks, typing, scrolling)</li>
				</ul>
			</div>
		</div>

		<div class="rounded-lg bg-white shadow-lg dark:bg-gray-800">
			{#if error}
				<div class="flex h-96 items-center justify-center">
					<div class="text-center text-red-600 dark:text-red-400">
						<p class="text-lg font-semibold">Error</p>
						<p>{error}</p>
					</div>
				</div>
			{:else if iterator}
				<Replayer {iterator} />
			{:else}
				<div class="flex h-96 items-center justify-center">
					<div class="text-center">
						<div class="loading-spinner mb-4"></div>
						<p class="text-gray-600 dark:text-gray-400">Loading ZIP file demo...</p>
					</div>
				</div>
			{/if}
		</div>

		<div class="mt-6 text-center">
			<a
				href="/dynamic"
				class="inline-flex items-center gap-2 rounded bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600"
			>
				Try Dynamic Demo →
			</a>
		</div>
	</div>
</div>

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
