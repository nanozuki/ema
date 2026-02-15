<script lang="ts">
  import type { Snippet } from 'svelte';
  let {
    children,
  }: {
    children: Snippet;
  } = $props();
</script>

<svelte:head>
  <title>Exodus 媒体艺术赏 - 账户</title>
</svelte:head>

<div class="bg-overlay py-8 px-6 -mx-6 mid:mx-0 flex flex-col gap-y-4">
  {@render children()}
</div>
