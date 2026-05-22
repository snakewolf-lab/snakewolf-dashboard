<script setup lang="ts">
definePageMeta({
  layout: 'system'
})

const { signIn, signInWithGoogle } = useFirebaseAuth();
const router = useRouter();

const toast = useToast()

const providers = [{
  label: 'Google',
  icon: 'i-simple-icons-google',
  onClick: async () => {
    toast.add({ title: 'Google', description: 'Googleでログイン' })
    const { user, error: signInError } = await signInWithGoogle();

    if (signInError) {
      toast.add({ title: 'エラー', description: getErrorMessage(signInError), color: 'error' });
    } else if (user) {
      await router.push('/dash');
    }
  }
}, {
  label: 'ヘルプ',
  icon: 'i-lucide-help-circle', // v3/Lucideの一般的な表記に調整（環境に合わせて変更してください）
  onClick: () => {
    toast.add({ title: 'ヘルプ', description: 'ログインに関するヘルプを表示' })
  }
}]

// エラーメッセージを日本語化
const getErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'メールアドレスの形式が正しくありません',
    'auth/user-disabled': 'このアカウントは無効化されています',
    'auth/user-not-found': 'メールアドレスまたはパスワードが間違っています',
    'auth/wrong-password': 'メールアドレスまたはパスワードが間違っています',
    'auth/too-many-requests': 'ログイン試行回数が多すぎます。しばらく待ってから再度お試しください',
  };

  return errorMessages[errorCode] || 'ログインに失敗しました';
};
</script>

<template>
  <!-- 画面全体をFlex縦並びにして、最小高さを画面100%にする -->
  <div class="flex flex-col min-h-screen bg-background">
    <!-- flex-grow (flex-1) で残りの縦幅をすべて埋め、フォームを画面の上下左右中央に配置 -->
    <main class="flex-1 flex flex-col items-center justify-center gap-4 p-4">
      <UPageCard class="w-full max-w-md">
        <UAuthForm title="ログイン" description="組織アカウントが必要です" icon="i-lucide-building-2" :providers="providers" />
      </UPageCard>
    </main>
  </div>
</template>