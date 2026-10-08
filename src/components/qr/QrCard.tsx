"use client";

import { QRCodeSVG } from "qrcode.react";

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
            QRが長すぎます。クラウド同期後に再表示してください。
          </p>
        ) : (
          <QRCodeSVG value={value} size={200} level="M" includeMargin={false} />
        )}
      </div>
      <p className="mt-4 break-all text-center text-[11px] leading-4 text-zinc-400">
        {tooLong ? `${value.slice(0, 80)}…` : value}
      </p>
    </div>
  );
}
