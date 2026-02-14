<script lang="ts">
  import { StringInput, PasswordInput } from '$lib/comp';
  import AuthForm from '../AuthForm.svelte';

  let { data, form } = $props();

  const title = '登录';
  const description = '用户已存在，请输入密码登录。';

  let username = $derived(data?.username || form?.username);
  let focusOnMount = $derived(typeof username !== 'undefined');
</script>

<AuthForm {title} {description} hasError={typeof form?.errors !== 'undefined'}>
  <StringInput field="username" label="用户名" value={username} error={form?.errors?.username} />
  <PasswordInput {focusOnMount} field="password" label="密码" error={form?.errors?.password} />
</AuthForm>
