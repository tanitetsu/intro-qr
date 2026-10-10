"use client";

import { useState } from "react";
import type { ProfileLink } from "@/lib/types";
import { displayThumbnailUrl } from "@/lib/link-meta";

export function LinkCard({
  link,
  compact = false,
}: {
  link: ProfileLink;
  compact?: boolean;
}) {
  const thumbnailUrl = !compact ? displayThumbnailUrl(link) : undefined;
  const [thumbBroken, setThumbBroken] = useState(false);

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
      <div className="space-y-1 p-4">
        <p className="text-base font-semibold text-zinc-900">{link.title}</p>
        {link.comment ? (
          <p className="text-sm leading-5 text-zinc-600">{link.comment}</p>
        ) : null}
      </div>
    </a>
  );
}
