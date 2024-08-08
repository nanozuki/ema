import { ensureStage } from '$lib/domain/entity';
import { Stage } from '$lib/domain/value.js';

export async function load({ parent, locals }) {
  const { service } = locals;
  const pd = await parent();
  ensureStage(pd.ceremony, Stage.Award, pd.now);
  return {
    winnersByDept: await service.getWinningWorks(pd.ceremony.year),
  };
}
