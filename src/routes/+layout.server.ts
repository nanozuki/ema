export async function load({ cookies, locals }) {
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
}
