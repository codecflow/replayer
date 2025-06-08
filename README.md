# CodecFlow Replayer

> [!WARNING]
> This project is actively being developed and the API may change.

A Svelte component for replaying agent interactions with timeline controls.

## Installation

```bash
npm install @codecflow/replayer
```

## Usage

```svelte
<script>
  import { Replayer, zip } from '@codecflow/replayer';
  import { onMount } from 'svelte';

  let iterator = $state(null);

  onMount(() => {
    iterator = zip('/demo.zip');
  });
</script>

{#if iterator}
  <Replayer {iterator} />
{/if}
```

## Development

```bash
npm install
npm run dev
```

## Demo

- `/zip` - Load from ZIP file
- `/dynamic` - Dynamic turn streaming
