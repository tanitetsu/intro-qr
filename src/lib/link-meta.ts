import type { LinkType, ProfileLink } from "@/lib/types";
import type { MessageKey } from "@/lib/i18n/messages";
import {
  cleanContentTitle,
  detectPlatform,
  isLikelyHomepageUrl,
} from "@/lib/platform";

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
  {
    match: (h) => h === "threads.net" || h.endsWith(".threads.net"),
    label: "Threads",
  },
];

/** 投稿・リール・動画など「公開コンテンツ」パスか */
function isSnsContentPath(host: string, path: string, search: string): boolean {
  const parts = path.split("/").filter(Boolean);
  const lower = path.toLowerCase();

  if (host === "x.com" || host === "twitter.com" || host.endsWith(".x.com")) {
    return parts.includes("status") || parts[0] === "i";
  }
  if (host === "instagram.com" || host.endsWith(".instagram.com")) {
    return (
      parts[0] === "p" ||
      parts[0] === "reel" ||
      parts[0] === "reels" ||
      parts[0] === "tv"
    );
  }
  if (host === "tiktok.com" || host.endsWith(".tiktok.com")) {
    return lower.includes("/video/") || parts[0] === "t";
  }
  if (host === "facebook.com" || host.endsWith(".facebook.com")) {
    return (
      lower.includes("/watch") ||
      lower.includes("/posts/") ||
      lower.includes("/photos/") ||
      lower.includes("/videos/") ||
      search.includes("v=") ||
      parts[0] === "story.php" ||
      parts[0] === "permalink.php"
    );
  }
  if (host === "threads.net" || host.endsWith(".threads.net")) {
    return parts.includes("post");
  }
  return false;
}

export function getSnsLabel(url: string): string | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    return SNS_HOST_LABELS.find((entry) => entry.match(host))?.label ?? null;
  } catch {
    return null;
  }
}

/** SNS ホスト上の URL か（投稿含む） */
export function isSnsUrl(url: string): boolean {
  return getSnsLabel(url) !== null;
}

/**
 * プロフィール／ホーム系の SNS リンクか。
 * 投稿・リール等の公開コンテンツは false → LinkCard でコンテンツ名表示。
 */
export function isSnsProfileUrl(url: string): boolean {
  if (!isSnsUrl(url)) return false;
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const path = parsed.pathname;
    const search = parsed.search.toLowerCase();
    if (isSnsContentPath(host, path, search)) return false;
    // LINE / 短縮は連絡先扱い
    if (host === "lin.ee" || host === "line.me" || host.endsWith(".line.me")) {
      return true;
    }
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 0 || isLikelyHomepageUrl(url)) return true;
    // @user や user だけの浅いパスはプロフィール
    if (parts.length === 1) return true;
    if (parts.length === 2 && parts[0].startsWith("@")) return true;
    return false;
  } catch {
    return false;
  }
}

export function detectLinkType(url: string): LinkType {
  const u = url.toLowerCase();
  if (isSnsProfileUrl(url)) {
    return "contact";
  }
  if (
    isSnsUrl(url) ||
    u.includes("youtube.com") ||
    u.includes("youtu.be") ||
    u.includes("soundcloud.com") ||
    u.includes("note.com") ||
    u.includes("spotify.com") ||
    u.includes("music.apple.com") ||
    u.includes("podcasts.apple.com")
  ) {
    return "interest";
  }
  return "other";
}

export function guessTitleFromUrl(url: string, fallback = "Link"): string {
  if (isSnsProfileUrl(url)) {
    return getSnsLabel(url) ?? fallback;
  }
  const platform = detectPlatform(url);
  try {
    const parsed = new URL(url.trim());
    const parts = parsed.pathname.split("/").filter(Boolean);
    // パス末尾を仮タイトルに（メタ取得前のフォールバック）
    const last = parts[parts.length - 1];
    if (last && last.length > 2 && !/^\d+$/.test(last)) {
      const decoded = decodeURIComponent(last).replace(/[-_]+/g, " ").trim();
      if (decoded && decoded.toLowerCase() !== platform.id) {
        return decoded;
      }
    }
    return platform.label !== "Link" ? platform.label : parsed.hostname.replace(/^www\./, "");
  } catch {
    return fallback;
  }
}

/** 表示用: 保存タイトルから PF 名接尾辞を落としたコンテンツ名 */
export function displayLinkTitle(
  link: Pick<ProfileLink, "url" | "title">,
): string {
  const platform = detectPlatform(link.url);
  return (
    cleanContentTitle(link.title, platform.label) ||
    link.title ||
    platform.label
  );
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
  const platform = detectPlatform(trimmed);
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
      title: cleanContentTitle(data.title, platform.label),
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
