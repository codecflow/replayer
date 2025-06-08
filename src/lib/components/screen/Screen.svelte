<script lang="ts">
	import { getReplayerContext } from '$lib/context/replayer.js';
	import Cursor from './Cursor.svelte';

	interface Props {
		dimensions: [width: number, height: number];
	}

	let { dimensions }: Props = $props();

	const { player, turns } = getReplayerContext();

	let currentTurn = $derived(player.current);
	let currentIndex = $derived(player.index);

	let aspectRatio = dimensions[0] / dimensions[1];

	const getPreviousScreenshot = (index: number) => {
		return turns.getPreviousScreenshot(index);
	};
</script>

{#if currentTurn?.screenshot}
	<div class="flex h-full justify-center overflow-hidden">
		<div
			class="screenshot-container relative overflow-hidden rounded border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900"
			style="aspect-ratio: {aspectRatio}"
		>
			<img
				src={currentTurn.screenshot}
				alt="Screenshot from {currentTurn.id}"
				class="h-full w-full"
			/>

			<Cursor screen={dimensions} />
		</div>
	</div>
{:else if currentIndex >= 0 && getPreviousScreenshot(currentIndex)}
	<div class="flex h-full justify-center overflow-hidden rounded">
		<div
			class="screenshot-container relative overflow-hidden rounded border border-neutral-200 bg-white opacity-70 dark:border-neutral-700 dark:bg-neutral-900"
			style="aspect-ratio: {aspectRatio}"
		>
			<img
				src={getPreviousScreenshot(currentIndex)}
				alt="Previous screenshot"
				class="h-full w-full"
			/>

			<Cursor screen={dimensions} />
		</div>
	</div>
{:else}
	<div
		class="rounded bg-white p-8 text-center text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300"
	>
		No screenshot available for this turn
	</div>
{/if}

<style>
	.screenshot-container {
		height: auto;
		max-height: 100%;
		width: auto;
		max-width: 100%;
	}
</style>
