<script lang="ts">
	import { onMount } from 'svelte';
	import Timeline from './timeline/Timeline.svelte';
	import Screen from './screen/Screen.svelte';
	import { setReplayerContext } from '$lib/context/replayer.js';
	import type { Turns } from '$lib/types/index.js';

	interface Props {
		iterator: Turns;
		scroll?: boolean;
	}

	let { iterator, scroll = true }: Props = $props();

	const { player, turns, cursor } = setReplayerContext();

	$effect(() => {
		const currentTurn = player.current;
		if (currentTurn?.actions) {
			cursor.processActions(currentTurn.actions);
		}
	});

	onMount(async () => {
		player.setScroll(scroll);

		try {
			await turns.loadFromIterator(iterator.turns, {
				totalCount: iterator.total,
				done: iterator.done,
				estimated: iterator.estimated
			});
		} catch (error) {
			console.error('Failed to load replay data:', error);
		}
	});
</script>

<div class="relative flex h-full flex-col overflow-hidden">
	<Screen dimensions={[1024, 768]} />
	<Timeline />
</div>
