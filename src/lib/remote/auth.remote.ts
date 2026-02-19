import { form, getRequestEvent } from '$app/server';
import { invalid } from '@sveltejs/kit';
import { Err } from '$lib/domain/errors';
import { P } from 'ts-pattern';
import * as z from 'zod';
import { redirect } from '@sveltejs/kit';

export const signUp = form(
  z.object({
    username: z.string().min(1, '不能为空'),
    password: z.string().min(8, '长度必须大于8'),
    repeatedPassword: z.string(),
    inviteCode: z.string(),
  }),
  async ({ username, password, repeatedPassword: passwordEnsure, inviteCode }, issue) => {
    if (password !== passwordEnsure) {
      invalid(issue.repeatedPassword('两次输入不一致'));
    }
    const { locals, cookies, url } = getRequestEvent();
    if (!locals.service.isInviteCodeValid(inviteCode)) {
      invalid(issue.inviteCode('邀请码无效'));
    }
    const voter = await locals.service.getUserByName(username);
    if (voter) {
      invalid(issue.username('用户名已存在'));
    }
    return (await Err.match(() => locals.service.signUpVoter(username, password, cookies)))
      .with({ ok: true, value: P._ }, () => {
        if (url.searchParams.has('redirect')) {
          redirect(302, decodeURIComponent(url.searchParams.get('redirect')!));
        }
        redirect(302, '/');
      })
      .with({ ok: false, error: P.select() }, (error) => {
        invalid(error.body.message);
      })
      .exhaustive();
  },
);

export const logIn = form(
  z.object({
    username: z.string().min(1, '不能为空'),
    password: z.string().min(1, '不能为空'),
  }),
  async ({ username, password }) => {
    const { locals, cookies, url } = getRequestEvent();
    return (await Err.match(() => locals.service.logInVoter(username, password, cookies)))
      .with({ ok: true, value: undefined }, () => {
        // invalid(issue.username('用户名或密码错误'), issue.password('用户名或密码错误'));
        invalid('用户名或密码错误');
      })
      .with({ ok: true, value: P.select() }, () => {
        if (url.searchParams.has('redirect')) {
          redirect(302, decodeURIComponent(url.searchParams.get('redirect')!));
        }
        redirect(302, '/');
      })
      .with({ ok: false, error: P.select() }, (error) => {
        invalid(error.body.message);
      })
      .exhaustive();
  },
);
