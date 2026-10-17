import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { createSeedPages } from "@/lib/seed";
import { encodeSharedPage } from "@/lib/share-codec";
import { QR_URL_MAX_CHARS } from "@/lib/share-limits";
import {
  resetShortPathCacheForTests,
  resolveQrPath,
} from "@/lib/share-publish";
import type { ProfilePage } from "@/lib/types";

const ORIGIN = "https://intro-qr.vercel.app";
const SHORT_ID = "11111111-1111-4111-8111-111111111111";

function page(overrides: Partial<ProfilePage> = {}): ProfilePage {
  return {
    id: "page_test",
    title: "T",
    slug: "t",
    displayName: "A",
    isDefault: false,
    createdAt: "2020-01-01T00:00:00.000Z",
    updatedAt: "2020-01-01T00:00:00.000Z",
    links: [],
    ...overrides,
  };
}

function longPage(): ProfilePage {
  return page({
    displayName: "ゆうと",
    title: "音楽イベント用",
    bio: "x".repeat(80),
    links: [
      {
        id: "link_1",
        title: "YouTube",
        url: "https://www.youtube.com/watch?v=abcdefghijk",
        comment: "ライブ映像",
        type: "interest",
        order: 0,
      },
    ],
  });
}

const store = new Map<string, string>();

beforeEach(() => {
  resetShortPathCacheForTests();
  store.clear();
  Object.assign(globalThis, {
    window: {
      localStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => {
          store.set(key, value);
        },
      },
    },
  });
});

afterEach(() => {
  Reflect.deleteProperty(globalThis, "window");
});

test("cloud id is already a short /u path", async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    throw new Error("should not fetch");
  };
  const withCloud = page({ ...longPage(), cloudId: SHORT_ID });
  const cloudResult = await resolveQrPath(withCloud, ORIGIN);
  assert.equal(cloudResult.kind, "ready");
  if (cloudResult.kind === "ready") {
    assert.equal(cloudResult.path, `/u/${SHORT_ID}`);
  }
  assert.equal(calls, 0);
});

test("a tiny page stays inline and under the scan limit", async () => {
  globalThis.fetch = async () => {
    throw new Error("should not fetch");
  };
  const tiny = page();
  const url = `${ORIGIN}/s/${encodeSharedPage(tiny)}`;
  assert.ok(url.length <= QR_URL_MAX_CHARS);
  const result = await resolveQrPath(tiny, ORIGIN);
  assert.equal(result.kind, "ready");
  if (result.kind === "ready") {
    assert.equal(`${ORIGIN}${result.path}`.length <= QR_URL_MAX_CHARS, true);
    assert.match(result.path, /^\/s\//);
  }
});

test("a long page becomes /u/{uuid} and is reused", async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return new Response(
      JSON.stringify({ id: SHORT_ID, path: `/u/${SHORT_ID}` }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  };
  const target = longPage();
  const inline = `${ORIGIN}/s/${encodeSharedPage(target)}`;
  assert.ok(inline.length > QR_URL_MAX_CHARS);

  const first = await resolveQrPath(target, ORIGIN);
  const second = await resolveQrPath(target, ORIGIN);
  assert.equal(first.kind, "ready");
  assert.deepEqual(second, first);
  if (first.kind === "ready") {
    assert.equal(first.path, `/u/${SHORT_ID}`);
    assert.ok(`${ORIGIN}${first.path}`.length <= QR_URL_MAX_CHARS);
  }
  assert.equal(calls, 1);
  assert.match(store.get("intro-qr-short-paths-v1") ?? "", new RegExp(SHORT_ID));
});

test("a stored short path is reused without another request", async () => {
  const target = longPage();
  const token = encodeSharedPage(target);
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );
  const hash = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  store.set(
    "intro-qr-short-paths-v1",
    JSON.stringify([{ hash, path: `/u/${SHORT_ID}` }]),
  );
  globalThis.fetch = async () => {
    throw new Error("should not fetch");
  };
  const result = await resolveQrPath(target, ORIGIN);
  assert.deepEqual(result, { kind: "ready", path: `/u/${SHORT_ID}` });
});

test("share failure does not fall back to a long /s URL", async () => {
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ error: "share_bot_not_configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  const result = await resolveQrPath(longPage(), ORIGIN);
  assert.deepEqual(result, {
    kind: "error",
    message: "share_bot_not_configured",
  });
});

test("seed pages are too long to embed in a QR", () => {
  for (const seed of createSeedPages()) {
    const url = `${ORIGIN}/s/${encodeSharedPage(seed)}`;
    assert.ok(url.length > QR_URL_MAX_CHARS, seed.title);
  }
});
