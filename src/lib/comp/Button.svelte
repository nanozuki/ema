<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type Variant = 'primary' | 'secondary' | 'negative' | 'disable';
  interface Props extends HTMLButtonAttributes {
    variant?: Variant;
    type?: 'submit' | 'button';
    children?: import('svelte').Snippet;
  }

  let { variant = 'primary', type = 'button', children, ...rest }: Props = $props();
</script>

<button
  class="w-full h-10 px-8 rounded-sm text-base"
  class:bg-pine={variant === 'primary'}
  class:bg-love={variant === 'secondary'}
  class:bg-gold={variant === 'negative'}
  class:bg-muted={variant === 'disable'}
  disabled={variant === 'disable'}
  {type}
  {...rest}
>
  {@render children?.()}
</button>
