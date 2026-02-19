import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ parent, url }) => {
  const pd = await parent();
  if (!pd.voter) {
    // not logged in
    redirect(302, `/auth/sign_up?redirect=${encodeURIComponent(url.pathname)}`);
  }
  return { voter: pd.voter }; // covert { voter?: Voter } to { voter: Voter };
};
