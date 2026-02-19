import { Err } from '$lib/domain/errors.js';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const InviteKey = env.EMA_INVITE_KEY;

export const load: PageServerLoad = async ({ parent, cookies, url, locals }) => {
  const inviteKey = url.searchParams.get('key');
  if (inviteKey !== InviteKey) {
    throw Err.Invalid('invite key', inviteKey);
  }
  const { service } = locals;
  const parentData = await parent();
  await service.setInvitedToken(cookies, parentData.now);
  if (url.searchParams.has('redirect')) {
    redirect(302, `/auth/sign_up?redirect=${encodeURIComponent(url.pathname)}`);
  }
  redirect(302, '/auth/sign_up');
};
