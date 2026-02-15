<script lang="ts">
  import Input from '$lib/comp/Input.svelte';
  import { signUp } from '$lib/remote/auth.remote';
  import AuthForm from '../AuthForm.svelte';
  import { page } from '$app/state';

  const inviteCodeFromUrl = $derived(page.url.searchParams.get('inviteCode') ?? '');
  const loginUrl = $derived.by(() => {
    const url = new URL(page.url);
    url.pathname = '/auth/login';
    return url.toString();
  });

  $effect(() => {
    if (!inviteCodeFromUrl || signUp.fields.inviteCode.value()) {
      return;
    }
    signUp.fields.inviteCode.set(inviteCodeFromUrl);
    const clearedUrl = new URL(page.url);
    clearedUrl.searchParams.delete('inviteCode');
    history.replaceState({}, '', `${clearedUrl.pathname}${clearedUrl.search}${clearedUrl.hash}`);
  });
</script>

<AuthForm {...signUp} title="注册" issues={signUp.fields.issues()} pending={signUp.pending}>
  <Input
    label="用户名*"
    description="请使用telegram的ID或者用户名"
    issues={signUp.fields.username.issues()}
    {...signUp.fields.username.as('text')}
  />
  <Input
    label="密码*"
    description="至少8位"
    issues={signUp.fields.password.issues()}
    {...signUp.fields.password.as('password')}
  />
  <Input
    label="确认密码*"
    issues={signUp.fields.repeatedPassword.issues()}
    {...signUp.fields.repeatedPassword.as('password')}
  />
  <Input
    label="邀请码*"
    description="请从邀请链接进入或检查活动发布信息"
    issues={signUp.fields.inviteCode.issues()}
    {...signUp.fields.inviteCode.as('text')}
  />
</AuthForm>
<p>已有账户？<a href={loginUrl} class="text-pine">登录</a></p>
