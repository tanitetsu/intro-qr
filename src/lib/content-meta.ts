export type ContentMeta = {
  title?: string;
  thumbnailUrl?: string;
};

const FETCH_TIMEOUT_MS = 6000;

const DEVTO_RESERVED = new Set([
  "about",
  "dashboard",
  "enter",
  "latest",
  "listings",
  "new",
  "onboarding",
  "pod",
  "search",
  "settings",
  "t",
  "tag",
  "tags",
  "top",
  "videos",
]);

const MIXCLOUD_PROFILE_TABS = new Set([
  "favorites",
  "followers",
  "following",
  "listens",
  "playlists",
  "reposts",
  "uploads",
]);

type PageParts = {
  host: string;
  parts: string[];
};

function pageParts(pageUrl: string): PageParts | null {
  try {
    const parsed = new URL(pageUrl.trim());
    return {
      host: parsed.hostname.replace(/^www\./, "").toLowerCase(),
      parts: parsed.pathname
        .split("/")
        .filter(Boolean)
        .map((part) => {
          try {
            return decodeURIComponent(part);
          } catch {
            return part;
          }
        }),
    };
  } catch {
    return null;
  }
}

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function tagText(block: string, tag: string): string | undefined {
  const match = block.match(
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"),
  );
  if (!match) return undefined;
  const text = decodeXml(match[1]);
  return text || undefined;
}

/** デスクトップのブログ記事 URL を、OG が載るモバイル記事 URL にする */
export function naverMobilePostUrl(pageUrl: string): string | null {
  const page = pageParts(pageUrl);
  if (!page) return null;
  if (page.host !== "blog.naver.com" && page.host !== "m.blog.naver.com") {
    return null;
  }
  try {
    const parsed = new URL(pageUrl.trim());
    const head = page.parts[0]?.toLowerCase();
    if (head === "postview.naver" || head === "postview.nhn") {
      const blogId = parsed.searchParams.get("blogId")?.trim();
      const logNo = parsed.searchParams.get("logNo")?.trim();
      if (blogId && logNo && /^\d{6,}$/.test(logNo)) {
        return `https://m.blog.naver.com/${encodeURIComponent(blogId)}/${logNo}`;
      }
      return null;
    }
    if (page.parts.length >= 2 && /^\d{6,}$/.test(page.parts[1])) {
      return `https://m.blog.naver.com/${encodeURIComponent(page.parts[0])}/${page.parts[1]}`;
    }
  } catch {
    return null;
  }
  return null;
}

/** OG 取得前に差し替える URL。直す必要がなければ元の URL */
export function rewriteForOgFetch(pageUrl: string): string {
  return naverMobilePostUrl(pageUrl) ?? pageUrl;
}

export function vimeoVideoUrl(pageUrl: string): string | null {
  const page = pageParts(pageUrl);
  if (!page) return null;
  if (page.host === "player.vimeo.com") {
    const id = page.parts[1];
    return page.parts[0] === "video" && id && /^\d+$/.test(id)
      ? `https://vimeo.com/${id}`
      : null;
  }
  if (page.host !== "vimeo.com" && !page.host.endsWith(".vimeo.com")) {
    return null;
  }
  const id = [...page.parts].reverse().find((part) => /^\d+$/.test(part));
  return id ? `https://vimeo.com/${id}` : null;
}

export function dailymotionVideoUrl(pageUrl: string): string | null {
  const page = pageParts(pageUrl);
  if (!page) return null;
  if (page.host === "dai.ly" && page.parts[0]) {
    return `https://www.dailymotion.com/video/${page.parts[0]}`;
  }
  if (page.host !== "dailymotion.com" && !page.host.endsWith(".dailymotion.com")) {
    return null;
  }
  const videoIndex = page.parts.findIndex((part) => part.toLowerCase() === "video");
  const id = videoIndex >= 0 ? page.parts[videoIndex + 1] : undefined;
  if (!id || !/^[a-z0-9]+$/i.test(id)) return null;
  return `https://www.dailymotion.com/video/${id}`;
}

