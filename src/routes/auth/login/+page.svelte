<script lang="ts">
  import Input from '$lib/comp/Input.svelte';
  import { logIn } from '$lib/remote/auth.remote';
  import AuthForm from '../AuthForm.svelte';
  import { page } from '$app/state';

  const signUpUrl = $derived.by(() => {
    const url = new URL(page.url);
    url.pathname = '/auth/sign_up';
    return url.toString();
  });
</script>

<AuthForm {...logIn} title="登录" issues={logIn.fields.issues()} pending={logIn.pending}>
  <Input label="用户名" issues={logIn.fields.username.issues()} {...logIn.fields.username.as('text')} />
  <Input label="密码" issues={logIn.fields.password.issues()} {...logIn.fields.password.as('password')} />
</AuthForm>
<p>没有账户？<a href={signUpUrl} class="text-pine">注册</a></p>
