import { Err } from '$lib/domain/errors.js';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';

export const load = async ({ parent, cookies, url, locals }) => {
  const inviteKey = url.searchParams.get('key');
  console.log('invite key:', inviteKey, 'EMA_INVITE_KEY:', env.EMA_INVITE_KEY);
  if (inviteKey !== env.EMA_INVITE_KEY) {
    throw Err.Invalid('invite key', inviteKey);
  }
  const { service } = locals;
  const parentData = await parent();
  await service.setInvitedToken(cookies, parentData.now);
  if (url.searchParams.has('redirect')) {
    redirect(302, decodeURIComponent(url.searchParams.get('redirect')!));
  }
  redirect(302, '/');
};
