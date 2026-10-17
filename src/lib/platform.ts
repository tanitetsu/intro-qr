export type PlatformId =
  | "x"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "threads"
  | "linkedin"
  | "youtube"
  | "pinterest"
  | "reddit"
  | "tumblr"
  | "mastodon"
  | "bluesky"
  | "weibo"
  | "douyin"
  | "xiaohongshu"
  | "bilibili"
  | "vk"
  | "pixiv"
  | "lemon8"
  | "spotify"
  | "apple_music"
  | "apple_podcasts"
  | "twitch"
  | "kick"
  | "vimeo"
  | "dailymotion"
  | "niconico"
  | "soundcloud"
  | "bandcamp"
  | "mixcloud"
  | "note"
  | "medium"
  | "substack"
  | "ghost"
  | "wordpress"
  | "github"
  | "gitlab"
  | "notion"
  | "linktree"
  | "behance"
  | "dribbble"
  | "artstation"
  | "patreon"
  | "ko_fi"
  | "bmc"
  | "gumroad"
  | "etsy"
  | "shopify"
  | "paypal"
  | "calendly"
  | "calcom"
  | "zoom"
  | "google_maps"
  | "steam"
  | "roblox"
  | "epic"
  | "ameba"
  | "line"
  | "discord"
  | "abema"
  | "about_me"
  | "amazon"
  | "carrd"
  | "ea"
  | "google_calendar"
  | "google_meet"
  | "google_sites"
  | "lemon_squeezy"
  | "mixi"
  | "naver"
  | "orcid"
  | "openstreetmap"
  | "tistory"
  | "venmo"
  | "devto"
  | "tver"
  | "snapchat"
  | "telegram"
  | "researchgate"
  | "hashnode"
  | "other";

export type PlatformInfo = {
  id: PlatformId;
  label: string;
  /** Tailwind-ish brand color for icon chip */
  color: string;
};

type Rule = {
  id: PlatformId;
  label: string;
  color: string;
  match: (host: string, path: string) => boolean;
};

