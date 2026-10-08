"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

type ShareStatus =
  | { kind: "idle" }
  | { kind: "copied" }
  | { kind: "manual"; url: string };

function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const name = "name" in error ? String(error.name) : "";
  // User dismissed the share sheet — not a failure.
  return name === "AbortError";
}

/** Android Chrome may reject relative / non-absolute share URLs. */
function toAbsoluteUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  try {
    return new URL(trimmed).href;
  } catch {
    if (typeof window === "undefined") return trimmed;
    try {
      return new URL(trimmed, window.location.origin).href;
    } catch {
      return trimmed;
    }
  }
}

async function copyWithClipboard(url: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    return false;
  }
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}

/** Legacy fallback for WebViews / older Android where Clipboard API is blocked. */
function copyWithExecCommand(url: string): boolean {
  if (typeof document === "undefined") return false;
  const input = document.createElement("textarea");
  input.value = url;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.top = "0";
  input.style.left = "0";
  input.style.width = "1px";
  input.style.height = "1px";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.focus();
  input.select();
  input.setSelectionRange(0, url.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(input);
  return ok;
}

async function shareUrl(url: string, title: string): Promise<ShareStatus> {
  const absoluteUrl = toAbsoluteUrl(url);

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    const payloads: ShareData[] = [
      {
        title,
        text: `${title} の自己紹介`,
        url: absoluteUrl,
      },
      { title, url: absoluteUrl },
      { url: absoluteUrl },
    ];

    for (const data of payloads) {
      try {
        if (
          typeof navigator.canShare === "function" &&
          !navigator.canShare(data)
        ) {
          continue;
        }
        await navigator.share(data);
        // Native share sheet handled it — no alert/toast spam.
        return { kind: "idle" };
      } catch (error) {
        if (isAbortError(error)) {
          return { kind: "idle" };
        }
        // Try a simpler payload (Android sometimes rejects text+url).
      }
    }
  }

  if (await copyWithClipboard(absoluteUrl)) {
    return { kind: "copied" };
  }
  if (copyWithExecCommand(absoluteUrl)) {
    return { kind: "copied" };
  }

  return { kind: "manual", url: absoluteUrl };
}

export function QrCard({
  value,
  title,
  subtitle,
}: {
  value: string;
  title: string;
  subtitle?: string;
}) {
  const tooLong = value.length > 1200;
  const [status, setStatus] = useState<ShareStatus>({ kind: "idle" });
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (clearTimer.current) clearTimeout(clearTimer.current);
    };
  }, []);

  function showStatus(next: ShareStatus) {
    if (clearTimer.current) clearTimeout(clearTimer.current);
    setStatus(next);
    if (next.kind === "copied") {
      clearTimer.current = setTimeout(() => {
        setStatus({ kind: "idle" });
      }, 2200);
    }
  }

  async function handleShare() {
    const result = await shareUrl(value, title);
    showStatus(result);
  }

  return (
    <div className="rounded-3xl border border-black/8 bg-white p-5 shadow-sm">
      <div className="mb-4 space-y-1 text-center">
        <p className="text-xs font-medium text-violet-700">{title}</p>
        {subtitle ? (
          <p className="text-sm text-zinc-600">{subtitle}</p>
        ) : null}
      </div>
      <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-2xl bg-zinc-50 p-3">
        {tooLong ? (
          <p className="px-3 text-center text-xs text-zinc-500">
            QRを表示できません。ページ編集後に自動同期されます。
          </p>
        ) : (
          <QRCodeSVG value={value} size={200} level="M" includeMargin={false} />
        )}
      </div>
      <button
        type="button"
        disabled={tooLong}
        onClick={() => void handleShare()}
        aria-label="リンクを共有"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        <svg
          className="h-5 w-5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M8.5 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm12 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM14.5 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M8.2 10.8 10.8 8.2M13.2 8.2l2.6 2.6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        リンクを共有
      </button>

      {status.kind === "copied" ? (
        <p
          role="status"
          className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-center text-xs font-medium text-emerald-800"
        >
          リンクをコピーしました
        </p>
      ) : null}
      {status.kind === "manual" ? (
        <div
          role="status"
          className="mt-3 space-y-1 rounded-xl bg-amber-50 px-3 py-2 text-center"
        >
          <p className="text-xs font-medium text-amber-900">
            下のURLを長押ししてコピーしてください
          </p>
          <p className="break-all select-all text-xs text-amber-950 underline-offset-2">
            {status.url}
          </p>
        </div>
      ) : null}
    </div>
  );
}
