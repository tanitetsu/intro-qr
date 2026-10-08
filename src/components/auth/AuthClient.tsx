"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/locale";
import type { Locale } from "@/lib/i18n/messages";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  getSessionUser,
  signInWithEmail,
  signOut,
  signUpWithEmail,
} from "@/lib/supabase/auth";

export function AuthClient() {
  const { t, locale, setLocale } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    getSessionUser().then((user) => setUserEmail(user?.email ?? null));
  }, []);

  const languageSwitcher = (
    <div className="rounded-2xl border border-black/8 bg-white p-4">
      <p className="mb-2 text-xs font-medium text-zinc-500">
        {t("auth.language")}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {(
          [
            ["ja", "auth.languageJa"],
            ["en", "auth.languageEn"],
          ] as const
        ).map(([value, labelKey]) => (
          <button
            key={value}
            type="button"
            onClick={() => setLocale(value as Locale)}
            className={`rounded-xl px-3 py-2.5 text-sm ${
              locale === value
                ? "bg-violet-600 font-medium text-white"
                : "border border-zinc-200 text-zinc-700"
            }`}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>
    </div>
  );

  if (!isSupabaseConfigured()) {
    return (
      <div className="space-y-3 p-4">
        <h1 className="text-xl font-bold">{t("auth.title")}</h1>
        <p className="text-sm text-zinc-600">{t("auth.missingConfig")}</p>
        {languageSwitcher}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-bold">{t("auth.title")}</h1>

      {userEmail ? (
        <div className="space-y-3 rounded-2xl border border-black/8 bg-white p-4">
          <p className="text-sm">
            {t("auth.signedInPrefix")}{" "}
            <span className="font-medium">{userEmail}</span>
          </p>
          <button
            type="button"
            className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"
            onClick={async () => {
              await signOut();
              setUserEmail(null);
              setMessage(t("auth.loggedOut"));
            }}
          >
            {t("auth.logout")}
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
            placeholder={t("auth.passwordPlaceholder")}
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
                setMessage(t("auth.loggedIn"));
              }}
            >
              {t("auth.login")}
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
                setMessage(t("auth.accountCreated"));
              }}
            >
              {t("auth.signUp")}
            </button>
          </div>
        </div>
      )}

      {languageSwitcher}

      {message ? <p className="text-sm text-zinc-600">{message}</p> : null}
    </div>
  );
}
