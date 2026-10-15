"use client";

import { useState } from "react";
import type { ProfileLink } from "@/lib/types";
import { displayThumbnailUrl } from "@/lib/link-meta";
import { cleanContentTitle, detectPlatform } from "@/lib/platform";
import { PlatformIcon } from "@/components/links/PlatformIcon";

export function LinkCard({
  link,
  compact = false,
}: {
  link: ProfileLink;
  compact?: boolean;
}) {
  const thumbnailUrl = !compact ? displayThumbnailUrl(link) : undefined;
  const [thumbBroken, setThumbBroken] = useState(false);
  const platform = detectPlatform(link.url);
  const title =
    cleanContentTitle(link.title, platform.label) ||
    link.title ||
    platform.label;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className="block overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm transition active:scale-[0.99]"
    >
      {thumbnailUrl && !thumbBroken ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnailUrl}
          alt=""
          className="h-36 w-full object-cover"
          onError={() => setThumbBroken(true)}
          onLoad={(e) => {
            // YouTube の欠番プレースホルダは 120x90 の極小 JPEG を返すことがある
            const img = e.currentTarget;
            if (img.naturalWidth <= 120 && img.naturalHeight <= 90) {
              setThumbBroken(true);
            }
          }}
        />
      ) : null}
      <div className="flex items-start gap-3 p-4">
        <PlatformIcon url={link.url} className="mt-0.5" />
        <div className="min-w-0 space-y-1">
          <p className="text-base font-semibold leading-snug text-zinc-900">
            {title}
          </p>
          {link.comment ? (
            <p className="text-sm leading-5 text-zinc-600">{link.comment}</p>
          ) : null}
        </div>
      </div>
    </a>
  );
}
