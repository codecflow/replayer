<script lang="ts">
	import { onMount } from 'svelte';
	import Replayer from '$lib/components/Replayer.svelte';
	import { agent } from '$lib/loaders/index.js';
	import type { Turn } from '$lib/types/index.js';

	let agentIterator = $state<ReturnType<typeof agent> | null>(null);
	let turnCount = $state(0);
	let userInput = $state('');
	let isProcessing = $state(false);

	onMount(() => {
		const initialTurns: Turn[] = [
			{
				type: 'assistant',
				id: 'turn_0',
				index: 0,
				timestamp: Date.now() - 5000,
				thought: 'Starting the demo...',
				actions: [
					{
						type: 'click',
						position: [100, 100],
						timestamp: Date.now() - 5000
					}
				]
			},
			{
				type: 'assistant',
				id: 'turn_1',
				index: 1,
				timestamp: Date.now() - 3000,
				thought: 'Clicking on a button',
				actions: [
					{
						type: 'click',
						position: [200, 150],
						timestamp: Date.now() - 3000
					}
				]
			}
		];

		agentIterator = agent(initialTurns);
		turnCount = initialTurns.length;
	});

	const addNewTurn = () => {
		if (!agentIterator) return;

		const newTurn: Turn = {
			type: 'assistant',
			id: `turn_${turnCount}`,
			index: turnCount,
			timestamp: Date.now(),
			thought: `Dynamic turn ${turnCount + 1} - User added this turn`,
			actions: [
				{
					type: 'type',
					text: `Hello from turn ${turnCount + 1}!`,
					timestamp: Date.now()
				}
			]
		};

		agentIterator.addTurn(newTurn);
		turnCount++;
	};

	const simulateAgentResponse = () => {
		if (!agentIterator) return;

		for (let i = 0; i < 3; i++) {
			setTimeout(() => {
				const newTurn: Turn = {
					type: 'assistant',
					id: `turn_${turnCount}`,
					index: turnCount,
					timestamp: Date.now(),
					thought: `Agent response ${i + 1}/3 - Processing your request...`,
					actions: [
						{
							type: 'scroll',
							direction: 'down',
							amount: 100,
							timestamp: Date.now()
						}
					]
				};

				agentIterator!.addTurn(newTurn);
				turnCount++;
			}, i * 500);
		}
	};

	const handleUserPrompt = async () => {
		if (!agentIterator || !userInput.trim() || isProcessing) return;

		const prompt = userInput.trim();
		userInput = '';
		isProcessing = true;

		try {
			const userTurn: Turn = {
				type: 'user',
				id: `turn_${turnCount}`,
				index: turnCount,
				timestamp: Date.now(),
				thought: `User prompt: "${prompt}"`,
				actions: [
					{
						type: 'type',
						text: prompt,
						timestamp: Date.now()
					}
				]
			};

			agentIterator.addTurn(userTurn);
			turnCount++;

			const responses = generateAgentResponse(prompt);

			for (let i = 0; i < responses.length; i++) {
				setTimeout(
					() => {
						const agentTurn: Turn = {
							type: 'assistant',
							id: `turn_${turnCount}`,
							index: turnCount,
							timestamp: Date.now(),
							thought: responses[i].thought,
							actions: responses[i].actions
						};

						agentIterator!.addTurn(agentTurn);
						turnCount++;

						if (i === responses.length - 1) {
							isProcessing = false;
						}
					},
					(i + 1) * 800
				);
			}
		} catch (error) {
			console.error('Error processing user prompt:', error);
			isProcessing = false;
		}
	};

	const generateAgentResponse = (
		prompt: string
	): Array<{ thought: string; actions: Turn['actions'] }> => {
		const responses = [];

		if (prompt.toLowerCase().includes('click')) {
			responses.push({
				thought: `I'll help you click on something. Let me find the right element...`,
				actions: [
					{
						type: 'click' as const,
						position: [Math.random() * 400 + 100, Math.random() * 300 + 100] as [number, number],
						timestamp: Date.now()
					}
				]
			});
		} else if (prompt.toLowerCase().includes('type') || prompt.toLowerCase().includes('write')) {
			responses.push({
				thought: `I'll type the text you requested...`,
				actions: [
					{
						type: 'type' as const,
						text: `Typing response to: ${prompt}`,
						timestamp: Date.now()
					}
				]
			});
		} else if (prompt.toLowerCase().includes('scroll')) {
			responses.push({
				thought: `I'll scroll the page as requested...`,
				actions: [
					{
						type: 'scroll' as const,
						direction: 'down' as const,
						amount: 200,
						timestamp: Date.now()
					}
				]
			});
		} else {
			responses.push(
				{
					thought: `Analyzing your request: "${prompt}"`,
					actions: [
						{
							type: 'click' as const,
							position: [150, 200] as [number, number],
							timestamp: Date.now()
						}
					]
				},
				{
					thought: `Processing the task step by step...`,
					actions: [
						{
							type: 'type' as const,
							text: `Working on: ${prompt}`,
							timestamp: Date.now()
						}
					]
				},
				{
					thought: `Task completed successfully!`,
					actions: [
						{
							type: 'scroll' as const,
							direction: 'up' as const,
							amount: 100,
							timestamp: Date.now()
						}
					]
				}
			);
		}

		return responses;
	};

	const handleKeyPress = (event: KeyboardEvent) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleUserPrompt();
		}
	};
