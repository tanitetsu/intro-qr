import type { ProfileLink } from "@/lib/types";
import { linkTypeLabel } from "@/lib/link-meta";

export function LinkCard({
  link,
  compact = false,
}: {
  link: ProfileLink;
  compact?: boolean;
}) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className="block overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm transition active:scale-[0.99]"
    >
      {link.thumbnailUrl && !compact ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={link.thumbnailUrl}
          alt=""
          className="h-36 w-full object-cover"
        />
      ) : null}
      <div className="space-y-1 p-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">
            {linkTypeLabel[link.type]}
          </span>
        </div>
        <p className="text-base font-semibold text-zinc-900">{link.title}</p>
        {link.comment ? (
          <p className="text-sm leading-5 text-zinc-600">{link.comment}</p>
        ) : null}
        <p className="truncate text-xs text-zinc-400">{link.url}</p>
      </div>
    </a>
  );
}
