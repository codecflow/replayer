<script lang="ts">
	import Track from './Track.svelte';
	import Playhead from './Playhead.svelte';
	import Controls from './Controls.svelte';
	import { getReplayerContext } from '$lib/context/replayer.js';

	const { player, turns } = getReplayerContext();

	let turnList = $derived(turns.turns);
	let currentIndex = $derived(player.index);
	let isComplete = $derived(turns.isComplete);
	let totalCount = $derived(turns.totalCount);

	let isDragging = $state(false);
	let timelineContainer: HTMLElement;
	let shouldAutoScroll = $state(true);
	let lastTurnCount = $state(0);

	$effect(() => {
		if (turnList.length > lastTurnCount && shouldAutoScroll && !isDragging) {
			setTimeout(() => {
				const container = timelineContainer?.querySelector('.wrapper');
				if (container) {
					container.scrollLeft = container.scrollWidth - container.clientWidth;
				}
			}, 100);
		}
		lastTurnCount = turnList.length;
	});

	const handleScroll = () => {
		if (!isDragging) {
			const container = timelineContainer?.querySelector('.wrapper');
			if (container) {
				const isAtEnd = container.scrollLeft >= container.scrollWidth - container.clientWidth - 10;
				shouldAutoScroll = isAtEnd;
			}
		}
	};

	const handleTurnSelect = (turnId: string) => {
		const turnIndex = turnList.findIndex((turn) => turn.id === turnId);
		if (turnIndex >= 0) {
			player.goto(turnIndex);
		}
	};

	const handlePlayheadDrag = (pixelX: number) => {
		const timelineContainer = document.querySelector('.flex.h-full.items-center.pt-4');
		if (!timelineContainer) return;

		const segments = timelineContainer.querySelectorAll(
			'[role="button"]'
		) as NodeListOf<HTMLElement>;
		let turnIndex = -1;

		for (let i = 0; i < segments.length; i++) {
			const segment = segments[i];
			const segmentLeft = segment.offsetLeft;
			const segmentRight = segmentLeft + segment.offsetWidth;

			if (pixelX >= segmentLeft && pixelX < segmentRight) {
				turnIndex = i;
				break;
			}
		}

		if (turnIndex >= 0 && turnIndex < turnList.length) {
			player.goto(turnIndex);
		}
	};

	const jumpToLatest = () => {
		if (turnList.length > 0) {
			player.goto(turnList.length - 1);
			shouldAutoScroll = true;

			setTimeout(() => {
				const container = timelineContainer?.querySelector('.wrapper');
				if (container) {
					container.scrollLeft = container.scrollWidth - container.clientWidth;
				}
			}, 100);
		}
	};
</script>

<div
	bind:this={timelineContainer}
	class="flex h-full flex-col gap-2 rounded bg-neutral-100 p-2 dark:bg-neutral-800"
>
	<Controls />
	<div class="wrapper relative flex-1 overflow-x-auto overflow-y-visible" onscroll={handleScroll}>
		<Track
			title="Timeline"
			turns={turnList}
			{currentIndex}
			trackType="screenshots"
			{handleTurnSelect}
			height="100%"
		/>
		<Playhead
			{currentIndex}
			totalTurns={turnList.length}
			turns={turnList}
			{isDragging}
			onDrag={handlePlayheadDrag}
		/>
	</div>
	<div class="flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
		<span>
			Turn {currentIndex + 1} of {totalCount}{!isComplete ? '+' : ''}
			{!isComplete ? ' (loading...)' : ''}
		</span>
		{#if !shouldAutoScroll && turnList.length > 0}
			<button
				onclick={jumpToLatest}
				class="rounded bg-blue-500 px-2 py-1 text-xs text-white transition-colors hover:bg-blue-600"
			>
				Jump to Latest
			</button>
		{/if}
	</div>
</div>

<style>
	.wrapper {
		scrollbar-width: none;
	}
</style>
