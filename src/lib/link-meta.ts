import type { LinkType, ProfileLink } from "@/lib/types";
import type { MessageKey } from "@/lib/i18n/messages";
import {
  cleanContentTitle,
  contentSlugFromUrl,
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
    match: (h) =>
      h === "threads.net" ||
      h.endsWith(".threads.net") ||
      h === "threads.com" ||
      h.endsWith(".threads.com"),
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
  if (
    host === "threads.net" ||
    host.endsWith(".threads.net") ||
    host === "threads.com" ||
    host.endsWith(".threads.com")
  ) {
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
  const slug = contentSlugFromUrl(url);
  if (
    slug &&
    !isPlatformishTitle(slug, platform.label, platform.id) &&
    slug.toLowerCase() !== platform.label.toLowerCase()
  ) {
    return slug;
  }
  try {
    const parsed = new URL(url.trim());
    return platform.label !== "Link"
      ? platform.label
      : parsed.hostname.replace(/^www\./, "");
  } catch {
    return fallback;
  }
}

const CONTENT_KIND =
  "track|album|playlist|artwork|art|video|post|reel|podcast|episode|song|music|link|page|profile|channel|ショー|動画|曲";

const GENERIC_SLOGANS =
  /^(undefined|null|tiktok\s*[-–—:]\s*make your day|make your day|discover popular videos|sina visitor system|エラー|error)$/i;

/** PF名や「Spotify track」「pixiv artwork」など中身のないタイトルか */
export function isPlatformishTitle(
  raw: string | undefined | null,
  platformLabel: string,
  platformId: string,
): boolean {
  if (!raw?.trim()) return true;
  const text = raw.trim();
  const lower = text.toLowerCase();
  const label = platformLabel.toLowerCase();
  const idWords = platformId.replace(/_/g, " ").toLowerCase();
  if (lower === label || lower === idWords) return true;
  if (GENERIC_SLOGANS.test(text)) return true;
  if (/^undefined$/i.test(text)) return true;
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (
    new RegExp(`^${esc(label)}(\\s+(${CONTENT_KIND}))?$`, "i").test(text) ||
    new RegExp(`^${esc(idWords)}(\\s+(${CONTENT_KIND}))?$`, "i").test(text)
  ) {
    return true;
  }
  // プレーヤー／ログイン壁の汎用タイトル
  if (
    /(ウェブプレーヤー|web\s*player|make your day|log\s*in|visitor system)/i.test(
      text,
    ) &&
    (lower.includes(label.split(/\s+/)[0] || label) ||
      lower.includes(idWords.split(/\s+/)[0] || idWords) ||
      /tiktok|apple\s*music|spotify|weibo|facebook/i.test(text))
  ) {
    return true;
  }
  return false;
}

/** 調査用に付けた「Spotify · content」などのコメントか */
export function isSurveyMetaComment(raw: string | undefined | null): boolean {
  if (!raw?.trim()) return false;
  return /[·|]\s*(content|playlist|profile|profile_fallback|home)\s*$/i.test(
    raw.trim(),
  );
}

/**
 * 表示用コンテンツ名。
 * 保存 title が PF 名寄りで comment に本名がある場合は comment を採用する。
 */
export function displayLinkTitle(
  link: Pick<ProfileLink, "url" | "title" | "comment">,
): string {
  const platform = detectPlatform(link.url);
  const cleanedTitle = cleanContentTitle(link.title, platform.label);
  const cleanedComment = isSurveyMetaComment(link.comment)
    ? undefined
    : cleanContentTitle(link.comment, platform.label);

  const titleBad =
    !cleanedTitle ||
    isPlatformishTitle(cleanedTitle, platform.label, platform.id) ||
    isPlatformishTitle(link.title, platform.label, platform.id);
  const commentGood =
    !!cleanedComment &&
    !isPlatformishTitle(cleanedComment, platform.label, platform.id);

  if (!titleBad && cleanedTitle) return cleanedTitle;
  if (commentGood && cleanedComment) return cleanedComment;

  const guessed = guessTitleFromUrl(link.url, platform.label);
  if (
    guessed &&
    !isPlatformishTitle(guessed, platform.label, platform.id) &&
    guessed.toLowerCase() !== platform.label.toLowerCase()
  ) {
    return guessed;
  }

  // 最後の手段: プラットフォーム名そのものよりは、非 platformish な cleaned を返す
  if (
    cleanedTitle &&
    !isPlatformishTitle(cleanedTitle, platform.label, platform.id)
  ) {
    return cleanedTitle;
  }

  return guessed || cleanedTitle || link.title?.trim() || platform.label;
}

/** ユーザーメモのみ。調査メタやタイトル重複は出さない */
export function displayLinkComment(
  link: Pick<ProfileLink, "url" | "title" | "comment">,
): string | undefined {
  const raw = link.comment?.trim();
  if (!raw || isSurveyMetaComment(raw)) return undefined;
  const platform = detectPlatform(link.url);
  const title = displayLinkTitle(link);
  const cleaned = cleanContentTitle(raw, platform.label) || raw;
  if (cleaned === title || raw === title) return undefined;
  if (isPlatformishTitle(cleaned, platform.label, platform.id)) return undefined;
  // タイトル採用元が comment だった場合は字幕にしない
  const titleFromComment =
    isPlatformishTitle(link.title, platform.label, platform.id) &&
    cleaned === (cleanContentTitle(link.comment, platform.label) || link.comment);
  if (titleFromComment) return undefined;
  return raw;
}

/** 保存タイトルが弱く、表示時に meta 再取得した方がよいか */
export function shouldRefreshLinkTitle(
  link: Pick<ProfileLink, "url" | "title" | "comment">,
): boolean {
  const platform = detectPlatform(link.url);
  if (isSnsProfileUrl(link.url)) return false;
  const shown = displayLinkTitle(link);
  if (
    isPlatformishTitle(shown, platform.label, platform.id) ||
    isPlatformishTitle(link.title, platform.label, platform.id)
  ) {
    return true;
  }
  // 保存 title が PF 名寄りで、URL スラッグの方がマシなら再取得
  const guessed = guessTitleFromUrl(link.url, platform.label);
  return (
    !!guessed &&
    !isPlatformishTitle(guessed, platform.label, platform.id) &&
    guessed.toLowerCase() !== shown.toLowerCase() &&
    isPlatformishTitle(link.title, platform.label, platform.id)
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
