import type { ProfilePage } from "@/lib/types";
import { encodeSharedPage } from "@/lib/share-codec";
import {
  INLINE_SHARE_MAX_CHARS,
  QR_URL_MAX_CHARS,
} from "@/lib/share-limits";

export type ResolvedQrTarget =
  | { kind: "ready"; path: string }
  | { kind: "pending" }
  | { kind: "too_long" }
  | { kind: "error"; message: string };

type ShareApiOk = { id: string; path: string };
type ShareApiErr = { error: string };

const cache = new Map<string, string>();

function contentKey(page: ProfilePage): string {
  return encodeSharedPage(page);
}

/** ホーム QR 用の短いパスを決める（必要ならサーバーにスナップショット保存） */
export async function resolveQrPath(
  page: ProfilePage,
  origin: string,
): Promise<ResolvedQrTarget> {
  if (page.cloudId) {
    return { kind: "ready", path: `/u/${page.cloudId}` };
  }

  const token = encodeSharedPage(page);
  const inlinePath = `/s/${token}`;
  const inlineUrl = origin ? `${origin}${inlinePath}` : inlinePath;
  if (inlineUrl.length <= INLINE_SHARE_MAX_CHARS) {
    return { kind: "ready", path: inlinePath };
  }

  const key = contentKey(page);
  const cached = cache.get(key);
  if (cached) {
    return { kind: "ready", path: cached };
  }

  try {
    const res = await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: page.title,
        displayName: page.displayName,
        bio: page.bio,
        iconDataUrl: page.iconDataUrl,
        links: page.links,
      }),
      signal: AbortSignal.timeout(15000),
    });
    const data = (await res.json()) as ShareApiOk & ShareApiErr;
    if (!res.ok || !data.id || !data.path) {
      if (inlineUrl.length <= QR_URL_MAX_CHARS) {
        // ぎりぎり QR に載るならフォールバック
        return { kind: "ready", path: inlinePath };
      }
      return {
        kind: "error",
        message: data.error || "share_failed",
      };
    }
    cache.set(key, data.path);
    return { kind: "ready", path: data.path };
  } catch (e) {
    if (inlineUrl.length <= QR_URL_MAX_CHARS) {
      return { kind: "ready", path: inlinePath };
    }
    return {
      kind: "error",
      message: e instanceof Error ? e.message : "share_failed",
    };
  }
}
