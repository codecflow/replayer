import type { Turn } from '$lib/types/index.js';

interface TurnsMetadata {
	totalCount?: number;
	done?: boolean;
	estimated?: number;
}

export class TurnStore {
	turns = $state<Turn[]>([]);
	metadata = $state<TurnsMetadata>({});
	isLoading = $state(false);

	total = $derived(this.turns.length);
	totalCount = $derived(this.metadata.totalCount ?? this.turns.length);
	isComplete = $derived(this.metadata.done ?? true);

	set(turns: Turn[], metadata?: TurnsMetadata) {
		this.turns = turns;
		this.metadata = metadata ?? {};
	}

	add(turn: Turn) {
		this.turns.push(turn);
	}

	addMany(turns: Turn[]) {
		this.turns.push(...turns);
	}

	updateMetadata(metadata: TurnsMetadata) {
		this.metadata = { ...this.metadata, ...metadata };
	}

	get(index: number): Turn | undefined {
		return this.turns[index];
	}

	clear() {
		this.turns = [];
		this.metadata = {};
		this.isLoading = false;
	}

	findByName(name: string): Turn | undefined {
		return this.turns.find((turn) => turn.id === name);
	}

	getPreviousScreenshot(index: number): string | null {
		for (let i = index - 1; i >= 0; i--) {
			const turn = this.turns[i];
			if (turn?.screenshot) {
				return turn.screenshot;
			}
		}
		return null;
	}

	async loadFromIterator(iterator: AsyncIterable<Turn>, metadata?: TurnsMetadata) {
		this.clear();
		this.isLoading = true;
		this.metadata = metadata ?? {};

		try {
			for await (const turn of iterator) {
				this.add(turn);
			}
			this.metadata.done = true;
		} finally {
			this.isLoading = false;
		}
	}
}
