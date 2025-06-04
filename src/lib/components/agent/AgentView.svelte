<script lang="ts">
  import TimelineView from "../timeline/TimelineView.svelte";
  import ScreenshotView from "../screenshot/ScreenshotView.svelte";

  let screenDimensions = { width: 1024, height: 768 };
</script>

<div class="flex w-full flex-col">
  <ScreenshotView {screenDimensions} />
  <TimelineView />
</div>
