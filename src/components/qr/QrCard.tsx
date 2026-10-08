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
  return (
    <div className="rounded-3xl border border-black/8 bg-white p-5 shadow-sm">
      <div className="mb-4 space-y-1 text-center">
        <p className="text-xs font-medium text-violet-700">{title}</p>
        {subtitle ? (
          <p className="text-sm text-zinc-600">{subtitle}</p>
        ) : null}
      </div>
      <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-2xl bg-zinc-50 p-3">
        <QRCodeSVG value={value} size={200} level="M" includeMargin={false} />
      </div>
      <p className="mt-4 break-all text-center text-[11px] leading-4 text-zinc-400">
        {value}
      </p>
    </div>
  );
}
