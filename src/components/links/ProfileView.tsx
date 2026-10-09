"use client";

import { LinkCard } from "@/components/links/LinkCard";
import { useI18n } from "@/lib/i18n/locale";
import type { ProfilePage } from "@/lib/types";

export function ProfileView({ page }: { page: ProfilePage }) {
  const { t } = useI18n();
  const interestLinks = [...page.links]
    .sort((a, b) => a.order - b.order)
    .filter((l) => l.type === "interest" || l.type === "org");
  const contactLinks = [...page.links]
    .sort((a, b) => a.order - b.order)
    .filter((l) => l.type === "contact" || l.type === "other");

  const ordered =
    interestLinks.length || contactLinks.length
      ? [...interestLinks, ...contactLinks]
      : [...page.links].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-5">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {page.displayName}
        </h1>
        {page.bio ? (
          <p className="text-sm leading-6 text-zinc-600">{page.bio}</p>
        ) : null}
      </header>

      <section className="space-y-3">
        {ordered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-4 text-sm text-zinc-500">
            {t("profile.noLinks")}
          </p>
        ) : (
          <div className="space-y-3">
            {ordered.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
