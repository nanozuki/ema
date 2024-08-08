import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { getLocalService } from '$lib/server';
import type { RequestEvent } from '@sveltejs/kit';

async function getPlatform(event: RequestEvent): Promise<App.Platform> {
  if (dev) {
    const { getPlatformProxy } = await import('wrangler');
    const platform: unknown = await getPlatformProxy();
    return platform as App.Platform;
  }
  if (!event.platform) {
    throw new Error('Platform not found');
  }
  return event.platform;
}

export const handle: Handle = async ({ event, resolve }) => {
  const platform = await getPlatform(event);
  const service = getLocalService(platform);
  event.locals = { service };
  return resolve(event);
};
