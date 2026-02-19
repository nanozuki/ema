import type { PageServerLoad } from './$types';
import { parseDepartment } from '$lib/domain/entity';

export const load: PageServerLoad = async ({ params, parent, locals }) => {
  const pd = await parent();
  const { service } = locals;
  const department = parseDepartment(pd.ceremony, params.dept);
  return {
    department,
    noms: await service.getWorksInDept(pd.ceremony.year, department),
  };
};
