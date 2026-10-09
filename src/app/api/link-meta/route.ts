import { NextResponse } from "next/server";
import {
  extractYoutubeVideoId,
  resolveLinkThumbnail,
} from "@/lib/link-meta";

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

  const title = rawTitle
    ?.replace(/\s+/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();

  return {
    title: title || undefined,
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

  try {
    if (extractYoutubeVideoId(parsed.toString())) {
      const yt = await fetchYoutubeOEmbed(parsed.toString());
      return NextResponse.json({
        title: yt?.title,
        thumbnailUrl: yt?.thumbnailUrl || localThumb,
      } satisfies MetaPayload);
    }

    const og = await fetchOgMeta(parsed.toString());
    return NextResponse.json({
      title: og.title,
      thumbnailUrl: og.thumbnailUrl || localThumb,
    } satisfies MetaPayload);
  } catch {
    return NextResponse.json(
      { thumbnailUrl: localThumb } satisfies MetaPayload,
      { status: 200 },
    );
  }
}
