<script lang="ts">
  import type { RemoteFormIssue } from '@sveltejs/kit';
  import type { Snippet } from 'svelte';
  import type { HTMLFormAttributes } from 'svelte/elements';

  interface Props extends HTMLFormAttributes {
    title: string;
    description?: string;
    children: Snippet;
    issues?: RemoteFormIssue[];
    pending?: number;
  }

  let { title, description, issues = [], pending = 0, children, ...formProps }: Props = $props();
  const hasError = $derived(issues.length > 0);
</script>

<div class="flex flex-col gap-y-4">
  <div class="flex flex-col gap-y-1">
    <p class="text-xl font-serif font-bold leading-normal" class:text-love={hasError}>{title}</p>
    {#each issues as issue}
      <p class="text-love">{issue.message}</p>
    {:else}
      {#if description}<p class="text-subtle">{description}</p>{/if}
    {/each}
  </div>
  <form class="w-full wide:w-1/2" {...formProps}>
    <div class="flex flex-col gap-y-2">
      {@render children()}
    </div>
    <button
      disabled={pending > 0}
      type="submit"
      class="block w-full h-10 mt-6 px-2 rounded-sm bg-pine text-base disabled:bg-muted">确认</button
    >
  </form>
</div>
