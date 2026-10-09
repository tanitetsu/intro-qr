import type { LinkType } from "@/lib/types";

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
