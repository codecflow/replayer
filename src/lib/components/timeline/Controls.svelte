<script lang="ts">
	import { getReplayerContext } from '$lib/context/replayer.js';

	const { player } = getReplayerContext();

	let isPlaying = $derived(player.playing);
	let hasNext = $derived(player.hasNext);
	let hasPrev = $derived(player.hasPrev);
	let speed = $derived(player.speed);

	const speeds = [0.25, 0.5, 1, 1.5, 2, 3, 4];
</script>

<div class="flex items-center gap-2 pb-2">
	<button onclick={() => player.first()} type="button" disabled={!hasPrev}>
		<svg>
			<title>Go to first turn</title>
			<use href="#first"></use>
		</svg>
	</button>

	<button onclick={() => player.prev()} type="button" disabled={!hasPrev}>
		<svg>
			<title>Previous turn</title>
			<use href="#prev"></use>
		</svg>
	</button>

	<button
		onclick={() => player.toggle()}
		type="button"
		class="flex h-6 w-6 items-center justify-center rounded text-neutral-600 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700"
	>
		<svg>
			<title>{isPlaying ? 'Pause' : 'Play'}</title>
			<use href={isPlaying ? '#pause' : '#play'}></use>
		</svg>
	</button>

	<button onclick={() => player.next()} type="button" disabled={!hasNext}>
		<svg>
			<title>Next turn</title>
			<use href="#next"></use>
		</svg>
	</button>

	<label>
		<span>Speed:</span>
		<select
			value={speed}
			onchange={(e) => player.setSpeed(Number((e.target as HTMLSelectElement)?.value))}
		>
			{#each speeds as speed}
				<option value={speed}>{speed}x</option>
			{/each}
		</select>
	</label>
</div>

<style>
	@reference "tailwindcss";

	button {
		@apply flex h-6 w-6 items-center justify-center rounded text-neutral-600 hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-400 dark:hover:bg-neutral-700;

		& svg {
			@apply h-3 w-3;
			fill: currentColor;
		}
	}

	label {
		@apply ml-2 flex items-center gap-1;

		& span {
			@apply text-xs text-neutral-600 dark:text-neutral-400;
		}

		& select {
			@apply rounded border border-neutral-300 bg-transparent px-1 py-0.5 text-xs text-neutral-700 dark:border-neutral-600 dark:text-neutral-300;
		}
	}
</style>
