import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from "firebase/auth";

export const useFirebaseAuth = () => {
  const { $auth } = useNuxtApp();
  const user = useState<User | null>("firebase-user", () => null);
  const isLoading = useState("auth-loading", () => true);

  // 認証状態の監視
  const initAuth = () => {
    onAuthStateChanged($auth, (firebaseUser) => {
      user.value = firebaseUser;
      isLoading.value = false;
    });
  };

  // メールアドレスとパスワードでサインアップ
  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        $auth,
        email,
        password,
      );
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  };

  // メールアドレスとパスワードでサインイン
  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        $auth,
        email,
        password,
      );
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  };

  // Googleでサインイン
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ hd: "corp.snakewolf.com" }); // 会社ドメインを指定
      const result = await signInWithPopup($auth, provider);
      if (result.user.email?.split("@")[1] !== "corp.snakewolf.com") {
        await signOut($auth);
        return {
          user: null,
          error: "会社ドメインのメールアドレスでサインインしてください。",
        };
      } else {
        return { user: result.user, error: null };
      }
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  };

  // サインアウト
  const logout = async () => {
    try {
      await signOut($auth);
      user.value = null;
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  return {
    user,
    isLoading,
    initAuth,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
  };
};
