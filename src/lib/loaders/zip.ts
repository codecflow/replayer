import { ZipReader, BlobReader, TextWriter, BlobWriter, configure } from '@zip.js/zip.js';
import type { Turn, Action, Position, Turns } from '$lib/types/index.js';

configure({
	useWebWorkers: true
});

export function zip(url: string): Turns {
	async function* loadTurns(): AsyncGenerator<Turn> {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch zip: ${response.status} ${response.statusText}`);
		}

		const zipBlob = await response.blob();
		const zipReader = new ZipReader(new BlobReader(zipBlob));
		const entries = await zipReader.getEntries();

		if (entries.length === 0) {
			throw new Error('Zip file is empty');
		}

		const turnsMap = new Map<string, Partial<Turn>>();
		let trajectoryFolder = '';

		for (const entry of entries) {
			const pathParts = entry.filename.split('/');
			if (pathParts.length >= 2 && pathParts[1].startsWith('turn_')) {
				trajectoryFolder = pathParts[0];
				break;
			}
		}

		if (!trajectoryFolder) {
			throw new Error('Could not find valid trajectory folder with turn_XXX subfolders');
		}

		for (const entry of entries) {
			if (entry.directory) continue;

			const pathParts = entry.filename.split('/');
			if (
				pathParts.length < 3 ||
				pathParts[0] !== trajectoryFolder ||
				!pathParts[1].startsWith('turn_')
			) {
				continue;
			}

			const turnName = pathParts[1];
			const fileName = pathParts[pathParts.length - 1];

			if (!turnsMap.has(turnName)) {
				const turnIndex = parseInt(turnName.match(/\d+/)?.[0] || '0');
				turnsMap.set(turnName, {
					id: turnName,
					index: turnIndex,
					actions: []
				});
			}

			const turn = turnsMap.get(turnName)!;

			if (fileName.startsWith('screenshot_') && fileName.endsWith('.png')) {
				const content = await entry.getData!(new BlobWriter());
				turn.screenshot = URL.createObjectURL(content);
			} else if (fileName.endsWith('_agent_response.json')) {
				const jsonText = await entry.getData!(new TextWriter());
				const agentData = parseAgentResponse(jsonText);
				if (agentData.thought) {
					turn.thought = agentData.thought;
				}
				turn.actions = agentData.actions;
			}
		}

		const turns = Array.from(turnsMap.values())
			.filter((turn): turn is Turn => turn.id !== undefined)
			.sort((a, b) => a.index - b.index);

		await zipReader.close();

		for (const turn of turns) {
			yield turn;
		}
	}

	return {
		turns: loadTurns(),
		done: true
	};
}

function parseAgentResponse(jsonText: string): { thought: string | null; actions: Action[] } {
	const result = {
		thought: null as string | null,
		actions: [] as Action[]
	};

	try {
		const jsonData = JSON.parse(jsonText);
		const responseData = jsonData.response || {};
		const textParts: string[] = [];

		if (responseData.content) {
			textParts.push(responseData.content);
		}

		const outputItems = responseData.output || [];
		for (const item of outputItems) {
			if (item.type === 'message') {
				const contentItems = item.content || [];
				for (const contentItem of contentItems) {
					if (contentItem.text) {
						textParts.push(contentItem.text);
					}
				}
			} else if (item.type === 'reasoning') {
				const summaryItems = item.summary || [];
				if (summaryItems.length > 0) {
					for (const summaryItem of summaryItems) {
						if (summaryItem.type === 'summary_text') {
							textParts.push(summaryItem.text);
						}
					}
				} else {
					const reasoningText = item.text || '';
					if (reasoningText) {
						textParts.push(reasoningText);
					}
				}
			} else if (item.type === 'computer_call') {
				const action = item.action || {};
				if (Object.keys(action).length > 0) {
					const convertedAction = convertAction(action);
					if (convertedAction) {
						result.actions.push(convertedAction);
					}
				}
			}
		}

		if (textParts.length > 0) {
			result.thought = textParts.join(' ');
		}
	} catch (error) {
		console.error('Error parsing agent response:', error);
	}

	return result;
}

function convertAction(action: any): Action | null {
	const actionType = action.type || '';

	if (actionType === 'click' && action.x !== undefined && action.y !== undefined) {
		return {
			type: 'click',
			position: [action.x, action.y] as Position,
			timestamp: action.timestamp
		};
	}

	if (
		actionType === 'drag' &&
		action.start_x !== undefined &&
		action.start_y !== undefined &&
		action.end_x !== undefined &&
		action.end_y !== undefined
	) {
		return {
			type: 'drag',
			from: [action.start_x, action.start_y] as Position,
			to: [action.end_x, action.end_y] as Position,
			timestamp: action.timestamp
		};
	}

	if ((actionType === 'type' || actionType === 'input') && action.text) {
		return {
			type: 'type',
			text: action.text,
			timestamp: action.timestamp
		};
	}

	if (actionType === 'scroll') {
		return {
			type: 'scroll',
			direction: action.direction || 'down',
			amount: action.amount,
			timestamp: action.timestamp
		};
	}

	if (actionType === 'key' && action.key) {
		return {
			type: 'key',
			key: action.key,
			modifiers: action.modifiers,
			timestamp: action.timestamp
		};
	}

	return null;
}
