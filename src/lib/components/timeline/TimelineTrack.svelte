<script lang="ts">
  import type { Turn } from "$lib/types/index.js";

  interface Props {
    title: string;
    turns: Turn[];
    currentIndex: number;
    trackType: "screenshots" | "actions";
    handleTurnSelect: (turnId: string) => void;
    height: string;
  }

  let {
    title,
    turns,
    currentIndex,
    trackType,
    handleTurnSelect,
    height,
  }: Props = $props();

  const getSegmentClass = (turn: Turn) => {
    if (turn.screenshot) return "segment-screenshot";
    if (turn.actions && turn.actions.length > 3) return "segment-actions";
    return "segment-default";
  };

  const hasContent = (turn: Turn, type: string) => {
    if (type === "screenshots") {
      return !!turn.screenshot;
    } else if (type === "actions") {
      return turn.actions && turn.actions.length > 0;
    }
    return false;
  };

  const getSegmentColor = (turn: Turn, index: number) => {
    const isActive = index === currentIndex;
    const hasData = hasContent(turn, trackType);

    if (isActive) {
      return hasData ? "bg-blue-500" : "bg-blue-300";
    }
    return hasData
      ? "bg-neutral-400 dark:bg-neutral-500"
      : "bg-neutral-200 dark:bg-neutral-700";
  };

  const getTurnTooltip = (turn: Turn) => {
    const turnNum = turn.index + 1;
    if (trackType === "screenshots") {
      return turn.screenshot
        ? `Turn ${turnNum}: Screenshot`
        : `Turn ${turnNum}: No screenshot`;
    } else {
      const actionCount = turn.actions?.length || 0;
      return `Turn ${turnNum}: ${actionCount} action${actionCount !== 1 ? "s" : ""}`;
    }
  };
</script>

<div class="relative" style="height: {height}">
  <div
    class="absolute left-0 top-0 z-10 bg-neutral-100 dark:bg-neutral-800 px-1 text-xs text-neutral-600 dark:text-neutral-400"
  >
    {title}
  </div>

  <div class="flex h-full items-center pt-4">
    {#each turns as turn, index}
      <div
        class="relative h-16 cursor-pointer border-r border-neutral-300 dark:border-neutral-600 transition-colors hover:opacity-80 {getSegmentColor(
          turn,
          index
        )} {getSegmentClass(turn)} overflow-hidden"
        onclick={() => handleTurnSelect(turn.id)}
        title={getTurnTooltip(turn)}
        role="button"
        tabindex="0"
        onkeydown={(e) => e.key === "Enter" && handleTurnSelect(turn.id)}
      >
        <div
          class="absolute top-1 left-1 text-xs font-medium text-white opacity-90"
        >
          {turn.index + 1}
        </div>

        <div class="absolute top-1 right-1 flex gap-1">
          {#if turn.screenshot}
            <svg
              class="h-3 w-3 text-white opacity-80"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clip-rule="evenodd"
              />
            </svg>
          {/if}
          {#if turn.actions && turn.actions.length > 0}
            <div class="h-2 w-2 rounded-full bg-white opacity-80"></div>
          {/if}
        </div>

        <!-- Content Layout: Screenshot on right, info on left -->
        {#if turn.screenshot}
          <!-- Left side: Turn info -->
          <div class="absolute left-1 top-4 bottom-1 w-16 flex flex-col justify-between">
            {#if turn.thought}
              <div class="text-xs text-white opacity-90 leading-tight">
                <div class="line-clamp-3 overflow-hidden">
                  {turn.thought}
                </div>
              </div>
            {/if}
          </div>
          
          <!-- Right side: Screenshot preview -->
          <div class="absolute right-1 top-1 bottom-1 w-80 rounded overflow-hidden bg-black/20">
            <img
              src={turn.screenshot}
              alt="Turn {turn.index + 1} screenshot"
              class="w-full h-full object-cover"
            />
          </div>
        {:else}
          <!-- No screenshot: use full width for content -->
          {#if turn.thought}
            <div
              class="absolute bottom-1 left-1 right-1 text-xs text-white opacity-90 leading-tight"
            >
              <div class="line-clamp-2 overflow-hidden">
                {turn.thought}
              </div>
            </div>
          {/if}
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .segment-screenshot {
    width: 400px;
    flex-shrink: 0;
  }
  
  .segment-actions {
    width: 140px;
    flex-shrink: 0;
  }
  
  .segment-default {
    width: 120px;
    flex-shrink: 0;
  }
</style>
