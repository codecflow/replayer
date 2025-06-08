<script lang="ts">
	import '$lib/styles/app.css';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(async () => {
		const response = await fetch('/icons.svg');
		const svgText = await response.text();
		const div = document.createElement('div');
		div.innerHTML = svgText;
		document.body.appendChild(div);
	});
</script>

{@render children()}