/** 個別のクラウドキャストだけ。プロフィール（パス1段）は対象外 */
export function mixcloudApiUrl(pageUrl: string): string | null {
  const page = pageParts(pageUrl);
  if (!page || page.host !== "mixcloud.com") return null;
  if (page.parts.length < 2) return null;
  const [user, slug] = page.parts;
  if (!user || !slug || MIXCLOUD_PROFILE_TABS.has(slug.toLowerCase())) {
    return null;
  }
  return `https://api.mixcloud.com/${encodeURIComponent(user)}/${encodeURIComponent(slug)}/`;
}

export function mixcloudMetaFromApi(data: unknown): ContentMeta | null {
  if (!data || typeof data !== "object") return null;
  const record = data as {
    name?: string;
    pictures?: Record<string, string>;
  };
  const title = record.name?.trim();
  const pictures = record.pictures ?? {};
  const thumbnailUrl =
    pictures.extra_large ||
    pictures.large ||
    pictures.medium ||
    pictures.thumbnail;
  if (!title && !thumbnailUrl) return null;
  return {
    title: title || undefined,
    thumbnailUrl: thumbnailUrl?.trim() || undefined,
  };
}

export function devtoApiUrl(pageUrl: string): string | null {
  const page = pageParts(pageUrl);
  if (!page || page.host !== "dev.to" || page.parts.length < 2) return null;
  const [user, slug] = page.parts;
  if (!user || !slug || DEVTO_RESERVED.has(user.toLowerCase())) return null;
  return `https://dev.to/api/articles/${encodeURIComponent(user)}/${encodeURIComponent(slug)}`;
}

export function devtoMetaFromApi(data: unknown): ContentMeta | null {
  if (!data || typeof data !== "object") return null;
  const record = data as {
    title?: string;
    social_image?: string;
    cover_image?: string | null;
  };
  const title = record.title?.trim();
  const thumbnailUrl = record.social_image?.trim() || record.cover_image?.trim();
  if (!title && !thumbnailUrl) return null;
  return { title: title || undefined, thumbnailUrl: thumbnailUrl || undefined };
}

export type MediumFeedRequest = {
  feed: string;
  token: string;
};

export function mediumFeedRequest(pageUrl: string): MediumFeedRequest | null {
  const page = pageParts(pageUrl);
  if (!page) return null;
  const onMedium =
    page.host === "medium.com" || page.host.endsWith(".medium.com");
  if (!onMedium || page.parts.length === 0) return null;
  const last = page.parts[page.parts.length - 1];
  if (!last || last.toLowerCase() === "feed") return null;
  const token = last.match(/([0-9a-f]{10,16})$/i)?.[1] ?? last;
  if (page.host.endsWith(".medium.com") && page.host !== "medium.com") {
    return { feed: `https://${page.host}/feed`, token };
  }
  if (page.parts[0].startsWith("@") && page.parts.length >= 2) {
    return { feed: `https://medium.com/feed/${page.parts[0]}`, token };
  }
  if (page.parts.length >= 2 && page.parts[0].toLowerCase() !== "p") {
    return { feed: `https://medium.com/feed/${page.parts[0]}`, token };
  }
  return null;
}

export function pickMediumItem(xml: string, token: string): ContentMeta | null {
  const needle = token.toLowerCase();
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
  for (const item of items) {
    const link = tagText(item, "link") ?? "";
    const guid = tagText(item, "guid") ?? "";
    const haystack = `${link} ${guid}`.toLowerCase();
    if (!haystack.includes(needle)) continue;
    const title = tagText(item, "title");
    const encoded = item.match(
      /<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/i,
    )?.[1];
    const image = encoded
      ? decodeXml(encoded).match(/<img[^>]+src=["']([^"']+)["']/i)?.[1]
      : undefined;
    if (!title && !image) continue;
    return { title, thumbnailUrl: image };
  }
  return null;
}

