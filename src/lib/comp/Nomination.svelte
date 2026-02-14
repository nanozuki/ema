<script lang="ts">
  import { subNamesOfWork, type Work } from '$lib/domain/entity';
  interface Props {
    work: Work;
  }

  let { work }: Props = $props();
</script>

<div class="flex flex-col items-start px-4 py-2 bg-overlay rounded-sm">
  <p class="flex-1 font-serif text-2xl">{work.name}</p>
  {#each subNamesOfWork(work) as name (name)}
    <p class="text-subtle">{name}</p>
  {/each}
</div>
