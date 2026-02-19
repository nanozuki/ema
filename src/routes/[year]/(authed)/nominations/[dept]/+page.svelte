<script lang="ts">
  import { departmentInfo } from '$lib/assets';
  import { Nomination, TabLine } from '$lib/comp';
  import { dataRangeString } from '$lib/domain/entity';
  import ChevronLeft from '~icons/material-symbols/chevron-left';
  import ChevronRight from '~icons/material-symbols/chevron-right';
  import NominationForm from './NominationForm.svelte';

  let { data } = $props();
  let deptTotal = $derived(data.ceremony.departments.length);
  let deptIndex = $derived(data.ceremony.departments.indexOf(data.department));
  let deptInfo = $derived(departmentInfo(data.ceremony.year)[data.department]);
  let next = $derived(deptIndex < deptTotal - 1 ? data.ceremony.departments[deptIndex + 1] : null);
  let prev = $derived(deptIndex > 0 ? data.ceremony.departments[deptIndex - 1] : null);

  let nominatedNames = $derived.by(() => {
    const set = new Set<string>();
    for (const nom of data.noms) {
      if (nom.name) {
        set.add(nom.name);
      }
    }
    return set;
  });
  $effect(() => {
    console.log(nominatedNames);
  });
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

<div class="flex flex-col gap-y-4">
  {#if data.noms.length !== 0}
    <div class="flex flex-col gap-y-2">
      <p class="text-xl font-serif font-bold leading-normal">已获提名的作品：</p>
      {#each data.noms as work (work.id)}
        <Nomination {work} />
      {/each}
    </div>
  {/if}

  <NominationForm department={data.department} label={`在Bangumi中搜索${deptInfo.title}`} {nominatedNames} />
</div>

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
