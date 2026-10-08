import type { LinkType } from "@/lib/types";

export function detectLinkType(url: string): LinkType {
  const u = url.toLowerCase();
  if (
    u.includes("line.me") ||
    u.includes("x.com") ||
    u.includes("twitter.com") ||
    u.includes("instagram.com") ||
    u.includes("facebook.com")
  ) {
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

export function guessTitleFromUrl(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host;
  } catch {
    return "リンク";
  }
}

export const linkTypeLabel: Record<LinkType, string> = {
  interest: "関心",
  contact: "連絡先",
  org: "所属",
  other: "その他",
};
