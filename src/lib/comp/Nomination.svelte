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
  {#if work.bangumiId || work.youtubeId}
    <div class="flex items-center justify-start gap-x-2">
      {#if work.bangumiId}
        <a href={`https://bgm.tv/subject/${work.bangumiId}`} target="_blank" class="text-pine text-sm underline">
          Bangumi
        </a>
      {/if}
      {#if work.youtubeId}
        <a
          href={`https://www.youtube.com/watch?v=${work.youtubeId}`}
          target="_blank"
          class="text-pine text-sm underline"
        >
          YouTube
        </a>
      {/if}
    </div>
  {/if}
</div>
