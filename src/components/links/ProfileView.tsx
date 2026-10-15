"use client";

import { LinkCard } from "@/components/links/LinkCard";
import { PlatformIcon } from "@/components/links/PlatformIcon";
import { useI18n } from "@/lib/i18n/locale";
import { isSnsProfileUrl } from "@/lib/link-meta";
import type { ProfilePage } from "@/lib/types";

export function ProfileView({ page }: { page: ProfilePage }) {
  const { t } = useI18n();
  const sorted = [...page.links].sort((a, b) => a.order - b.order);
  const snsLinks = sorted.filter((l) => isSnsProfileUrl(l.url));
  const otherLinks = sorted.filter((l) => !isSnsProfileUrl(l.url));

  const iconSrc = page.iconDataUrl?.trim();

  return (
    <div className="space-y-5">
      <header className="space-y-3">
        <div className="space-y-2">
          {iconSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={iconSrc}
              alt=""
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : null}
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            {page.displayName}
          </h1>
          {page.bio ? (
            <p className="text-sm leading-6 text-zinc-600">{page.bio}</p>
          ) : null}
        </div>
        {snsLinks.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {snsLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="transition active:scale-[0.96]"
              >
                <PlatformIcon url={link.url} />
              </a>
            ))}
          </div>
        ) : null}
      </header>

      <section className="space-y-3">
        {otherLinks.length === 0 && snsLinks.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-4 text-sm text-zinc-500">
            {t("profile.noLinks")}
          </p>
        ) : (
          <div className="space-y-3">
            {otherLinks.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
