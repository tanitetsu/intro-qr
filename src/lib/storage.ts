"use client";

import { createSeedData } from "@/lib/seed";
import { createId } from "@/lib/id";
import { toDateString } from "@/lib/dates";
import type { AppData, ProfileLink, ProfilePage, SavedPerson } from "@/lib/types";

const STORAGE_KEY = "intro-qr-app-v1";

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadAppData(): AppData {
  if (!canUseStorage()) return createSeedData();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seed = createSeedData();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    const parsed = JSON.parse(raw) as AppData;
    if (!parsed.pages?.length) {
      const seed = createSeedData();
      saveAppData(seed);
      return seed;
    }
    return parsed;
  } catch {
    const seed = createSeedData();
    saveAppData(seed);
    return seed;
  }
}

export function saveAppData(data: AppData) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getSortedPages(data: AppData): ProfilePage[] {
  return [...data.pages].sort((a, b) => {
    if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
    return a.title.localeCompare(b.title);
  });
}

export function getActivePage(data: AppData): ProfilePage | null {
  const pages = getSortedPages(data);
  if (!pages.length) return null;
  return pages.find((p) => p.id === data.activePageId) ?? pages[0] ?? null;
}

export function getPageById(data: AppData, id: string): ProfilePage | null {
  return (
    data.pages.find((p) => p.id === id || p.cloudId === id) ?? null
  );
}

export function setActivePageId(data: AppData, pageId: string): AppData {
  const next = { ...data, activePageId: pageId };
  saveAppData(next);
  return next;
}

export function upsertPage(data: AppData, page: ProfilePage): AppData {
  const exists = data.pages.some((p) => p.id === page.id);
  const pages = exists
    ? data.pages.map((p) => (p.id === page.id ? page : p))
    : [...data.pages, page];

  const next: AppData = {
    ...data,
    pages: page.isDefault
      ? pages.map((p) => ({ ...p, isDefault: p.id === page.id }))
      : pages,
    activePageId: data.activePageId ?? page.id,
  };
  saveAppData(next);
  return next;
}

export function createEmptyPage(
  title = "New page",
  displayName = "Your name",
): ProfilePage {
  const ts = new Date().toISOString();
  return {
    id: createId("page"),
    title,
    slug: `page-${Date.now().toString(36)}`,
    displayName,
    bio: "",
    links: [],
    isDefault: false,
    createdAt: ts,
    updatedAt: ts,
  };
}

export function deletePage(data: AppData, pageId: string): AppData {
  const pages = data.pages.filter((p) => p.id !== pageId);
  if (pages.length && !pages.some((p) => p.isDefault)) {
    pages[0] = { ...pages[0], isDefault: true };
  }
  const next: AppData = {
    ...data,
    pages,
    activePageId:
      data.activePageId === pageId ? (pages[0]?.id ?? null) : data.activePageId,
  };
  saveAppData(next);
  return next;
}

export function addLinkToPage(
  data: AppData,
  pageId: string,
  link: Omit<ProfileLink, "id" | "order">,
): AppData {
  const page = getPageById(data, pageId);
  if (!page) return data;
  const nextLink: ProfileLink = {
    ...link,
    id: createId("link"),
    order: page.links.length,
  };
  return upsertPage(data, {
    ...page,
    links: [...page.links, nextLink],
    updatedAt: new Date().toISOString(),
  });
}

export function updateLinkInPage(
  data: AppData,
  pageId: string,
  linkId: string,
  patch: Partial<ProfileLink>,
): AppData {
  const page = getPageById(data, pageId);
  if (!page) return data;
  return upsertPage(data, {
    ...page,
    links: page.links.map((l) => (l.id === linkId ? { ...l, ...patch } : l)),
    updatedAt: new Date().toISOString(),
  });
}

export function removeLinkFromPage(
  data: AppData,
  pageId: string,
  linkId: string,
): AppData {
  const page = getPageById(data, pageId);
  if (!page) return data;
  return upsertPage(data, {
    ...page,
    links: page.links
      .filter((l) => l.id !== linkId)
      .map((l, index) => ({ ...l, order: index })),
    updatedAt: new Date().toISOString(),
  });
}

export function getSavedPeopleSorted(data: AppData): SavedPerson[] {
  return [...data.savedPeople].sort((a, b) =>
    a.savedAt < b.savedAt ? 1 : -1,
  );
}

export function findSavedBySourcePageId(
  data: AppData,
  sourcePageId: string,
): SavedPerson | null {
  return data.savedPeople.find((p) => p.sourcePageId === sourcePageId) ?? null;
}

export function savePersonFromPage(
  data: AppData,
  page: ProfilePage,
  input: {
    customName?: string;
    note?: string;
    metPlaceManual?: string;
    metPlaceAuto?: string;
    tags?: string[];
    facePhotoDataUrl?: string;
  } = {},
): AppData {
  const existing =
    findSavedBySourcePageId(data, page.id) ??
    (page.cloudId ? findSavedBySourcePageId(data, page.cloudId) : null);
  if (existing) {
    return data;
  }
  const metPlaceAuto = input.metPlaceAuto?.trim() || undefined;
  const metPlaceManual =
    input.metPlaceManual?.trim() || metPlaceAuto || "";
  const person: SavedPerson = {
    id: createId("saved"),
    sourcePageId: page.cloudId || page.id,
    displayName: page.displayName,
    customName: input.customName?.trim() || page.displayName,
    note: input.note?.trim() || "",
    tags: input.tags ?? [],
    savedOn: toDateString(),
    savedAt: new Date().toISOString(),
    metPlaceAuto,
    metPlaceManual,
    facePhotoDataUrl: input.facePhotoDataUrl,
    snapshot: {
      title: page.title,
      displayName: page.displayName,
      bio: page.bio,
      links: page.links,
    },
  };
  const next = {
    ...data,
    savedPeople: [person, ...data.savedPeople],
  };
  saveAppData(next);
  return next;
}

export function updateSavedPerson(
  data: AppData,
  savedId: string,
  patch: Partial<SavedPerson>,
): AppData {
  const next = {
    ...data,
    savedPeople: data.savedPeople.map((p) =>
      p.id === savedId ? { ...p, ...patch } : p,
    ),
  };
  saveAppData(next);
  return next;
}

/** 公開ページ閲覧中に撮った顔写真を、その相手の保存エントリへ紐づける */
export function setFacePhotoForPage(
  data: AppData,
  page: ProfilePage,
  facePhotoDataUrl: string,
): AppData {
  const existing =
    findSavedBySourcePageId(data, page.id) ??
    (page.cloudId ? findSavedBySourcePageId(data, page.cloudId) : null);
  if (existing) {
    return updateSavedPerson(data, existing.id, { facePhotoDataUrl });
  }
  return savePersonFromPage(data, page, { facePhotoDataUrl });
}

export function deleteSavedPerson(data: AppData, savedId: string): AppData {
  const next = {
    ...data,
    savedPeople: data.savedPeople.filter((p) => p.id !== savedId),
  };
  saveAppData(next);
  return next;
}

export function resetToSeed(): AppData {
  const seed = createSeedData();
  saveAppData(seed);
  return seed;
}

export function isOwnPage(data: AppData, page: ProfilePage): boolean {
  return data.pages.some(
    (p) =>
      p.id === page.id ||
      (!!page.cloudId && p.cloudId === page.cloudId) ||
      (!!p.cloudId && p.cloudId === page.id),
  );
}
