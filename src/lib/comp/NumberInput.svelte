<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    field: string;
    label: string;
    value: number;
    error: string | undefined;
    focusOnMount?: boolean;
  }

  let { field, label, value = $bindable(), error, focusOnMount = false }: Props = $props();

  let inputRef: HTMLInputElement | undefined = $state();
  $effect(() => {
    if (inputRef && focusOnMount) {
      inputRef.focus();
    }
  });
</script>

<label for={field} class="text-subtle text-sm leading-normal"
  >{label}{#if error}<span class="text-love text-sm mx-1">{error}</span>{/if}</label
>
<input
  type="number"
  bind:value
  bind:this={inputRef}
  name={field}
  placeholder={label}
  class={'w-full h-10 px-2 rounded-sm bg-surface border-pine border-2 ' +
    'focus:border-rose focus-visible:border-rose outline-hidden shadow-none'}
/>
