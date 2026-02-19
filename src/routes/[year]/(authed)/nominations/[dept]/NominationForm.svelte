<script lang="ts">
  import Button from '$lib/comp/Button.svelte';
  import Input from '$lib/comp/Input.svelte';
  import type { Department } from '$lib/domain/value';
  import { nominateByWorkName, nominateWithBangumiId, searchWorksInBangumi } from '$lib/remote/work.remote.js';
  import { Dialog } from 'melt/builders';
  import { resource } from 'runed';
  import MdiClose from '~icons/mdi/close';

  type Props = {
    label: string;
    department: Department;
  };
  const { department, label }: Props = $props();
  const dialog = new Dialog();
  let keyword = $state('');
  const searchResource = resource(
    () => keyword.trim(),
    async (keyword) => {
      if (!keyword) return [];
      const works = await searchWorksInBangumi({ keyword, department });
      return works;
    },
    { debounce: 500 },
  );
</script>

<div class="flex flex-col gap-y-2 mid:grid mid:grid-cols-nomination mid:gap-x-2 items-end">
  <Button {...dialog.trigger}>添加新提名</Button>
</div>

<div class="bg-muted" {...dialog.overlay}></div>

<dialog
  {...dialog.content}
  class="flex flex-col gap-y-4 fixed inset-0 px-6 py-4 border-0 w-screen h-screen max-w-160 m-auto max-h-none bg-surface"
>
  <button
    onclick={() => {
      dialog.open = false;
    }}
    class="rounded-sm text-text flex justify-start items-center gap-x-4"
  >
    <MdiClose />
    <span class="font-serif font-bold">{label}</span>
  </button>
  <Input placeholder="作品名称" required name="keyword" type="text" bind:value={keyword} />
  <div class="flex flex-col gap-y-2">
    <div class="flex flex-col gap-y-2">
      {#if keyword}
        {#if searchResource.loading}
          <p class="text-sm font-bold text-pine leading-normal">搜索中...</p>
        {:else if searchResource.error}
          <p class="text-sm text-rose leading-normal">搜索失败，请稍后再试</p>
        {:else}
          <p class="text-sm font-bold text-text leading-normal">搜索结果（点击作品即可提名）：</p>
        {/if}
        {#each searchResource.current ?? [] as work (work.bangumiId)}
          {@const form = nominateWithBangumiId.for(work.bangumiId)}
          <form
            class="w-full"
            {...form.enhance(async ({ form, submit }) => {
              await submit();
              form.reset();
              dialog.open = false;
            })}
          >
            <input type="hidden" name="bangumiId" value={work.bangumiId} />
            {#each form.fields.allIssues() as issue}
              <p class="text-sm text-rose">{issue.message}</p>
            {/each}
            <button
              type="submit"
              class="w-full bg-overlay text-left px-3 py-2 hover:bg-highlight-med flex"
              disabled={form.pending > 0}
            >
              {#if work.image}
                <img src={work.image} alt={work.name} class="w-20 object-contain rounded-sm mr-3" />
              {/if}
              <div>
                <p>
                  <span class="text-text font-bold font-serif leading-normal">{work.name || work.originName}</span>
                  {#if work.name && work.originName && work.name !== work.originName}
                    <span class="ml-1 text-xs text-subtle leading-normal">{work.originName}</span>
                  {/if}
                </p>
                <p>
                  {#if work.date}<span class="text-text text-sm mr-1">{work.date}</span>{/if}
                  {#each work.tags as tag (tag)}
                    <span class="mr-1 text-xs text-subtle leading-normal bg-surface px-1 text-nowrap">{tag}</span>
                  {/each}
                </p>
              </div>
            </button>
          </form>
        {/each}
        <form
          {...nominateByWorkName.enhance(async ({ form, submit }) => {
            await submit();
            form.reset();
            dialog.open = false;
          })}
        >
          <input type="hidden" name="workName" value={keyword} />
          <button
            type="submit"
            disabled={searchResource.loading || nominateByWorkName.pending > 0}
            class="bg-surface border-1 border-highlight-med w-full h-10 px-8 rounded-sm text-text sticky"
            >没有找到？直接添加</button
          >
        </form>
      {/if}
    </div>
  </div>
</dialog>
