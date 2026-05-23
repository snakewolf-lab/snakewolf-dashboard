import {
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from "firebase/auth";

// 💡 設定：操作がない場合に自動ログアウトする時間（例：30分 = 30 * 60 * 1000）
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

export const useFirebaseAuth = () => {
  const { $auth } = useNuxtApp();

  // 状態の一元管理（SSRでの初期ブレを防ぐため、Cookieと連動させる準備）
  const user = useState<User | null>("firebase-user", () => null);
  const isAuthInitialized = useState<boolean>(
    "firebase-auth-initialized",
    () => false,
  );

  // タイマー管理用の参照（クライアントサイドのみで保持）
  let inactivityTimer: NodeJS.Timeout | null = null;

  // 💡 操作検知：タイマーをリセットして再始動
  const resetInactivityTimer = () => {
    if (import.meta.server) return;

    // 既存のタイマーをクリア
    if (inactivityTimer) clearTimeout(inactivityTimer);

    // 新しいタイマーを設定
    inactivityTimer = setTimeout(async () => {
      console.log("一定時間操作がなかったため、自動ログアウトします。");
      await logout();
      // 必要であれば、ここでログイン画面への強制遷移などを入れる
      // useNavigate().push('/login')
    }, INACTIVITY_TIMEOUT);
  };

  // 💡 操作検知：イベントリスナーの開始
  const startInactivityMonitoring = () => {
    if (import.meta.server) return;

    const events = ["mousemove", "keydown", "click", "touchstart", "scroll"];
    events.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    // 初回起動
    resetInactivityTimer();
  };

  // 💡 操作検知：イベントリスナーの解除
  const stopInactivityMonitoring = () => {
    if (import.meta.server) return;

    if (inactivityTimer) clearTimeout(inactivityTimer);

    const events = ["mousemove", "keydown", "click", "touchstart", "scroll"];
    events.forEach((event) => {
      window.removeEventListener(event, resetInactivityTimer);
    });
  };

  // 認証状態の監視
  const initAuth = () => {
    if (import.meta.server) return;
    if (isAuthInitialized.value) return;

    isAuthInitialized.value = true;

    onAuthStateChanged($auth, async (firebaseUser) => {
      // 1. ドメイン不正チェック
      if (
        firebaseUser &&
        firebaseUser.email?.split("@")[1] !== "corp.snakewolf.com"
      ) {
        await signOut($auth);
        user.value = null;
        stopInactivityMonitoring();
        return;
      }

      user.value = firebaseUser;

      // 2. 💡 ログイン状態に応じて操作監視をON/OFF
      if (firebaseUser) {
        startInactivityMonitoring();
      } else {
        stopInactivityMonitoring();
      }
    });
  };

  // Googleでサインイン
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ hd: "corp.snakewolf.com" });

      const result = await signInWithPopup($auth, provider);

      if (result.user.email?.split("@")[1] !== "corp.snakewolf.com") {
        await signOut($auth);
        return {
          user: null,
          error: "会社ドメインのメールアドレスでサインインしてください。",
        };
      }

      return { user: result.user, error: null };
    } catch (error: any) {
      return {
        user: null,
        error: error.message || "認証エラーが発生しました。",
      };
    }
  };

  // サインアウト
  const logout = async () => {
    try {
      await signOut($auth);
      user.value = null;
      stopInactivityMonitoring(); // 監視停止
      return { error: null };
    } catch (error: any) {
      return { error: error.message || "サインアウトエラーが発生しました。" };
    }
  };

  return {
    user,
    initAuth,
    signInWithGoogle,
    logout,
  };
};
