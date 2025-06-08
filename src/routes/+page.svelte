<svelte:head>
	<title>CodecFlow Replayer - Demos</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<div class="container mx-auto p-4">
		<div class="mb-8 text-center">
			<h1 class="mb-4 text-4xl font-bold text-gray-900 dark:text-white">CodecFlow Replayer</h1>
			<p class="text-lg text-gray-600 dark:text-gray-400">
				A Svelte component library for replaying agent interactions with timeline controls.
			</p>
			<div class="mt-4 inline-block rounded-lg bg-yellow-50 px-4 py-2 dark:bg-yellow-900/20">
				<p class="text-sm text-yellow-800 dark:text-yellow-200">
					⚠️ This project is actively being developed and the API may change.
				</p>
			</div>
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			<!-- ZIP Demo Card -->
			<div class="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
				<h2 class="mb-3 text-2xl font-semibold text-gray-900 dark:text-white">ZIP File Demo</h2>
				<p class="mb-4 text-gray-600 dark:text-gray-400">
					Load and replay pre-recorded agent interactions from a ZIP file.
				</p>
				<div class="mb-4">
					<h3 class="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Features:</h3>
					<ul class="list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
						<li>Static timeline with pre-recorded turns</li>
						<li>Timeline controls (play, pause, speed)</li>
						<li>Screenshot display with cursor overlay</li>
						<li>Action visualization</li>
					</ul>
				</div>
				<a
					href="/zip"
					class="inline-flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
				>
					Try ZIP Demo →
				</a>
			</div>

			<!-- Dynamic Demo Card -->
			<div class="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
				<h2 class="mb-3 text-2xl font-semibold text-gray-900 dark:text-white">Dynamic Streaming Demo</h2>
				<p class="mb-4 text-gray-600 dark:text-gray-400">
					Add turns dynamically to a live replay timeline with real-time updates.
				</p>
				<div class="mb-4">
					<h3 class="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Features:</h3>
					<ul class="list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
						<li>Dynamic turn addition using async iterators</li>
						<li>Interactive chat interface</li>
						<li>Auto-scroll to latest turns</li>
						<li>Real-time timeline updates</li>
					</ul>
				</div>
				<a
					href="/dynamic"
					class="inline-flex items-center gap-2 rounded bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600"
				>
					Try Dynamic Demo →
				</a>
			</div>
		</div>

		<div class="mt-8 text-center">
			<div class="rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
				<h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Getting Started</h3>
				<p class="mb-4 text-gray-600 dark:text-gray-400">
					Install the library and start building your own replay experiences.
				</p>
				<code class="rounded bg-gray-200 px-3 py-1 text-sm dark:bg-gray-700">
					npm install @codecflow/replayer
				</code>
			</div>
		</div>
	</div>
</div>
