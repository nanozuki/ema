<script lang="ts">
  interface Props {
    field: string;
    label: string;
    value?: string;
    error: string | undefined;
    required?: boolean;
  }

  let {
    field,
    label,
    value = $bindable(''),
    error,
    required = false
  }: Props = $props();
</script>

<div class="w-full flex flex-col gap-y-1">
  <label for={field} class="text-subtle text-sm leading-normal"
    >{label}{#if error}<span class="text-love text-sm">{error}</span>{/if}</label
  >
  <input
    type="text"
    bind:value
    name={field}
    placeholder={label}
    {required}
    class={'w-full h-10 px-2 rounded-sm bg-surface border-pine border-2 ' +
      'focus:border-rose focus-visible:border-rose outline-hidden shadow-none'}
  />
</div>
