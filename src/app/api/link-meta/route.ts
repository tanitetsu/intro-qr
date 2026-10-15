import { NextResponse } from "next/server";
import {
  extractYoutubeVideoId,
  guessTitleFromUrl,
  isPlatformishTitle,
  resolveLinkThumbnail,
} from "@/lib/link-meta";
import {
  cleanContentTitle,
  contentSlugFromUrl,
  detectPlatform,
} from "@/lib/platform";

export const runtime = "nodejs";

const FETCH_TIMEOUT_MS = 6000;
const MAX_HTML_BYTES = 512_000;

type MetaPayload = {
  title?: string;
  thumbnailUrl?: string;
};

function isHttpUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url;
  } catch {
    return null;
  }
}

async function fetchYoutubeOEmbed(url: string): Promise<MetaPayload | null> {
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  const res = await fetch(endpoint, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    title?: string;
    thumbnail_url?: string;
  };
  return {
    title: data.title?.trim() || undefined,
    thumbnailUrl:
      data.thumbnail_url?.trim() || resolveLinkThumbnail(url) || undefined,
  };
}

function parseAppleMusicIds(url: string): {
  country: string;
  trackId?: string;
  albumId?: string;
  slug?: string;
} | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.replace(/^www\./, "") !== "music.apple.com") {
      return null;
    }
    const parts = parsed.pathname.split("/").filter(Boolean);
    // /{country}/album|song|playlist/{slug}/{id}
    const country = parts[0] || "us";
    const kind = parts[1]?.toLowerCase();
    const slug = parts[2] ? decodeURIComponent(parts[2]) : undefined;
    const id = parts[3];
    const trackId = parsed.searchParams.get("i") || undefined;
    if (kind === "song" && id) {
      return { country, trackId: id, slug };
    }
    if (kind === "album" && id) {
      return { country, albumId: id, trackId, slug };
    }
    if (kind === "playlist") {
      return { country, slug };
    }
    return { country, trackId, slug };
  } catch {
    return null;
  }
}

async function fetchItunesLookup(
  id: string,
  country: string,
): Promise<MetaPayload | null> {
  const endpoint = `https://itunes.apple.com/lookup?id=${encodeURIComponent(id)}&country=${encodeURIComponent(country)}`;
  const res = await fetch(endpoint, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    results?: Array<{
      trackName?: string;
      collectionName?: string;
      artworkUrl100?: string;
      artworkUrl600?: string;
      wrapperType?: string;
      kind?: string;
    }>;
  };
  const results = data.results ?? [];
  const track =
    results.find((r) => r.trackName && (r.kind === "song" || r.wrapperType === "track")) ??
    results.find((r) => r.trackName);
  const collection = results.find((r) => r.collectionName);
  const title = track?.trackName || collection?.collectionName;
  const art =
    track?.artworkUrl100 ||
    collection?.artworkUrl100 ||
    track?.artworkUrl600 ||
    collection?.artworkUrl600;
  if (!title && !art) return null;
  return {
    title: title?.trim() || undefined,
    thumbnailUrl: art
      ? art.replace(/\/\d+x\d+bb/, "/600x600bb")
      : undefined,
  };
}

async function fetchAppleMusicMeta(url: string): Promise<MetaPayload | null> {
  const parsed = parseAppleMusicIds(url);
  if (!parsed) return null;

  // 曲 ID があれば最優先（OG が「ウェブプレーヤー」になるケースの本命）
  if (parsed.trackId) {
    const track = await fetchItunesLookup(parsed.trackId, parsed.country);
    if (track?.title) return track;
  }
  if (parsed.albumId) {
    const album = await fetchItunesLookup(parsed.albumId, parsed.country);
    // スラッグと一致しない誤 ID のときはスラッグを優先
    const slugTitle = parsed.slug?.replace(/[-_]+/g, " ").trim();
    if (
      album?.title &&
      slugTitle &&
      !album.title.toLowerCase().includes(slugTitle.toLowerCase().slice(0, 8)) &&
      slugTitle.length > 2
    ) {
      // 誤ったアルバム ID（スラッグと不一致）のアートは使わない
      return { title: slugTitle };
    }
    if (album?.title) return album;
  }
  if (parsed.slug) {
    const slugTitle = parsed.slug.replace(/[-_]+/g, " ").trim();
    if (slugTitle) return { title: slugTitle };
  }
  return null;
}

