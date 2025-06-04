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

  const getPlayheadPosition = () => {
    if (totalTurns === 0 || currentIndex < 0) return 0;
    
    const container = playheadElement?.parentElement;
    if (!container) return 0;
    
    // Find the current segment element
    const segments = container.querySelectorAll('[role="button"]');
    const currentSegment = segments[currentIndex] as HTMLElement;
    
    if (!currentSegment) return 0;
    
    // Position playhead at the start of the segment
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
    
    // Add the scroll offset to get the actual position within the timeline
    const scrolledX = x + container.scrollLeft;
    
    onDrag(Math.max(0, scrolledX));
  };

  const handleMouseUp = () => {
    isMouseDown = false;
  };

  $effect(() => {
    if (isMouseDown) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  });
</script>

<div
  bind:this={playheadElement}
  class="absolute top-0 z-20 h-full w-0.5 cursor-ew-resize bg-red-500 transition-opacity {isMouseDown
    ? 'opacity-100'
    : 'opacity-80 hover:opacity-100'}"
  style="left: {getPlayheadPosition()}px"
  onmousedown={handleMouseDown}
  role="slider"
  tabindex="0"
  aria-label="Timeline playhead"
  aria-valuemin="0"
  aria-valuemax={totalTurns - 1}
  aria-valuenow={currentIndex}
>
  <div
    class="absolute -top-1 -left-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white shadow-sm"
  ></div>

  <div class="absolute top-0 left-0 w-0.5 h-full bg-red-500 opacity-60"></div>
</div>
