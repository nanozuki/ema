<script lang="ts">
  import type { RemoteFormIssue } from '@sveltejs/kit';
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    label: string;
    description?: string;
    error?: string;
    issues?: RemoteFormIssue[];
  }

  let { name, label, description, error, issues, value = $bindable(), ...rest }: Props = $props();
</script>

<div class="flex flex-col">
  <label class="text-text text-sm font-bold leading-normal" for={name}>{label}</label>
  <div class="gap-y-2xs flex w-full flex-col">
    {#if description}<small class="text-subtle text-sm">{description}</small>{/if}
    {#if error}<small class="text-love">{error}</small>{/if}
    {#each issues as issue}
      <small class="text-love">{issue.message}</small>
    {/each}
    <input
      class={'w-full h-10 px-2 rounded-sm bg-surface border-pine border-1 ' +
        'focus:border-rose focus-visible:border-rose outline-hidden shadow-none'}
      {name}
      bind:value
      {...rest}
    />
  </div>
</div>
