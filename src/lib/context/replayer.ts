import { setContext, getContext } from 'svelte';
import { TurnStore } from '../stores/turns.svelte.js';
import { Player } from '../stores/player.svelte.js';
import { CursorStore } from '../stores/cursor.svelte.js';

const KEY = Symbol('replayer');

interface ReplayerContext {
	turns: TurnStore;
	player: Player;
	cursor: CursorStore;
}

export function setReplayerContext() {
	const turns = new TurnStore();
	const player = new Player(turns);
	const cursor = new CursorStore();

	return setContext<ReplayerContext>(KEY, {
		turns,
		player,
		cursor
	});
}

export function getReplayerContext() {
	type Context = ReturnType<typeof setReplayerContext>;
	return getContext<Context>(KEY);
}
