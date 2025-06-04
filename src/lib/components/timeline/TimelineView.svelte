<script lang="ts">
  import TimelineTrack from "./TimelineTrack.svelte";
  import TimelinePlayhead from "./TimelinePlayhead.svelte";
  import TimelineControls from "./TimelineControls.svelte";
  import { getReplayerContext } from "$lib/context/ReplayerContext.js";

  const { player, turns } = getReplayerContext();

  let turnList = $derived(turns.turns);
  let currentIndex = $derived(player.index);

  let isDragging = $state(false);

  const handleTurnSelect = (turnId: string) => {
    const turnIndex = turnList.findIndex(turn => turn.id === turnId);
    if (turnIndex >= 0) {
      player.goto(turnIndex);
    }
  };

  const handlePlayheadDrag = (pixelX: number) => {
    const timelineContainer = document.querySelector('.flex.h-full.items-center.pt-4');
    if (!timelineContainer) return;
    
    // Find which segment element the mouse is over
    const segments = timelineContainer.querySelectorAll('[role="button"]') as NodeListOf<HTMLElement>;
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
    
    // Only update if we found a valid turn
    if (turnIndex >= 0 && turnIndex < turnList.length) {
      player.goto(turnIndex);
    }
  };
</script>

<div
  class="flex h-full flex-col gap-2 rounded bg-neutral-100 p-2 dark:bg-neutral-800"
>
  <TimelineControls />
  <div
    class="wrapper relative flex-1 overflow-x-auto overflow-y-visible"
  >
    <TimelineTrack
      title="Timeline"
      turns={turnList}
      {currentIndex}
      trackType="screenshots"
      {handleTurnSelect}
      height="100%"
    />
    <TimelinePlayhead
      {currentIndex}
      totalTurns={turnList.length}
      turns={turnList}
      {isDragging}
      onDrag={handlePlayheadDrag}
    />
  </div>
  <div
    class="flex justify-between text-xs text-neutral-600 dark:text-neutral-400"
  >
    <span>Turn {currentIndex + 1} of {turnList.length}</span>
  </div>
</div>

<style>
  .wrapper {
    scrollbar-width: none;
  }
</style>
