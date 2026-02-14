import type { PageServerLoad } from './$types';
import { parseDepartment } from '$lib/domain/entity.js';

export const load: PageServerLoad = async ({ params, parent }) => {
  const pd = await parent();
  const department = parseDepartment(pd.ceremony, params.dept);
  return {
    department,
    rankedWorks: pd.winnersByDept.get(department)!,
  };
};
