<script lang="ts">
  import { onMount } from "svelte";
  import AgentView from "./agent/AgentView.svelte";
  import { setReplayerContext } from "$lib/context/ReplayerContext.js";
  import { zipLoader, fileLoader } from "$lib/loaders/index.js";

  interface Props {
    files?: File[];
    zipUrl?: string;
    scroll?: boolean;
  }

  let {
    files = [],
    zipUrl = "",
    scroll = true,
  }: Props = $props();

  const { player, loader, turns, cursor } = setReplayerContext();

  // Connect stores - when player index changes, update cursor
  $effect(() => {
    const currentTurn = player.current;
    if (currentTurn?.actions) {
      cursor.processActions(currentTurn.actions);
    }
  });

  onMount(async () => {
    player.setScroll(scroll);

    try {
      let loadedTurns;
      
      if (zipUrl) {
        loadedTurns = await loader.load(zipLoader, zipUrl);
      } else if (files.length > 0) {
        loadedTurns = await loader.load(fileLoader, files);
      } else {
        return;
      }

      turns.set(loadedTurns);
    } catch (error) {
      console.error("Failed to load replay data:", error);
    }
  });

  const isLoading = $derived(loader.isLoading);
  const loadingMessage = $derived(loader.loadingMessage);
</script>

<div
  class="relative flex h-full flex-col overflow-hidden lg:h-auto lg:w-11/12 lg:grow"
>
  {#if isLoading}
    <div
      class="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="rounded-lg bg-white p-4 shadow-lg dark:bg-neutral-800">
        <div class="flex items-center gap-2">
          <div class="loading-spinner"></div>
          <span class="text-neutral-800 dark:text-neutral-200"
            >{loadingMessage}</span
          >
        </div>
      </div>
    </div>
  {/if}

  <AgentView />
</div>

<style>
  .loading-spinner {
    height: 1.25rem;
    width: 1.25rem;
    animation: spin 1s linear infinite;
    border-radius: 9999px;
    border: 2px solid #d1d5db;
    border-top-color: #2563eb;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
