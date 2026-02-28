import { form, getRequestEvent } from '$app/server';
import { Err } from '$lib/domain/errors';
import { Department } from '$lib/domain/value';
import * as z from 'zod';

const getVoteSchema = z.object({
  year: z.number().int(),
  department: z.enum(Department),
});

export const getVote = form(getVoteSchema, async ({ year, department }) => {
  const { locals, cookies } = getRequestEvent();
  const { service } = locals;
  const voter = await service.getVoterToken(cookies);
  if (!voter) {
    throw Err.Unauthorized();
  }
  return await service.getVote(year, department, voter);
});

const voteSchema = z.object({
  year: z.number().int(),
  department: z.enum(Department),
  works: z.record(z.number().int().min(1, 'WorkID 不能为空'), z.number().int().min(1, '排名必须是大于0的数字')),
});

export const vote = form(voteSchema, async ({ year, department, works }) => {
  const { locals, cookies } = getRequestEvent();
  const { service } = locals;
  const worksMap = new Map(Object.entries(works).map(([key, value]) => [Number(key), value]));
  await service.setVote(cookies, year, department, worksMap);
});
