<script lang="ts">
  import { departmentInfo } from '$lib/assets';
  import { Dialog } from 'melt/builders';
  import { TabLine, Nomination } from '$lib/comp';
  import Input from '$lib/comp/Input.svelte';
  import { dataRangeString } from '$lib/domain/entity';
  import * as workRemote from '$lib/remote/work.remote';
  import ChevronLeft from '~icons/material-symbols/chevron-left';
  import ChevronRight from '~icons/material-symbols/chevron-right';
  import { tick } from 'svelte';

  let { data } = $props();
  const postNomination = (workRemote as Record<string, any>).postNomination;
  const searchWorksInBangumi = (workRemote as Record<string, any>).searchWorksInBangumi;
  let deptTotal = $derived(data.ceremony.departments.length);
  let deptIndex = $derived(data.ceremony.departments.indexOf(data.department));
  let deptInfo = $derived(departmentInfo(data.ceremony.year)[data.department]);
  let next = $derived(deptIndex < deptTotal - 1 ? data.ceremony.departments[deptIndex + 1] : null);
  let prev = $derived(deptIndex > 0 ? data.ceremony.departments[deptIndex - 1] : null);
  const dialog = new Dialog();
  let workname = $state('');
  let nominationForm: HTMLFormElement | null = null;
  const bangumiWorks = $derived.by(() =>
    searchWorksInBangumi({ keyword: workname.trim(), department: data.department }),
  );
  const nominateWork = async (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }
    workname = trimmedName;
    postNomination.fields.workName.set(trimmedName);
    await tick();
    nominationForm?.requestSubmit();
  };
</script>

<!-- Title --->

<div class="flex flex-col gap-y-2">
  <a
    href={`/${data.ceremony.year}/nominations/${data.ceremony.departments[0]}`}
    class="text-2xl font-serif font-bold leading-normal"
  >
    {data.ceremony.year}年度<span class="mx-1.5">·</span>作品提名
  </a>
  <p class="text-xs text-muted leading-normal">
    {dataRangeString(data.ceremony.nominationStartAt, data.ceremony.votingStartAt)}
  </p>
  <p class="text-subtle leading-normal">
    提名所有观赏或体验过的、满足范围限定的作品。在提名阶段被提名的作品，将在投票阶段进行最终的投票和排序。提名阶段，可以随时打开这个页面检查和提交。
  </p>
</div>

<!-- Department Introduction --->

<TabLine total={deptTotal} current={deptIndex} />

<div class="flex flex-col gap-y-2">
  <p class="text-xl font-serif font-bold leading-normal">{deptIndex + 1}/{deptTotal}：{deptInfo.title}部门</p>
  <p class="text-subtle leading-normal">{deptInfo.introduction}</p>
  {#if deptInfo.reference.length > 0}
    <p class="text-subtle leading-normal">部分作品参考链接：</p>
    <ul class="list-disc list-inside">
      {#each deptInfo.reference as { description, url } (url)}
        <li>
          <a href={url} target="_blank" rel="noopener noreferrer" class="text-pine ml-1 mr-1 underline">
            {description}
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<!-- Nomination List --->

{#if data.noms.length !== 0}
  <div class="flex flex-col gap-y-2">
    <p class="text-xl font-serif font-bold leading-normal">已获提名的作品：</p>
    {#each data.noms as work (work.id)}
      <Nomination {work} />
    {/each}
  </div>
{/if}

<!-- New Nomination Form --->

<div class="flex flex-col gap-y-2 mid:grid mid:grid-cols-nomination mid:gap-x-2 items-end">
  <button
    {...dialog.trigger}
    class={'w-full h-10 px-2 rounded-sm bg-surface border-pine border-1 ' +
      'focus:border-rose focus-visible:border-rose outline-hidden shadow-none'}
  >
    添加新提名
  </button>
</div>

<div class="bg-muted" {...dialog.overlay}></div>

<dialog {...dialog.content} class="fixed inset-0 m-0 p-6 border-0 w-screen h-screen">
  <Input
    label="作品名称"
    placeholder="作品名称"
    issues={postNomination.fields.workName.issues()}
    required
    name="keyword"
    type="text"
    bind:value={workname}
  />
  <form
    class="flex flex-col gap-y-2 mid:grid mid:grid-cols-nomination mid:gap-x-2 items-end"
    {...postNomination}
  >
    <select {...postNomination.fields.}

  </form>
  {#if workname.trim()}
    <div class="flex flex-col gap-y-2">
      <p class="text-sm text-subtle leading-normal">Bangumi 搜索结果（点击作品即可提名）：</p>
      {#if bangumiWorks.loading}
        <p class="text-xs text-subtle leading-normal">搜索中...</p>
      {:else if bangumiWorks.ready}
        {@const works = bangumiWorks.current.slice(0, 5)}
        {#if works.length === 0}
          <p class="text-xs text-subtle leading-normal">未找到相关作品</p>
        {:else}
          <div class="flex flex-col gap-y-2">
            {#each works as work (work.id)}
              <button
                type="button"
                class="flex flex-col gap-y-1 text-left rounded-sm border border-pine/30 bg-surface px-3 py-2 hover:bg-highlight-med"
                on:click={() => nominateWork(work.name || work.originName)}
                disabled={postNomination.pending > 0}
              >
                <span class="text-text font-bold leading-normal">{work.name || work.originName}</span>
                {#if work.name && work.originName && work.name !== work.originName}
                  <span class="text-xs text-subtle leading-normal">{work.originName}</span>
                {/if}
              </button>
            {/each}
          </div>
        {/if}
      {/if}
    </div>
  {/if}
</dialog>

<!-- Navigation --->

<div class="flex flex-col gap-y-4">
  <div class="flex gap-x-2">
    {#if prev}
      <a
        href={`/${data.ceremony.year}/nominations/${prev}`}
        class="flex gap-y-2 justify-start pl-1 items-center text-pine bg-highlight-med flex-1 rounded-sm"
      >
        <ChevronLeft class="block text-2xl text-rose" />
        <p class="text-text leading-10">上一步</p>
      </a>
    {/if}
    {#if next}
      <a
        href={`/${data.ceremony.year}/nominations/${next}`}
        class="flex gap-y-2 justify-end pr-1 items-center text-pine bg-highlight-med flex-1 rounded-sm"
      >
        <p class="text-text leading-10">下一步</p>
        <ChevronRight class="block text-2xl text-rose" />
      </a>
    {:else}
      <a
        href={`/${data.ceremony.year}/nominations/thanks`}
        class="flex gap-y-2 justify-end pr-1 items-center text-pine bg-highlight-med flex-1 rounded-sm"
      >
        <p class="text-text leading-10">完成</p>
        <ChevronRight class="block text-2xl text-rose" />
      </a>
    {/if}
  </div>
  <TabLine total={deptTotal} current={deptIndex} />
</div>
