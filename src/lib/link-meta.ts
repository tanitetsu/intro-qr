import type { LinkType, ProfileLink } from "@/lib/types";
import type { MessageKey } from "@/lib/i18n/messages";

const SNS_HOST_LABELS: { match: (host: string) => boolean; label: string }[] = [
  {
    match: (h) => h === "x.com" || h === "twitter.com" || h.endsWith(".x.com"),
    label: "X",
  },
  {
    match: (h) => h === "instagram.com" || h.endsWith(".instagram.com"),
    label: "Instagram",
  },
  {
    match: (h) =>
      h === "line.me" || h.endsWith(".line.me") || h === "lin.ee",
    label: "LINE",
  },
  {
    match: (h) => h === "facebook.com" || h.endsWith(".facebook.com"),
    label: "Facebook",
  },
  {
    match: (h) => h === "tiktok.com" || h.endsWith(".tiktok.com"),
    label: "TikTok",
  },
];

export function getSnsLabel(url: string): string | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    return SNS_HOST_LABELS.find((entry) => entry.match(host))?.label ?? null;
  } catch {
    return null;
  }
}

export function isSnsUrl(url: string): boolean {
  return getSnsLabel(url) !== null;
}

export function detectLinkType(url: string): LinkType {
  const u = url.toLowerCase();
  if (isSnsUrl(url)) {
    return "contact";
  }
  if (
    u.includes("youtube.com") ||
    u.includes("youtu.be") ||
    u.includes("soundcloud.com") ||
    u.includes("note.com") ||
    u.includes("spotify.com")
  ) {
    return "interest";
  }
  return "other";
}

export function guessTitleFromUrl(url: string, fallback = "Link"): string {
  const sns = getSnsLabel(url);
  if (sns) return sns;
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host;
  } catch {
    return fallback;
  }
}

/** YouTube / youtu.be / Shorts / embed から 11 文字の動画 ID を取り出す */
export function extractYoutubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "").replace(/^m\./, "");
    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0] ?? "";
      return isYoutubeVideoId(id) ? id : null;
    }
    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const v = parsed.searchParams.get("v");
      if (v && isYoutubeVideoId(v)) return v;
      const parts = parsed.pathname.split("/").filter(Boolean);
      const kind = parts[0];
      const id = parts[1];
      if (
        id &&
        (kind === "embed" ||
          kind === "shorts" ||
          kind === "live" ||
          kind === "v") &&
        isYoutubeVideoId(id)
      ) {
        return id;
      }
    }
  } catch {
    return null;
  }
  return null;
}

function isYoutubeVideoId(value: string): boolean {
  return /^[\w-]{11}$/.test(value);
}

/** URL からサムネ URL を推定（保存済み thumbnailUrl がなくても表示できるようにする） */
export function resolveLinkThumbnail(url: string): string | undefined {
  const youtubeId = extractYoutubeVideoId(url);
  if (youtubeId) {
    return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
  }
  return undefined;
}

export function displayThumbnailUrl(
  link: Pick<ProfileLink, "url" | "thumbnailUrl">,
): string | undefined {
  const stored = link.thumbnailUrl?.trim();
  if (stored) return stored;
  return resolveLinkThumbnail(link.url);
}

export type LinkMetaResult = {
  title?: string;
  thumbnailUrl?: string;
};

/** クライアントから /api/link-meta を呼ぶ。失敗時はローカル推定に落とす */
export async function fetchLinkMeta(url: string): Promise<LinkMetaResult> {
  const trimmed = url.trim();
  const localThumb = resolveLinkThumbnail(trimmed);
  try {
    const res = await fetch(
      `/api/link-meta?url=${encodeURIComponent(trimmed)}`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) {
      return { thumbnailUrl: localThumb };
    }
    const data = (await res.json()) as LinkMetaResult;
    return {
      title: data.title?.trim() || undefined,
      thumbnailUrl: data.thumbnailUrl?.trim() || localThumb,
    };
  } catch {
    return { thumbnailUrl: localThumb };
  }
}

export const linkTypeMessageKey: Record<LinkType, MessageKey> = {
  interest: "linkType.interest",
  contact: "linkType.contact",
  org: "linkType.org",
  other: "linkType.other",
};

/** @deprecated prefer linkTypeMessageKey + t() */
export const linkTypeLabel: Record<LinkType, string> = {
  interest: "興味",
  contact: "連絡先",
  org: "所属",
  other: "その他",
};
