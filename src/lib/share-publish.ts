import type { ProfilePage } from "@/lib/types";
import { encodeSharedPage } from "@/lib/share-codec";
import { isUuid, QR_URL_MAX_CHARS } from "@/lib/share-limits";

export type ResolvedQrTarget =
  | { kind: "ready"; path: string }
  | { kind: "pending" }
  | { kind: "too_long" }
  | { kind: "error"; message: string };

type ShareApiOk = { id: string; path: string };
type ShareApiErr = { error: string };

const SHORT_PATH_STORAGE_KEY = "intro-qr-short-paths-v1";
const SHORT_PATH_CACHE_LIMIT = 30;

const memoryCache = new Map<string, string>();

type ShortPathEntry = { hash: string; path: string };

function isShortPath(path: string): boolean {
  return path.startsWith("/u/") && isUuid(path.slice(3));
}

function loadStoredEntries(): ShortPathEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SHORT_PATH_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is ShortPathEntry => {
      if (!entry || typeof entry !== "object") return false;
      const candidate = entry as ShortPathEntry;
      return (
        typeof candidate.hash === "string" &&
        typeof candidate.path === "string" &&
        isShortPath(candidate.path)
      );
    });
  } catch {
    return [];
  }
}

function readStoredPath(hash: string): string | undefined {
  return loadStoredEntries().find((entry) => entry.hash === hash)?.path;
}

function writeStoredPath(hash: string, path: string) {
  if (typeof window === "undefined") return;
  const entries = loadStoredEntries().filter((entry) => entry.hash !== hash);
  entries.push({ hash, path });
  const trimmed = entries.slice(-SHORT_PATH_CACHE_LIMIT);
  try {
    window.localStorage.setItem(
      SHORT_PATH_STORAGE_KEY,
      JSON.stringify(trimmed),
    );
  } catch {
    // 容量超過でも、このセッションのメモリキャッシュで QR は出せる
  }
}

function rememberShortPath(hash: string, path: string) {
  memoryCache.set(hash, path);
  writeStoredPath(hash, path);
}

function recallShortPath(hash: string): string | undefined {
  const memory = memoryCache.get(hash);
  if (memory && isShortPath(memory)) return memory;
  const stored = readStoredPath(hash);
  if (stored) memoryCache.set(hash, stored);
  return stored;
}

async function hashContent(token: string): Promise<string> {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

/** テストがキャッシュを共有しないようにする */
export function resetShortPathCacheForTests() {
  memoryCache.clear();
}

function inlineUrlFor(page: ProfilePage, origin: string): string {
  const path = `/s/${encodeSharedPage(page)}`;
  return origin ? `${origin}${path}` : path;
}

/** ホーム QR 用の短いパスを決める（必要ならサーバーにスナップショット保存） */
export async function resolveQrPath(
  page: ProfilePage,
  origin: string,
): Promise<ResolvedQrTarget> {
  if (page.cloudId && isUuid(page.cloudId)) {
    return { kind: "ready", path: `/u/${page.cloudId}` };
  }

  const inlineUrl = inlineUrlFor(page, origin);
  if (inlineUrl.length <= QR_URL_MAX_CHARS) {
    return { kind: "ready", path: `/s/${encodeSharedPage(page)}` };
  }

  const token = encodeSharedPage(page);
  const hash = await hashContent(token);
  const cached = recallShortPath(hash);
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
    if (!res.ok || !data.path || !isShortPath(data.path)) {
      return {
        kind: "error",
        message: data.error || "share_failed",
      };
    }
    rememberShortPath(hash, data.path);
    return { kind: "ready", path: data.path };
  } catch (e) {
    return {
      kind: "error",
      message: e instanceof Error ? e.message : "share_failed",
    };
  }
}
