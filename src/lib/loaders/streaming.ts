import type { Turn, Turns } from '$lib/types/index.js';

export function streaming(url: string): Turns {
	async function* loadTurns(): AsyncGenerator<Turn> {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch stream: ${response.status} ${response.statusText}`);
		}

		const reader = response.body?.getReader();
		if (!reader) {
			throw new Error('No readable stream available');
		}

		const decoder = new TextDecoder();
		let buffer = '';
		let turnIndex = 0;

		try {
			while (true) {
				const { done, value } = await reader.read();

				if (done) break;

				buffer += decoder.decode(value, { stream: true });

				const lines = buffer.split('\n');
				buffer = lines.pop() || '';

				for (const line of lines) {
					if (line.trim()) {
						try {
							const turnData = JSON.parse(line);
							const turn: Turn = {
								type: turnData.type || 'assistant',
								id: `turn_${turnIndex}`,
								index: turnIndex,
								timestamp: turnData.timestamp || Date.now(),
								screenshot: turnData.screenshot,
								thought: turnData.thought,
								actions: turnData.actions || [],
								metadata: turnData.metadata
							};

							yield turn;
							turnIndex++;

							await new Promise((resolve) => setTimeout(resolve, 100));
						} catch (e) {
							console.warn('Failed to parse turn data:', line, e);
						}
					}
				}
			}

			if (buffer.trim()) {
				try {
					const turnData = JSON.parse(buffer);
					const turn: Turn = {
						type: turnData.type || 'assistant',
						id: `turn_${turnIndex}`,
						index: turnIndex,
						timestamp: turnData.timestamp || Date.now(),
						screenshot: turnData.screenshot,
						thought: turnData.thought,
						actions: turnData.actions || [],
						metadata: turnData.metadata
					};

					yield turn;
				} catch (e) {
					console.warn('Failed to parse final turn data:', buffer, e);
				}
			}
		} finally {
			reader.releaseLock();
		}
	}

	return {
		turns: loadTurns(),
		done: false
	};
}

export function agent(initialTurns: Turn[] = []): Turns & { addTurn: (turn: Turn) => void } {
	const turnQueue: Turn[] = [...initialTurns];
	let isComplete = false;
	let yieldedCount = 0;

	async function* loadTurns(): AsyncGenerator<Turn> {
		for (const turn of initialTurns) {
			yield turn;
			yieldedCount++;
		}

		while (!isComplete) {
			if (turnQueue.length > yieldedCount) {
				const newTurns = turnQueue.slice(yieldedCount);
				for (const turn of newTurns) {
					yield turn;
					yieldedCount++;
				}
			}

			await new Promise((resolve) => setTimeout(resolve, 50));
		}
	}

	const iterator = {
		turns: loadTurns(),
		total: initialTurns.length,
		done: false,
		addTurn: (turn: Turn) => {
			turnQueue.push(turn);
		},
		complete: () => {
			isComplete = true;
		}
	};

	return iterator;
}
