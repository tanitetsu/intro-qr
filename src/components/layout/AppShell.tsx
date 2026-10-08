"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { InAppBrowserBanner } from "@/components/layout/InAppBrowserBanner";
import {
  AlbumTabIcon,
  EditTabIcon,
  ProfileTabIcon,
  QrTabIcon,
} from "@/components/layout/TabIcons";
import { useI18n } from "@/lib/i18n/locale";
import type { MessageKey } from "@/lib/i18n/messages";

const navItems: {
  href: string;
  labelKey: MessageKey;
  Icon: typeof QrTabIcon;
}[] = [
  { href: "/", labelKey: "nav.qr", Icon: QrTabIcon },
  { href: "/pages", labelKey: "nav.pages", Icon: EditTabIcon },
  { href: "/saved", labelKey: "nav.album", Icon: AlbumTabIcon },
  { href: "/auth", labelKey: "nav.account", Icon: ProfileTabIcon },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-1 flex-col bg-[var(--app-bg)] text-[var(--app-fg)]">
      <InAppBrowserBanner />
      <main className="flex-1 pb-24">{children}</main>
      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-black/10 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <ul className="grid grid-cols-4">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.Icon;
            const label = t(item.labelKey);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-label={label}
                  className={`flex h-14 flex-col items-center justify-center gap-0.5 ${
                    active ? "text-violet-700" : "text-zinc-500"
                  }`}
                >
                  <Icon className="h-7 w-7" />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
