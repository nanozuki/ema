import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const { service } = locals;
  return {
    bestWorks: await service.getBestWorks(),
  };
};