</script>

<svelte:head>
	<title>Dynamic Streaming Demo - CodecFlow Replayer</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<div class="container mx-auto p-4">
		<div class="mb-6">
			<h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Dynamic Streaming Demo</h1>
			<p class="text-gray-600 dark:text-gray-400">
				This demo shows how to add turns dynamically to a live replay timeline.
			</p>
		</div>

		<div class="mb-6 space-y-4">
			<!-- User Input Section -->
			<div class="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
				<h3 class="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Chat with Agent</h3>
				<div class="flex gap-2">
					<input
						bind:value={userInput}
						onkeypress={handleKeyPress}
						placeholder="Type a prompt for the agent (e.g., 'click on the button', 'scroll down', 'type hello world')..."
						disabled={isProcessing}
						class="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2
                   text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2
                   focus:ring-blue-500 focus:outline-none
                   disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700
                   dark:text-white dark:placeholder-gray-400"
					/>
					<button
						onclick={handleUserPrompt}
						disabled={!userInput.trim() || isProcessing}
						class="flex items-center gap-2 rounded bg-purple-500 px-4
                   py-2 text-white transition-colors
                   hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isProcessing}
							<div
								class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
							></div>
							Processing...
						{:else}
							Send
						{/if}
					</button>
				</div>
				<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
					Try prompts like: "click on something", "type hello", "scroll down", or any other
					instruction
				</p>
			</div>

			<!-- Manual Controls -->
			<div class="flex gap-4">
				<button
					onclick={addNewTurn}
					class="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
				>
					Add Single Turn
				</button>

				<button
					onclick={simulateAgentResponse}
					class="rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
				>
					Simulate Agent Response (3 turns)
				</button>
			</div>
		</div>

		<div class="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
			<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Replay Timeline</h2>

			<div class="h-96">
				{#if agentIterator}
					<Replayer iterator={agentIterator} />
				{:else}
					<div class="flex h-full items-center justify-center text-gray-500">Loading demo...</div>
				{/if}
			</div>
		</div>

		<div class="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
			<h3 class="mb-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
				Features Demonstrated:
			</h3>
			<ul class="list-inside list-disc space-y-1 text-blue-800 dark:text-blue-200">
				<li>Dynamic turn addition using async iterators</li>
				<li>Auto-scroll to latest turns when added</li>
				<li>Progressive turn counter (shows "X of Y+" while loading)</li>
				<li>"Jump to Latest" button when user scrolls away</li>
				<li>Reactive timeline updates without full reloads</li>
				<li>Support for both single turns and batch additions</li>
			</ul>
		</div>

		<div class="mt-6 text-center">
			<a
				href="/zip"
				class="inline-flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
			>
				← Try ZIP File Demo
			</a>
		</div>
	</div>
</div>
