"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "QR" },
  { href: "/pages", label: "ページ" },
  { href: "/saved", label: "保存" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav =
    pathname.startsWith("/u/") || pathname.startsWith("/save");

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-1 flex-col bg-[var(--app-bg)] text-[var(--app-fg)]">
      <main className={`flex-1 ${hideNav ? "" : "pb-24"}`}>{children}</main>
      {!hideNav && (
        <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-black/10 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur">
          <ul className="grid grid-cols-3">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex h-14 items-center justify-center text-sm font-medium ${
                      active ? "text-violet-700" : "text-zinc-500"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
