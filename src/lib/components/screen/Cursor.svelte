<script lang="ts">
	import { getReplayerContext } from '$lib/context/replayer.js';

	interface Props {
		screen: [width: number, height: number];
	}

	let { screen }: Props = $props();

	const { cursor } = getReplayerContext();

	let position = $derived(cursor.position);
	let scale = $derived(cursor.scale);
	let isDragging = $derived(cursor.isDragging);
	let dragStart = $derived(cursor.dragStart);
	let dragEnd = $derived(cursor.dragEnd);
	let dragProgress = $derived(cursor.dragProgress);
	let isClickAnimating = $derived(cursor.isClickAnimating);
</script>

<div
	class="cursor"
	style="
    left: {((position[0] || screen[0] / 2) / screen[0]) * 100}%;
    top: {((position[1] || screen[1] / 2) / screen[1]) * 100}%;
    transform: translate(-50%, -50%) scale({scale});
  "
>
	<img src="/cursor.svg" alt="Cursor" width="32" height="32" class="cursor-image" />

	{#if isClickAnimating}
		<div class="click-animation"></div>
	{/if}
</div>

{#if isDragging}
	<svg class="drag-line">
		<line
			x1="{(dragStart[0] / screen[0]) * 100}%"
			y1="{(dragStart[1] / screen[1]) * 100}%"
			x2="{(((dragEnd[0] - dragStart[0]) * dragProgress + dragStart[0]) / screen[0]) * 100}%"
			y2="{(((dragEnd[1] - dragStart[1]) * dragProgress + dragStart[1]) / screen[1]) * 100}%"
			stroke="rgba(255, 255, 255, 0.8)"
			stroke-width="2"
			stroke-dasharray="5,3"
			style="filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.7))"
		/>
	</svg>
{/if}

<style>
	.cursor {
		position: absolute;
		pointer-events: none;
		z-index: 10;
		transition:
			left 0.05s ease-out,
			top 0.05s ease-out;
	}

	.cursor-image {
		transform-origin: 50% 25%;
		filter: drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.5));
	}

	.click-animation {
		position: absolute;
		pointer-events: none;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 1px solid white;
		animation: pulseCircle 1s ease-out;
		z-index: 5;
	}

	@keyframes pulseCircle {
		0% {
			transform: translate(-15%, -100%) scale(0.5);
			opacity: 0.7;
		}
		100% {
			transform: translate(-15%, -100%) scale(2);
			opacity: 0;
		}
	}

	.drag-line {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		pointer-events: none;
		z-index: 5;
	}
</style>
