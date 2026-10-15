"use client";

import Link from "next/link";
import type { ReactNode } from "react";

const toneClass = {
  neutral:
    "bg-zinc-100 text-zinc-700 enabled:active:bg-zinc-200 disabled:text-zinc-300",
  primary: "bg-violet-600 text-white enabled:active:bg-violet-700",
  soft: "bg-violet-50 text-violet-700 enabled:active:bg-violet-100",
  danger:
    "border border-red-200 bg-white text-red-600 enabled:active:bg-red-50",
  ghost: "bg-transparent text-zinc-500 enabled:active:bg-zinc-100",
} as const;

type Tone = keyof typeof toneClass;

type CommonProps = {
  label: string;
  children: ReactNode;
  tone?: Tone;
  disabled?: boolean;
  className?: string;
  /** 幅いっぱいの主要アクション（例: リンク追加） */
  wide?: boolean;
};

/** 44px 前後のアイコン操作。画面上ラベルなし、aria-label 必須。 */
export function IconButton({
  label,
  children,
  tone = "neutral",
  disabled,
  className = "",
  wide = false,
  onClick,
}: CommonProps & { onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-11 shrink-0 items-center justify-center transition disabled:cursor-not-allowed disabled:opacity-50 ${
        wide ? "w-full rounded-xl" : "w-11 rounded-full"
      } ${toneClass[tone]} ${className}`}
    >
      {children}
    </button>
  );
}

export function IconLink({
  label,
  children,
  tone = "neutral",
  href,
  className = "",
}: CommonProps & { href: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition ${toneClass[tone]} ${className}`}
    >
      {children}
    </Link>
  );
}
