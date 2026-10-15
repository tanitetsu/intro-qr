import type { AppData, ProfilePage } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getCurrentUserId, upsertCloudPage } from "@/lib/supabase/pages";

export type CloudPageSyncResult = {
  localPageId: string;
  cloudId: string;
};

export async function syncPageToCloud(
  page: ProfilePage,
): Promise<{ sync?: CloudPageSyncResult; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { error: "not_configured" };
  }
  const userId = await getCurrentUserId();
  if (!userId) {
    return { error: "not_logged_in" };
  }
  try {
    const cloud = await upsertCloudPage(page, userId);
    const cloudId = cloud.cloudId ?? cloud.id;
    return {
      sync: { localPageId: page.id, cloudId },
    };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "sync_failed",
    };
  }
}

export async function syncAllPagesToCloud(
  data: AppData,
): Promise<{ syncs: CloudPageSyncResult[]; synced: number; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { syncs: [], synced: 0, error: "not_configured" };
  }
  const userId = await getCurrentUserId();
  if (!userId) {
    return { syncs: [], synced: 0, error: "not_logged_in" };
  }

  const syncs: CloudPageSyncResult[] = [];
  let synced = 0;
  for (const page of data.pages) {
    try {
      const cloud = await upsertCloudPage(page, userId);
      const cloudId = cloud.cloudId ?? cloud.id;
      syncs.push({ localPageId: page.id, cloudId });
      synced += 1;
    } catch {
      // continue other pages
    }
  }
  return { syncs, synced };
}
