"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-3 p-6">
          <h1 className="text-xl font-bold">表示エラー</h1>
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
            データを初期化して再読み込み
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
