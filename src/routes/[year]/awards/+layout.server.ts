import type { LayoutServerLoad } from './$types';
import { ensureStage } from '$lib/domain/entity';
import { Stage } from '$lib/domain/value.js';

export const load: LayoutServerLoad = async ({ parent, locals }) => {
  const { service } = locals;
  const pd = await parent();
  ensureStage(pd.ceremony, Stage.Award, pd.now);
  return {
    winnersByDept: await service.getWinningWorks(pd.ceremony.year),
  };
};
