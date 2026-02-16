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
    return works;
  },
);

export const postNomination = form(
  z.object({
    department: z.enum(Department),
    workName: z.string().min(1, '不能为空'),
    bangumiId: z.number().optional(),
  }),
  async ({ bangumiId, workName }, issue) => {
    const { locals, params } = getRequestEvent();
    const { year, dept } = params;
    if (!year || !dept) {
      invalid('参数无效');
    }
    return (await Err.match(() => locals.service.addNomination(year, dept, workName, bangumiId)))
      .with({ ok: true, value: P._ }, () => {})
      .with({ ok: false, error: P.select() }, (error) => {
        invalid(issue.workName(error.body.message));
      })
      .exhaustive();
  },
);
