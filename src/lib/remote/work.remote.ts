import { form, getRequestEvent, query } from '$app/server';
import { invalid } from '@sveltejs/kit';
import { Department } from '$lib/domain/value';
import { Err } from '$lib/domain/errors';
import { searchBangumiSubjects } from '$lib/server/bangumi';
import { P } from 'ts-pattern';
import z from 'zod';

export const searchWorksInBangumi = query(
  z.object({
    keyword: z.string(),
    department: z.enum(Department),
  }),
  async ({ keyword, department }) => {
    if (!keyword) {
      return [];
    }
    const works = await searchBangumiSubjects(keyword, department);
    console.log('searchWorksInBangumi', { keyword, department, works });
    return works;
  },
);

export const nominateWithBangumiId = form(
  z.object({
    bangumiId: z.string().min(1),
  }),
  async ({ bangumiId }, issue) => {
    const { locals, params } = getRequestEvent();
    const { year, dept } = params;
    if (!year || !dept) {
      invalid('参数无效');
    }
    const bangumiIdNum = parseInt(bangumiId);
    if (isNaN(bangumiIdNum)) {
      invalid(issue.bangumiId('必须是数字'));
    }
    return (await Err.match(() => locals.service.addNominationByBangumiId(year, dept, bangumiIdNum)))
      .with({ ok: true, value: P._ }, () => {})
      .with({ ok: false, error: P.select() }, (error) => {
        invalid(issue.bangumiId(error.body.message));
      })
      .exhaustive();
  },
);

export const nominateByWorkName = form(
  z.object({ workName: z.string().min(1, '不能为空') }),
  async ({ workName }, issue) => {
    const { locals, params } = getRequestEvent();
    const { year, dept } = params;
    if (!year || !dept) {
      invalid('参数无效');
    }
    return (await Err.match(() => locals.service.addNominationByWorkName(year, dept, workName)))
      .with({ ok: true, value: P._ }, () => {})
      .with({ ok: false, error: P.select() }, (error) => {
        invalid(issue.workName(error.body.message));
      })
      .exhaustive();
  },
);
