<script lang="ts">
	interface Props {
		currentIndex: number;
		totalTurns: number;
		turns: any[];
		isDragging: boolean;
		onDrag: (position: number) => void;
	}

	let { currentIndex, totalTurns, onDrag }: Props = $props();

	let element: HTMLDivElement;
	let isMouseDown = $state(false);
	let position = $state(0);

	$effect(() => {
		position = getPosition();
	});

	function getPosition() {
		if (totalTurns === 0 || currentIndex < 0) return 0;

		const container = element?.parentElement;
		if (!container) return 0;

		const segments = container.querySelectorAll('[role="button"]');
		const currentSegment = segments[currentIndex] as HTMLElement;

		if (!currentSegment) return 0;

		return currentSegment.offsetLeft;
	}

	function onMouseDown(e: MouseEvent) {
		isMouseDown = true;
		e.preventDefault();
	}

	function onMouseMove(e: MouseEvent) {
		if (!isMouseDown) return;

		const container = element.parentElement;
		if (!container) return;

		const rect = container.getBoundingClientRect();
		const x = e.clientX - rect.left;

		const scrolledX = x + container.scrollLeft;

		onDrag(Math.max(0, scrolledX));
	}

	function onMouseUp() {
		isMouseDown = false;
	}

	$effect(() => {
		if (isMouseDown) {
			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', onMouseUp);

			return () => {
				document.removeEventListener('mousemove', onMouseMove);
				document.removeEventListener('mouseup', onMouseUp);
			};
		}
	});
</script>

<div
	bind:this={element}
	class:active={isMouseDown}
	style:left="{position}px"
	onmousedown={onMouseDown}
	role="slider"
	tabindex="0"
	aria-label="Playhead"
	aria-valuemin="0"
	aria-valuemax={totalTurns - 1}
	aria-valuenow={currentIndex}
></div>

<style>
	@reference "tailwindcss";

	div {
		@apply absolute top-0 z-20 h-full w-0.5 cursor-ew-resize bg-red-500 transition-opacity;
		@apply opacity-80 hover:opacity-100;

		&.active {
			@apply opacity-100;
		}

		&::after {
			content: '';
			@apply absolute -top-1 -left-1 h-3 w-3 rounded-full border-2 border-white bg-red-500 shadow-sm;
		}

		&::before {
			content: '';
			@apply absolute top-0 left-0 h-full w-0.5 bg-red-500 opacity-60;
		}
	}
</style>