const RULES: Rule[] = [
  {
    id: "x",
    label: "X",
    color: "#000000",
    match: (h) =>
      h === "x.com" || h === "twitter.com" || h.endsWith(".x.com"),
  },
  {
    id: "instagram",
    label: "Instagram",
    color: "#E4405F",
    match: (h) => h === "instagram.com" || h.endsWith(".instagram.com"),
  },
  {
    id: "facebook",
    label: "Facebook",
    color: "#1877F2",
    match: (h) => h === "facebook.com" || h.endsWith(".facebook.com"),
  },
  {
    id: "tiktok",
    label: "TikTok",
    color: "#010101",
    match: (h) => h === "tiktok.com" || h.endsWith(".tiktok.com"),
  },
  {
    id: "threads",
    label: "Threads",
    color: "#000000",
    match: (h) =>
      h === "threads.net" ||
      h.endsWith(".threads.net") ||
      h === "threads.com" ||
      h.endsWith(".threads.com"),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    color: "#0A66C2",
    match: (h) => h === "linkedin.com" || h.endsWith(".linkedin.com"),
  },
  {
    id: "youtube",
    label: "YouTube",
    color: "#FF0000",
    match: (h) =>
      h === "youtube.com" ||
      h === "youtu.be" ||
      h === "music.youtube.com" ||
      h.endsWith(".youtube.com"),
  },
  {
    id: "pinterest",
    label: "Pinterest",
    color: "#E60023",
    match: (h) => h === "pinterest.com" || h.endsWith(".pinterest.com"),
  },
  {
    id: "reddit",
    label: "Reddit",
    color: "#FF4500",
    match: (h) => h === "reddit.com" || h.endsWith(".reddit.com"),
  },
  {
    id: "tumblr",
    label: "Tumblr",
    color: "#001935",
    match: (h) => h === "tumblr.com" || h.endsWith(".tumblr.com"),
  },
  {
    id: "mastodon",
    label: "Mastodon",
    color: "#6364FF",
    match: (h) => h.includes("mastodon") || h.endsWith(".social"),
  },
  {
    id: "bluesky",
    label: "Bluesky",
    color: "#1185FE",
    match: (h) => h === "bsky.app" || h.endsWith(".bsky.social"),
  },
  {
    id: "weibo",
    label: "Weibo",
    color: "#E6162D",
    match: (h) => h === "weibo.com" || h.endsWith(".weibo.com"),
  },
  {
    id: "douyin",
    label: "Douyin",
    color: "#000000",
    match: (h) => h === "douyin.com" || h.endsWith(".douyin.com"),
  },
  {
    id: "xiaohongshu",
    label: "小红书",
    color: "#FF2442",
    match: (h) =>
      h === "xiaohongshu.com" || h.endsWith(".xiaohongshu.com"),
  },
  {
    id: "bilibili",
    label: "Bilibili",
    color: "#00A1D6",
    match: (h) => h === "bilibili.com" || h.endsWith(".bilibili.com"),
  },
  {
    id: "vk",
    label: "VK",
    color: "#0077FF",
    match: (h) => h === "vk.com" || h.endsWith(".vk.com"),
  },
  {
    id: "pixiv",
    label: "pixiv",
    color: "#0096FA",
    match: (h) => h === "pixiv.net" || h.endsWith(".pixiv.net"),
  },
  {
    id: "lemon8",
    label: "Lemon8",
    color: "#FEE600",
    match: (h) => h.includes("lemon8"),
  },
  {
    id: "spotify",
    label: "Spotify",
    color: "#1DB954",
    match: (h) =>
      h === "open.spotify.com" ||
      h === "spotify.com" ||
      h === "creators.spotify.com" ||
      h.endsWith(".spotify.com"),
  },
  {
    id: "apple_music",
    label: "Apple Music",
    color: "#FC3C44",
    match: (h) => h === "music.apple.com",
  },
  {
    id: "apple_podcasts",
    label: "Apple Podcasts",
    color: "#9933FF",
    match: (h) => h === "podcasts.apple.com",
  },
  {
    id: "twitch",
    label: "Twitch",
    color: "#9146FF",
    match: (h) => h === "twitch.tv" || h.endsWith(".twitch.tv"),
  },
  {
    id: "kick",
    label: "Kick",
    color: "#53FC18",
    match: (h) => h === "kick.com",
  },
  {
    id: "vimeo",
    label: "Vimeo",
    color: "#1AB7EA",
    match: (h) => h === "vimeo.com",
  },
  {
    id: "dailymotion",
    label: "Dailymotion",
    color: "#00AFFF",
    match: (h) => h === "dailymotion.com",
  },
  {
    id: "niconico",
    label: "ニコニコ",
    color: "#252525",
    match: (h) => h.includes("nicovideo"),
  },
  {
    id: "soundcloud",
    label: "SoundCloud",
    color: "#FF5500",
    match: (h) => h === "soundcloud.com",
  },
  {
    id: "bandcamp",
    label: "Bandcamp",
    color: "#1DA0C3",
    match: (h) => h === "bandcamp.com" || h.endsWith(".bandcamp.com"),
  },
  {
    id: "mixcloud",
    label: "Mixcloud",
    color: "#5000FF",
    match: (h) => h === "mixcloud.com",
  },
  {
    id: "note",
    label: "note",
    color: "#41C9B4",
    match: (h) => h === "note.com",
  },
  {
    id: "medium",
    label: "Medium",
    color: "#000000",
    match: (h) => h === "medium.com" || h.endsWith(".medium.com"),
  },
  {
    id: "substack",
    label: "Substack",
    color: "#FF6719",
    match: (h) => h === "substack.com" || h.endsWith(".substack.com"),
  },
  {
    id: "ghost",
    label: "Ghost",
    color: "#15171A",
    match: (h) => h.includes("ghost"),
  },
  {
    id: "wordpress",
    label: "WordPress",
    color: "#21759B",
    match: (h) => h.includes("wordpress") || h.endsWith(".wp.com"),
  },
  {
    id: "github",
    label: "GitHub",
    color: "#181717",
    match: (h) => h === "github.com",
  },
  {
    id: "gitlab",
    label: "GitLab",
    color: "#FC6D26",
    match: (h) => h === "gitlab.com",
  },
  {
    id: "notion",
    label: "Notion",
    color: "#000000",
    match: (h) => h.includes("notion"),
  },
  {
    id: "linktree",
    label: "Linktree",
    color: "#43E55E",
    match: (h) => h === "linktr.ee",
  },
  {
    id: "behance",
    label: "Behance",
    color: "#1769FF",
    match: (h) => h === "behance.net",
  },
  {
    id: "dribbble",
    label: "Dribbble",
    color: "#EA4C89",
    match: (h) => h === "dribbble.com",
  },
  {
    id: "artstation",
    label: "ArtStation",
    color: "#13AFF0",
    match: (h) => h === "artstation.com",
  },
  {
    id: "patreon",
    label: "Patreon",
    color: "#FF424D",
    match: (h) => h === "patreon.com",
  },
  {
    id: "ko_fi",
    label: "Ko-fi",
    color: "#FF5E5B",
    match: (h) => h === "ko-fi.com",
  },
  {
    id: "bmc",
    label: "Buy Me a Coffee",
    color: "#FFDD00",
    match: (h) => h === "buymeacoffee.com",
  },
  {
    id: "gumroad",
    label: "Gumroad",
    color: "#FF90E8",
    match: (h) => h === "gumroad.com",
  },
  {
    id: "etsy",
    label: "Etsy",
    color: "#F16521",
    match: (h) => h === "etsy.com",
  },
  {
    id: "shopify",
    label: "Shopify",
    color: "#96BF48",
    match: (h) => h.includes("shopify") || h.endsWith(".myshopify.com"),
  },
  {
    id: "paypal",
    label: "PayPal",
    color: "#003087",
    match: (h) => h.includes("paypal"),
  },
  {
    id: "calendly",
    label: "Calendly",
    color: "#006BFF",
    match: (h) => h === "calendly.com",
  },
  {
    id: "calcom",
    label: "Cal.com",
    color: "#111827",
    match: (h) => h === "cal.com",
  },
  {
    id: "zoom",
    label: "Zoom",
    color: "#2D8CFF",
    match: (h) => h.includes("zoom."),
  },
  {
    id: "google_maps",
    label: "Google Maps",
    color: "#34A853",
    match: (h, path) =>
      h.includes("google.") && (path.includes("/maps") || h.includes("maps")),
  },
  {
    id: "steam",
    label: "Steam",
    color: "#171A21",
    match: (h) =>
      h.includes("steampowered") ||
      h === "steamcommunity.com" ||
      h.endsWith(".steamcommunity.com"),
  },
  {
    id: "roblox",
    label: "Roblox",
    color: "#E2231A",
    match: (h) => h === "roblox.com",
  },
  {
    id: "epic",
    label: "Epic Games",
    color: "#313131",
    match: (h) => h.includes("epicgames"),
  },
  {
    id: "ameba",
    label: "Ameba",
    color: "#2DCC70",
    match: (h) => h === "ameblo.jp" || h.includes("ameba"),
  },
  {
    id: "line",
    label: "LINE",
    color: "#06C755",
    match: (h) =>
      h === "line.me" || h.endsWith(".line.me") || h === "lin.ee",
  },
  {
    id: "discord",
    label: "Discord",
    color: "#5865F2",
    match: (h) => h === "discord.com" || h === "discord.gg",
  },
  {
    id: "abema",
    label: "Abema",
    color: "#000000",
    match: (h) => h === "abema.tv" || h.endsWith(".abema.tv"),
  },
  {
    id: "about_me",
    label: "About.me",
    color: "#000000",
    match: (h) => h === "about.me" || h.endsWith(".about.me"),
  },
  {
    id: "amazon",
    label: "Amazon",
    color: "#FF9900",
    match: (h) =>
      /(?:^|\.)amazon\.(?:co\.)?[a-z]{2,3}$/.test(h),
  },
  {
    id: "carrd",
    label: "Carrd",
    color: "#1F1F1F",
    match: (h) => h === "carrd.co" || h.endsWith(".carrd.co"),
  },
  {
    id: "ea",
    label: "EA",
    color: "#000000",
    match: (h) => h === "ea.com" || h.endsWith(".ea.com"),
  },
  {
    id: "google_calendar",
    label: "Google Calendar",
    color: "#4285F4",
    match: (h, path) =>
      h === "calendar.google.com" ||
      (h.endsWith("google.com") && /\/calendar(\/|$)/.test(path)),
  },
  {
    id: "google_meet",
    label: "Google Meet",
    color: "#00832D",
    match: (h, path) =>
      h === "meet.google.com" ||
      (h.endsWith("google.com") && /\/meet(\/|$)/.test(path)),
  },
  {
    id: "google_sites",
    label: "Google Sites",
    color: "#1A73E8",
    match: (h) => h === "sites.google.com",
  },
  {
    id: "lemon_squeezy",
    label: "Lemon Squeezy",
    color: "#FFC233",
    match: (h) =>
      h === "lemonsqueezy.com" || h.endsWith(".lemonsqueezy.com"),
  },
  {
    id: "mixi",
    label: "mixi",
    color: "#FFD400",
    match: (h) => h === "mixi.jp" || h.endsWith(".mixi.jp"),
  },
  {
    id: "naver",
    label: "Naver",
    color: "#03C75A",
    match: (h) => h === "naver.com" || h.endsWith(".naver.com"),
  },
  {
    id: "orcid",
    label: "ORCID",
    color: "#A6CE39",
    match: (h) => h === "orcid.org" || h.endsWith(".orcid.org"),
  },
  {
    id: "openstreetmap",
    label: "OpenStreetMap",
    color: "#7EBC6F",
    match: (h) =>
      h === "openstreetmap.org" || h.endsWith(".openstreetmap.org"),
  },
  {
    id: "tistory",
    label: "Tistory",
    color: "#000000",
    match: (h) => h === "tistory.com" || h.endsWith(".tistory.com"),
  },
  {
    id: "venmo",
    label: "Venmo",
    color: "#008CFF",
    match: (h) => h === "venmo.com" || h.endsWith(".venmo.com"),
  },
  {
    id: "devto",
    label: "DEV",
    color: "#0A0A0A",
    match: (h) => h === "dev.to" || h.endsWith(".dev.to"),
  },
  {
    id: "tver",
    label: "TVer",
    color: "#111111",
    match: (h) => h === "tver.jp" || h.endsWith(".tver.jp"),
  },
  {
    id: "snapchat",
    label: "Snapchat",
    color: "#FFFC00",
    match: (h) => h === "snapchat.com" || h.endsWith(".snapchat.com"),
  },
  {
    id: "telegram",
    label: "Telegram",
    color: "#26A5E4",
    match: (h) =>
      h === "t.me" ||
      h === "telegram.me" ||
      h === "telegram.org" ||
      h.endsWith(".telegram.org") ||
      h.endsWith(".t.me"),
  },
  {
    id: "researchgate",
    label: "ResearchGate",
    color: "#00CCBB",
    match: (h) =>
      h === "researchgate.net" || h.endsWith(".researchgate.net"),
  },
  {
    id: "hashnode",
    label: "Hashnode",
    color: "#2962FF",
    match: (h) =>
      h === "hashnode.com" ||
      h.endsWith(".hashnode.com") ||
      h === "hashnode.dev" ||
      h.endsWith(".hashnode.dev"),
  },
];

