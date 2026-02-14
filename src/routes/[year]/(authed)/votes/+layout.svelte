<script lang="ts">
  let { data, children } = $props();
  let title = $derived(`Exodus 媒体艺术赏 - ${data.ceremony.year}年 - 投票`);
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

{@render children?.()}
