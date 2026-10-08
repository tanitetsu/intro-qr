"use client";

import { QRCodeSVG } from "qrcode.react";

async function shareUrl(url: string, title: string) {
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({
        title,
        text: `${title} の自己紹介`,
        url,
      });
      return;
    } catch (e) {
      // ユーザーキャンセルは無視
      if (e instanceof DOMException && e.name === "AbortError") return;
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    alert("リンクをコピーしました");
  } catch {
    alert(url);
  }
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
        onClick={() => void shareUrl(value, title)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        <svg
          className="h-5 w-5"
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
        共有
      </button>
    </div>
  );
}
