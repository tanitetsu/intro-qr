"use client";

import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  getSessionUser,
  signInWithEmail,
  signOut,
  signUpWithEmail,
} from "@/lib/supabase/auth";

export function AuthClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    getSessionUser().then((user) => setUserEmail(user?.email ?? null));
  }, []);

  if (!isSupabaseConfigured()) {
    return (
      <div className="space-y-3 p-4">
        <h1 className="text-xl font-bold">ログイン</h1>
        <p className="text-sm text-zinc-600">
          Supabase の環境変数が未設定です。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-bold">ログイン</h1>

      {userEmail ? (
        <div className="space-y-3 rounded-2xl border border-black/8 bg-white p-4">
          <p className="text-sm">
            ログイン中: <span className="font-medium">{userEmail}</span>
          </p>
          <button
            type="button"
            className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"
            onClick={async () => {
              await signOut();
              setUserEmail(null);
              setMessage("ログアウトしました");
            }}
          >
            ログアウト
          </button>
        </div>
      ) : (
        <div className="space-y-3 rounded-2xl border border-black/8 bg-white p-4">
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            type="password"
            placeholder="パスワード（6文字以上）"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={busy}
              className="rounded-xl bg-violet-600 px-3 py-2.5 text-sm font-medium text-white disabled:opacity-60"
              onClick={async () => {
                setBusy(true);
                setMessage("");
                const { data, error } = await signInWithEmail(email, password);
                setBusy(false);
                if (error) {
                  setMessage(error.message);
                  return;
                }
                setUserEmail(data.user?.email ?? email);
                setMessage("ログインしました");
              }}
            >
              ログイン
            </button>
            <button
              type="button"
              disabled={busy}
              className="rounded-xl border border-zinc-200 px-3 py-2.5 text-sm disabled:opacity-60"
              onClick={async () => {
                setBusy(true);
                setMessage("");
                const { data, error } = await signUpWithEmail(email, password);
                setBusy(false);
                if (error) {
                  setMessage(error.message);
                  return;
                }
                setUserEmail(data.user?.email ?? email);
                setMessage("アカウントを作成しました");
              }}
            >
              新規登録
            </button>
          </div>
        </div>
      )}

      {message ? <p className="text-sm text-zinc-600">{message}</p> : null}
    </div>
  );
}