export function tverEpisodeId(pageUrl: string): string | null {
  const page = pageParts(pageUrl);
  if (!page || page.host !== "tver.jp") return null;
  const index = page.parts.findIndex((part) => part.toLowerCase() === "episodes");
  const id = index >= 0 ? page.parts[index + 1] : undefined;
  if (!id || !/^ep[a-z0-9]+$/i.test(id)) return null;
  return id;
}

export function tverMetaFromApi(data: unknown): ContentMeta | null {
  if (!data || typeof data !== "object") return null;
  const content = (
    data as {
      result?: { episode?: { content?: Record<string, unknown> } };
    }
  ).result?.episode?.content;
  if (!content) return null;
  const title = typeof content.title === "string" ? content.title.trim() : "";
  const series =
    typeof content.seriesTitle === "string" ? content.seriesTitle.trim() : "";
  const thumbPath =
    typeof content.thumbnailPath === "string" ? content.thumbnailPath.trim() : "";
  if (!title && !thumbPath) return null;
  const shown =
    title && series && !title.includes(series) ? `${series} ${title}` : title;
  let thumbnailUrl: string | undefined;
  if (thumbPath.startsWith("http")) thumbnailUrl = thumbPath;
  else if (thumbPath.startsWith("/")) {
    thumbnailUrl = `https://statics.tver.jp${thumbPath}`;
  }
  return { title: shown || undefined, thumbnailUrl };
}

async function getText(
  url: string,
  headers: Record<string, string>,
): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers,
      redirect: "follow",
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function fetchOembed(endpoint: string): Promise<ContentMeta | null> {
  const text = await getText(endpoint, { Accept: "application/json" });
  if (!text) return null;
  try {
    const data = JSON.parse(text) as {
      title?: string;
      thumbnail_url?: string;
    };
    const title = data.title?.trim();
    const thumbnailUrl = data.thumbnail_url?.trim();
    if (!title && !thumbnailUrl) return null;
    return { title: title || undefined, thumbnailUrl: thumbnailUrl || undefined };
  } catch {
    return null;
  }
}

/** HTML の OG では個別コンテンツが取れない PF 向けの公開 API / oEmbed */
export async function fetchProviderMeta(
  pageUrl: string,
): Promise<ContentMeta | null> {
  const vimeo = vimeoVideoUrl(pageUrl);
  if (vimeo) {
    return fetchOembed(
      `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(vimeo)}`,
    );
  }
  const dailymotion = dailymotionVideoUrl(pageUrl);
  if (dailymotion) {
    return fetchOembed(
      `https://www.dailymotion.com/services/oembed?format=json&url=${encodeURIComponent(dailymotion)}`,
    );
  }
  const mixcloud = mixcloudApiUrl(pageUrl);
  if (mixcloud) {
    const text = await getText(mixcloud, { Accept: "application/json" });
    if (!text) return null;
    try {
      return mixcloudMetaFromApi(JSON.parse(text));
    } catch {
      return null;
    }
  }
  const devto = devtoApiUrl(pageUrl);
  if (devto) {
    const text = await getText(devto, { Accept: "application/json" });
    if (!text) return null;
    try {
      return devtoMetaFromApi(JSON.parse(text));
    } catch {
      return null;
    }
  }
  const medium = mediumFeedRequest(pageUrl);
  if (medium) {
    const xml = await getText(medium.feed, { Accept: "application/rss+xml, application/xml, text/xml" });
    if (!xml) return null;
    return pickMediumItem(xml, medium.token);
  }
  const episodeId = tverEpisodeId(pageUrl);
  if (episodeId) {
    const text = await getText(
      `https://service-api.tver.jp/api/v1/callEpisode/${encodeURIComponent(episodeId)}`,
      {
        Accept: "application/json",
        "x-tver-platform-type": "web",
      },
    );
    if (!text) return null;
    try {
      return tverMetaFromApi(JSON.parse(text));
    } catch {
      return null;
    }
  }
  return null;
}
