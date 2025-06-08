<script lang="ts">
	import { getReplayerContext } from '$lib/context/replayer.js';

	const { player } = getReplayerContext();

	let isPlaying = $derived(player.playing);
	let hasNext = $derived(player.hasNext);
	let hasPrev = $derived(player.hasPrev);
	let speed = $derived(player.speed);

	const speedOptions = [0.25, 0.5, 1, 1.5, 2, 3, 4];
</script>

<div class="flex items-center gap-2 pb-2">
	<!-- First Turn Button -->
	<button
		onclick={() => player.first()}
		type="button"
		disabled={!hasPrev}
		class="flex h-6 w-6 items-center justify-center rounded text-neutral-600 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-700"
		title="Go to first turn"
	>
		<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
			<line x1="5" x2="5" y1="5" y2="19"></line>
			<polygon points="19 4 9 12 19 20 19 4"></polygon>
		</svg>
	</button>

	<!-- Previous Button -->
	<button
		onclick={() => player.prev()}
		type="button"
		disabled={!hasPrev}
		class="flex h-6 w-6 items-center justify-center rounded text-neutral-600 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-700"
		title="Previous turn"
	>
		<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
			<polygon points="15 4 5 12 15 20 15 4"></polygon>
		</svg>
	</button>

	<!-- Play/Pause Button -->
	<button
		onclick={() => player.toggle()}
		type="button"
		class="flex h-6 w-6 items-center justify-center rounded text-neutral-600 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700"
		title={isPlaying ? 'Pause' : 'Play'}
	>
		{#if isPlaying}
			<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
				<rect x="14" y="4" width="4" height="16" rx="1"></rect>
				<rect x="6" y="4" width="4" height="16" rx="1"></rect>
			</svg>
		{:else}
			<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
				<polygon points="6 3 20 12 6 21 6 3"></polygon>
			</svg>
		{/if}
	</button>

	<!-- Next Button -->
	<button
		onclick={() => player.next()}
		type="button"
		disabled={!hasNext}
		class="flex h-6 w-6 items-center justify-center rounded text-neutral-600 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-700"
		title="Next turn"
	>
		<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
			<polygon points="9 4 19 12 9 20 9 4"></polygon>
		</svg>
	</button>

	<!-- Speed Control -->
	<div class="ml-2 flex items-center gap-1">
		<span class="text-xs text-neutral-600 dark:text-neutral-400">Speed:</span>
		<select
			value={speed}
			onchange={(e) => player.setSpeed(Number((e.target as HTMLSelectElement)?.value))}
			class="rounded border border-neutral-300 bg-transparent px-1 py-0.5 text-xs text-neutral-700 dark:border-neutral-600 dark:text-neutral-300"
		>
			{#each speedOptions as speedOption}
				<option value={speedOption}>{speedOption}x</option>
			{/each}
		</select>
	</div>
</div>
