import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
  const { service } = locals;
  const [ceremonies, voter, invited] = await Promise.all([
    service.getCeremonies(),
    service.getVoterToken(cookies),
    service.getInvitedToken(cookies),
  ]);
  return {
    now: new Date(),
    ceremonies,
    voter,
    invited,
  };
};
