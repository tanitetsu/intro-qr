import { NextResponse } from "next/server";

export const runtime = "nodejs";

const FETCH_TIMEOUT_MS = 4000;
const MAX_HTML_BYTES = 256_000;

function isHttpUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url;
  } catch {
    return null;
  }
}

/** 公開サイトだけ。ローカルや私有アドレスは読まない。 */
function isPublicHost(hostname: string): boolean {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (!host || host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) {
    return false;
  }
  if (host === "::1" || host.startsWith("fe80:") || host.startsWith("fc") || host.startsWith("fd")) {
    return false;
  }
  const v4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const n = v4.slice(1).map(Number);
    if (n.some((part) => part > 255)) return false;
    const [a, b] = n;
    if (a === 10 || a === 127 || a === 0) return false;
    if (a === 169 && b === 254) return false;
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && b === 168) return false;
  }
  return true;
}

function decodeHref(raw: string): string {
  return raw
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function iconFromHtml(html: string, pageUrl: string): string | null {
  const links = html.match(/<link\b[^>]*>/gi) ?? [];
  let apple: string | null = null;
  let icon: string | null = null;
  for (const tag of links) {
    const rel = /rel=["']([^"']+)["']/i.exec(tag)?.[1]?.toLowerCase() ?? "";
    const href = /href=["']([^"']+)["']/i.exec(tag)?.[1];
    if (!href || href.startsWith("data:")) continue;
    const rels = rel.split(/\s+/);
    if (rels.includes("apple-touch-icon") || rels.includes("apple-touch-icon-precomposed")) {
      apple = href;
    } else if (rels.includes("icon") || rels.includes("shortcut")) {
      icon ??= href;
    }
  }
  const chosen = apple || icon;
  if (!chosen) return null;
  try {
    const abs = new URL(decodeHref(chosen), pageUrl);
    if (!isHttpUrl(abs.href) || !isPublicHost(abs.hostname)) return null;
    return abs.href;
  } catch {
    return null;
  }
}

async function readHtml(url: string): Promise<string | null> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    redirect: "follow",
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent":
        "Mozilla/5.0 (compatible; IntroQR/1.0; +https://intro-qr.vercel.app)",
    },
  });
  if (!res.ok) return null;
  const type = res.headers.get("content-type") ?? "";
  if (!type.includes("text/html") && !type.includes("xml")) return null;
  const reader = res.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (total < MAX_HTML_BYTES) {
    const { done, value } = await reader.read();
    if (done || !value) break;
    chunks.push(value);
    total += value.byteLength;
  }
  try {
    await reader.cancel();
  } catch {
    // ignore
  }
  return new TextDecoder("utf-8").decode(Buffer.concat(chunks.map((c) => Buffer.from(c))));
}

export async function GET(request: Request) {
  const pageUrl = new URL(request.url).searchParams.get("url")?.trim() ?? "";
  const parsed = isHttpUrl(pageUrl);
  if (!parsed || !isPublicHost(parsed.hostname)) {
    return NextResponse.json({ src: null }, { status: 400 });
  }
  try {
    const html = await readHtml(parsed.href);
    const src = html ? iconFromHtml(html, parsed.href) : null;
    return NextResponse.json(
      { src },
      {
        status: src ? 200 : 404,
        headers: {
          "Cache-Control": src
            ? "public, max-age=86400"
            : "public, max-age=3600",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { src: null },
      { status: 404, headers: { "Cache-Control": "public, max-age=600" } },
    );
  }
}