function pickBestTitle(
  url: string,
  candidates: Array<string | undefined>,
): string | undefined {
  const platform = detectPlatform(url);
  for (const raw of candidates) {
    const cleaned = cleanContentTitle(raw, platform.label);
    if (
      cleaned &&
      !isPlatformishTitle(cleaned, platform.label, platform.id) &&
      !isPlatformishTitle(raw, platform.label, platform.id)
    ) {
      return cleaned;
    }
  }
  const guessed = guessTitleFromUrl(url, platform.label);
  if (
    guessed &&
    !isPlatformishTitle(guessed, platform.label, platform.id)
  ) {
    return guessed;
  }
  const slug = contentSlugFromUrl(url);
  if (slug && !isPlatformishTitle(slug, platform.label, platform.id)) {
    return slug;
  }
  return cleanContentTitle(candidates.find(Boolean), platform.label);
}

function pickMetaFromHtml(html: string, baseUrl: string): MetaPayload {
  const get = (property: string) => {
    const re = new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i",
    );
    const reFlip = new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
      "i",
    );
    return html.match(re)?.[1] ?? html.match(reFlip)?.[1] ?? undefined;
  };

  const rawTitle =
    get("og:title") ||
    get("twitter:title") ||
    html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
  const rawImage = get("og:image") || get("twitter:image");

  let thumbnailUrl: string | undefined;
  if (rawImage) {
    try {
      thumbnailUrl = new URL(rawImage, baseUrl).toString();
    } catch {
      thumbnailUrl = undefined;
    }
  }

  const platform = detectPlatform(baseUrl);
  const title = cleanContentTitle(
    rawTitle
      ?.replace(/\s+/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .trim(),
    platform.label,
  );

  return {
    title,
    thumbnailUrl,
  };
}

async function fetchOgMeta(url: string): Promise<MetaPayload> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "IntroQRLinkMeta/1.0 (+https://intro-qr.vercel.app)",
    },
    redirect: "follow",
  });
  if (!res.ok) return {};
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html") && !contentType.includes("xml")) {
    return {};
  }
  const reader = res.body?.getReader();
  if (!reader) return {};
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (total < MAX_HTML_BYTES) {
    const { done, value } = await reader.read();
    if (done || !value) break;
    chunks.push(value);
    total += value.byteLength;
    if (total >= MAX_HTML_BYTES) break;
  }
  try {
    await reader.cancel();
  } catch {
    // ignore
  }
  const html = new TextDecoder("utf-8").decode(
    Buffer.concat(chunks.map((c) => Buffer.from(c))),
  );
  return pickMetaFromHtml(html, url);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url")?.trim() ?? "";
  const parsed = isHttpUrl(rawUrl);
  if (!parsed) {
    return NextResponse.json({ error: "invalid_url" }, { status: 400 });
  }

  const localThumb = resolveLinkThumbnail(parsed.toString());

  const platform = detectPlatform(parsed.toString());

  try {
    const urlStr = parsed.toString();

    if (extractYoutubeVideoId(urlStr)) {
      const yt = await fetchYoutubeOEmbed(urlStr);
      return NextResponse.json({
        title: pickBestTitle(urlStr, [yt?.title]),
        thumbnailUrl: yt?.thumbnailUrl || localThumb,
      } satisfies MetaPayload);
    }

    const apple =
      platform.id === "apple_music" ? await fetchAppleMusicMeta(urlStr) : null;
    const og = await fetchOgMeta(urlStr);
    const title = pickBestTitle(urlStr, [apple?.title, og.title]);
    return NextResponse.json({
      title,
      thumbnailUrl: apple?.thumbnailUrl || og.thumbnailUrl || localThumb,
    } satisfies MetaPayload);
  } catch {
    return NextResponse.json(
      {
        title: pickBestTitle(parsed.toString(), []),
        thumbnailUrl: localThumb,
      } satisfies MetaPayload,
      { status: 200 },
    );
  }
}