export function detectPlatform(url: string): PlatformInfo {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const path = parsed.pathname.toLowerCase();
    const hit = RULES.find((r) => r.match(host, path));
    if (hit) return { id: hit.id, label: hit.label, color: hit.color };
  } catch {
    // ignore
  }
  return { id: "other", label: "Link", color: "#71717A" };
}

/** OGタイトルからPF名やサイト名の接尾辞を落としてコンテンツ名寄りにする */
export function cleanContentTitle(
  raw: string | undefined | null,
  platformLabel?: string,
): string | undefined {
  if (!raw?.trim()) return undefined;
  let title = raw
    .replace(/\s+/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#064;/g, "@")
    .replace(/&#xb7;/gi, "·")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

  const suffixes = [
    "on Apple Music",
    "on Spotify for Creators",
    "on Spotify",
    "on Apple Podcasts",
    "on SoundCloud",
    "on Bandcamp",
    "on about.me",
    "A podcast on Spotify for Creators",
    platformLabel,
    "YouTube",
    "Spotify for Creators",
    "Spotify",
    "Apple Music",
    "Apple Podcasts",
    "GitHub",
    "LinkedIn",
    "Instagram",
    "TikTok",
    "note",
    "SoundCloud",
    "Bandcamp",
    "Twitch",
    "Steam",
    "Roblox",
    "bilibili",
    "哔哩哔哩",
    "about.me",
    "pixiv",
  ].filter(Boolean) as string[];

  // 長い接尾辞を先に（"on Apple Music" が "Apple Music" より先）
  suffixes.sort((a, b) => b.length - a.length);

  for (const s of suffixes) {
    const escaped = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // ハイフンは文字クラス末尾に置き、範囲誤爆を防ぐ
    title = title
      .replace(new RegExp(`\\s*[|·•–—_-]\\s*${escaped}\\s*$`, "i"), "")
      .replace(new RegExp(`\\s+${escaped}\\s*$`, "i"), "")
      .trim();
  }
  // 末尾の装飾記号だけ残ったら落とす
  title = title.replace(/\s*[|·•–—_-]+\s*$/g, "").trim();

  // bilibili 系の「タイトル_哔哩哔哩_bilibili」
  title = title.replace(/_哔哩哔哩(_bilibili)?$/i, "").trim();
  title = title.replace(/_bilibili$/i, "").trim();

  // 「GitHub - repo: desc」→ 「repo: desc」
  if (platformLabel && /^GitHub$/i.test(platformLabel)) {
    title = title.replace(/^GitHub\s*[-–—:]\s*/i, "").trim();
  }

  // 「タイトル | サイト」の最後の | 以降が短いブランドなら落とす
  const pipe = title.lastIndexOf("|");
  if (pipe > 0) {
    const right = title.slice(pipe + 1).trim();
    if (right.length > 0 && right.length <= 24) {
      title = title.slice(0, pipe).trim();
    }
  }

  // 「Name on about.me」など
  title = title.replace(/\s+on\s+about\.me\s*$/i, "").trim();

  // 末尾の孤立した "on" / "by" を除去
  title = title.replace(/\s+(on|by)\s*$/i, "").trim();

  return title || undefined;
}

/** Apple Music / Spotify などのパスからコンテンツ名スラッグを推定 */
export function contentSlugFromUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url.trim());
    const parts = parsed.pathname.split("/").filter(Boolean);
    const structural = new Set([
      "album",
      "playlist",
      "song",
      "track",
      "artist",
      "show",
      "episode",
      "video",
      "videos",
      "watch",
      "shorts",
      "status",
      "post",
      "posts",
      "reel",
      "reels",
      "artworks",
      "en",
      "jp",
      "us",
      "uk",
      "kr",
      "cn",
      "tw",
      "www",
      "sets",
      "games",
      "app",
      "store",
      "p",
      "t",
      "v",
      "node",
      "questions",
      "gallery",
      "shots",
      "artwork",
      "templates",
      "l",
      "pod",
      "podcast",
      "playlist",
      "channel",
      "user",
      "users",
    ]);
    const isId = (s: string) =>
      /^\d+$/.test(s) ||
      /^pl\./i.test(s) ||
      /^BV[\w]+$/i.test(s) ||
      /^sm\d+$/i.test(s) ||
      /^id\d+$/i.test(s) ||
      /^RD[\w-]+$/i.test(s);

    for (let i = parts.length - 1; i >= 0; i--) {
      const raw = parts[i];
      if (!raw || structural.has(raw.toLowerCase()) || isId(raw)) continue;
      // Apple: /album/{slug}/{id} → slug
      if (
        i + 1 < parts.length &&
        isId(parts[i + 1]) &&
        structural.has((parts[i - 1] || "").toLowerCase())
      ) {
        const decoded = decodeURIComponent(raw).replace(/[-_]+/g, " ").trim();
        if (decoded.length > 1) return decoded;
      }
      const decoded = decodeURIComponent(raw).replace(/[-_]+/g, " ").trim();
      if (
        decoded.length > 1 &&
        !/^(www|index|home|explore)$/i.test(decoded)
      ) {
        return decoded;
      }
    }
  } catch {
    // ignore
  }
  return undefined;
}

export function isLikelyHomepageUrl(url: string): boolean {
  try {
    const parsed = new URL(url.trim());
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length === 0) return true;
    const homeish = new Set([
      "explore",
      "discover",
      "home",
      "feed",
      "blog",
      "news",
      "about",
      "login",
      "signup",
    ]);
    return parts.length === 1 && homeish.has(parts[0].toLowerCase());
  } catch {
    return false;
  }
}
