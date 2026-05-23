export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useFirebaseAuth();

  // 未認証の場合はログインページへリダイレクト
  if (!user.value) {
    return navigateTo("/");
  }
});
