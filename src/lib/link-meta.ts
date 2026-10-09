import type { LinkType } from "@/lib/types";
import type { MessageKey } from "@/lib/i18n/messages";

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

export function guessTitleFromUrl(url: string, fallback = "Link"): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host;
  } catch {
    return fallback;
  }
}

export const linkTypeMessageKey: Record<LinkType, MessageKey> = {
  interest: "linkType.interest",
  contact: "linkType.contact",
  org: "linkType.org",
  other: "linkType.other",
};
