import { PlatformIcon } from "@/components/links/PlatformIcon";
import { profileHandleFromUrl } from "@/lib/link-meta";
import { detectPlatform } from "@/lib/platform";

/** 連絡先。アイコンがプロフィールへのリンクで、取れるときだけユーザー名を出す */
export function ContactLink({ url }: { url: string }) {
  const handle = profileHandleFromUrl(url);
  const platform = detectPlatform(url);
  const label = handle ? `${platform.label} ${handle}` : platform.label;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={`inline-flex h-11 items-center rounded-full transition active:scale-[0.98] ${
        handle ? "gap-1.5 pr-3" : "w-11 justify-center"
      }`}
    >
      <PlatformIcon url={url} decorative />
      {handle ? (
        <span className="max-w-[12rem] truncate text-sm font-medium text-zinc-800">
          {handle}
        </span>
      ) : null}
    </a>
  );
}
