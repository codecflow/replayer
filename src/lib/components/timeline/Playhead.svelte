<script lang="ts">
	interface Props {
		currentIndex: number;
		totalTurns: number;
		turns: any[];
		isDragging: boolean;
		onDrag: (position: number) => void;
	}

	let { currentIndex, totalTurns, turns, isDragging, onDrag }: Props = $props();

	let playheadElement: HTMLDivElement;
	let isMouseDown = $state(false);
	let playheadPosition = $state(0);

	$effect(() => {
		playheadPosition = getPlayheadPosition();
	});

	const getPlayheadPosition = () => {
		if (totalTurns === 0 || currentIndex < 0) return 0;

		const container = playheadElement?.parentElement;
		if (!container) return 0;

		const segments = container.querySelectorAll('[role="button"]');
		const currentSegment = segments[currentIndex] as HTMLElement;

		if (!currentSegment) return 0;

		return currentSegment.offsetLeft;
	};

	const handleMouseDown = (e: MouseEvent) => {
		isMouseDown = true;
		e.preventDefault();
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!isMouseDown) return;

		const container = playheadElement.parentElement;
		if (!container) return;

		const rect = container.getBoundingClientRect();
		const x = e.clientX - rect.left;

		const scrolledX = x + container.scrollLeft;

		onDrag(Math.max(0, scrolledX));
	};

	const handleMouseUp = () => {
		isMouseDown = false;
	};

	$effect(() => {
		if (isMouseDown) {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);

			return () => {
				document.removeEventListener('mousemove', handleMouseMove);
				document.removeEventListener('mouseup', handleMouseUp);
			};
		}
	});
</script>

<div
	bind:this={playheadElement}
	class="absolute top-0 z-20 h-full w-0.5 cursor-ew-resize bg-red-500 transition-opacity {isMouseDown
		? 'opacity-100'
		: 'opacity-80 hover:opacity-100'}"
	style="left: {playheadPosition}px"
	onmousedown={handleMouseDown}
	role="slider"
	tabindex="0"
	aria-label="Timeline playhead"
	aria-valuemin="0"
	aria-valuemax={totalTurns - 1}
	aria-valuenow={currentIndex}
>
	<div
		class="absolute -top-1 -left-1 h-3 w-3 rounded-full border-2 border-white bg-red-500 shadow-sm"
	></div>

	<div class="absolute top-0 left-0 h-full w-0.5 bg-red-500 opacity-60"></div>
</div>
