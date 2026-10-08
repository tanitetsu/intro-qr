import type { ProfileLink, ProfilePage } from "@/lib/types";

export type SharedPagePayload = {
  v: 1;
  title: string;
  displayName: string;
  bio?: string;
  links: Array<Pick<ProfileLink, "title" | "url" | "comment" | "type" | "order">>;
};

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  const b64 =
    typeof btoa !== "undefined"
      ? btoa(bin)
      : Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array {
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  if (typeof atob !== "undefined") {
    const bin = atob(padded);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
    return out;
  }
  return new Uint8Array(Buffer.from(padded, "base64"));
}

export function encodeSharedPage(page: ProfilePage): string {
  const payload: SharedPagePayload = {
    v: 1,
    title: page.title,
    displayName: page.displayName,
    bio: page.bio,
    links: [...page.links]
      .sort((a, b) => a.order - b.order)
      .map((l) => ({
        title: l.title,
        url: l.url,
        comment: l.comment,
        type: l.type,
        order: l.order,
      })),
  };
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  return toBase64Url(bytes);
}

export function decodeSharedPage(token: string): SharedPagePayload | null {
  try {
    const bytes = fromBase64Url(token);
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json) as SharedPagePayload;
    if (parsed?.v !== 1 || !parsed.displayName || !Array.isArray(parsed.links)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function sharedPayloadToPage(
  payload: SharedPagePayload,
  id = "shared",
): ProfilePage {
  const ts = new Date().toISOString();
  return {
    id,
    title: payload.title,
    slug: "shared",
    displayName: payload.displayName,
    bio: payload.bio,
    isDefault: false,
    createdAt: ts,
    updatedAt: ts,
    links: payload.links.map((l, index) => ({
      id: `shared_link_${index}`,
      title: l.title,
      url: l.url,
      comment: l.comment,
      type: l.type,
      order: l.order ?? index,
    })),
  };
}
