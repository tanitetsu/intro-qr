"use client";

import { Component, type ReactNode } from "react";
import { isLocale, translate, type Locale } from "@/lib/i18n/messages";

type Props = { children: ReactNode };
type State = { error: Error | null };

function readLocale(): Locale {
  if (typeof window === "undefined") return "ja";
  try {
    const stored = window.localStorage.getItem("intro-qr-locale");
    if (isLocale(stored)) return stored;
  } catch {
    // ignore
  }
  const lang = navigator.language?.toLowerCase() ?? "";
  return lang.startsWith("en") ? "en" : "ja";
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      const locale = readLocale();
      return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-3 p-6">
          <h1 className="text-xl font-bold">{translate(locale, "error.title")}</h1>
          <p className="text-sm text-zinc-600">{this.state.error.message}</p>
          <button
            type="button"
            className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-medium text-white"
            onClick={() => {
              try {
                window.localStorage.removeItem("intro-qr-app-v1");
              } catch {
                // ignore
              }
              window.location.reload();
            }}
          >
            {translate(locale, "error.reset")}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
