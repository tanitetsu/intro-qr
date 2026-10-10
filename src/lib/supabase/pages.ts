import { getSupabase } from "@/lib/supabase/client";
import type { ProfileLink, ProfilePage } from "@/lib/types";

type DbProfilePage = {
  id: string;
  owner_id: string | null;
  title: string;
  slug: string;
  display_name: string;
  bio: string | null;
  icon_data_url: string | null;
  links: ProfileLink[];
  is_default: boolean;
  created_at: string;
  updated_at: string;
};

function toLocalPage(row: DbProfilePage): ProfilePage {
  return {
    id: row.id,
    cloudId: row.id,
    title: row.title,
    slug: row.slug,
    displayName: row.display_name,
    bio: row.bio ?? "",
    iconDataUrl: row.icon_data_url || undefined,
    links: Array.isArray(row.links) ? row.links : [],
    isDefault: row.is_default,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toDbPayload(page: ProfilePage, ownerId: string) {
  return {
    owner_id: ownerId,
    title: page.title,
    slug: page.slug,
    display_name: page.displayName,
    bio: page.bio ?? "",
    icon_data_url: page.iconDataUrl?.trim() || null,
    links: page.links.map((l, index) => {
      // data: URL は肥大化するため除外。http(s) のサムネ URL は同期する
      const thumb = l.thumbnailUrl?.trim();
      const thumbnailUrl =
        thumb &&
        (thumb.startsWith("https://") || thumb.startsWith("http://"))
          ? thumb
          : undefined;
      return {
        id: l.id,
        title: l.title,
        url: l.url,
        comment: l.comment,
        type: l.type,
        order: l.order ?? index,
        ...(thumbnailUrl ? { thumbnailUrl } : {}),
      };
    }),
    is_default: page.isDefault,
    updated_at: new Date().toISOString(),
  };
}

export async function fetchCloudPage(cloudId: string): Promise<ProfilePage | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("profile_pages")
    .select("*")
    .eq("id", cloudId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return toLocalPage(data as DbProfilePage);
}

export async function upsertCloudPage(
  page: ProfilePage,
  ownerId: string,
): Promise<ProfilePage> {
  const supabase = getSupabase();
  const payload = toDbPayload(page, ownerId);

  if (page.cloudId) {
    const { data, error } = await supabase
      .from("profile_pages")
      .update(payload)
      .eq("id", page.cloudId)
      .eq("owner_id", ownerId)
      .select("*")
      .single();
    if (error) throw error;
    return toLocalPage(data as DbProfilePage);
  }

  const { data, error } = await supabase
    .from("profile_pages")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return toLocalPage(data as DbProfilePage);
}

export async function getCurrentUserId(): Promise<string | null> {
  const supabase = getSupabase();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}
