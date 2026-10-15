"use client";

import { useEffect, useState } from "react";
import type { ProfileLink } from "@/lib/types";
import {
  displayLinkComment,
  displayLinkTitle,
  displayThumbnailUrl,
  fetchLinkMeta,
  isPlatformishTitle,
  shouldRefreshLinkTitle,
} from "@/lib/link-meta";
import { detectPlatform } from "@/lib/platform";
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
  const [liveTitle, setLiveTitle] = useState<string | undefined>();
  const platform = detectPlatform(link.url);
  const storedTitle = displayLinkTitle(link);
  const title = liveTitle || storedTitle;
  const comment = displayLinkComment(link);

  useEffect(() => {
    setLiveTitle(undefined);
    if (!shouldRefreshLinkTitle(link)) return;
    let cancelled = false;
    void fetchLinkMeta(link.url).then((meta) => {
      if (cancelled || !meta.title) return;
      if (isPlatformishTitle(meta.title, platform.label, platform.id)) return;
      setLiveTitle(meta.title);
    });
    return () => {
      cancelled = true;
    };
  }, [link, platform.id, platform.label]);

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
          {comment ? (
            <p className="text-sm leading-5 text-zinc-600">{comment}</p>
          ) : null}
        </div>
      </div>
    </a>
  );
}
