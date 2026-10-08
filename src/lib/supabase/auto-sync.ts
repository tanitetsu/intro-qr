import type { AppData, ProfilePage } from "@/lib/types";
import { upsertPage } from "@/lib/storage";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getCurrentUserId, upsertCloudPage } from "@/lib/supabase/pages";

export async function syncPageToCloud(
  data: AppData,
  page: ProfilePage,
): Promise<{ data: AppData; cloudId?: string; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { data, error: "not_configured" };
  }
  const userId = await getCurrentUserId();
  if (!userId) {
    return { data, error: "not_logged_in" };
  }
  try {
    const cloud = await upsertCloudPage(page, userId);
    const next = upsertPage(data, {
      ...page,
      cloudId: cloud.cloudId,
      updatedAt: new Date().toISOString(),
    });
    return { data: next, cloudId: cloud.cloudId ?? undefined };
  } catch (e) {
    return {
      data,
      error: e instanceof Error ? e.message : "sync_failed",
    };
  }
}

export async function syncAllPagesToCloud(
  data: AppData,
): Promise<{ data: AppData; synced: number; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { data, synced: 0, error: "not_configured" };
  }
  const userId = await getCurrentUserId();
  if (!userId) {
    return { data, synced: 0, error: "not_logged_in" };
  }

  let current = data;
  let synced = 0;
  for (const page of current.pages) {
    try {
      const cloud = await upsertCloudPage(page, userId);
      current = upsertPage(current, {
        ...page,
        cloudId: cloud.cloudId,
        updatedAt: new Date().toISOString(),
      });
      synced += 1;
    } catch {
      // continue other pages
    }
  }
  return { data: current, synced };
}
