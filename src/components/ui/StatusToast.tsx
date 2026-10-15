"use client";

import type { ReactNode } from "react";

/** 層 C: 短い結果フィードバック（アイコン＋1行）。 */
export function StatusToast({
  children,
  icon,
  className = "",
}: {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <p
      role="status"
      className={`fixed bottom-28 left-1/2 z-40 flex max-w-[min(20rem,calc(100%-2rem))] -translate-x-1/2 items-center gap-2 rounded-full bg-zinc-900/90 px-3 py-2 text-xs font-medium text-white shadow-lg ${className}`}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <span className="min-w-0">{children}</span>
    </p>
  );
}
