export async function load({ locals }) {
  const { service } = locals;
  return {
    bestWorks: await service.getBestWorks(),
  };
}
