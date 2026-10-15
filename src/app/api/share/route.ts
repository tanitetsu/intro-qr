import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/client";
import type { ProfileLink } from "@/lib/types";

export const runtime = "nodejs";

type ShareBody = {
  title?: string;
  displayName?: string;
  bio?: string;
  iconDataUrl?: string;
  links?: ProfileLink[];
};

function sanitizeLinks(links: ProfileLink[] | undefined) {
  if (!Array.isArray(links)) return [];
  return links.slice(0, 80).map((l, index) => {
    const thumb = l.thumbnailUrl?.trim();
    const thumbnailUrl =
      thumb &&
      (thumb.startsWith("https://") || thumb.startsWith("http://"))
        ? thumb
        : undefined;
    return {
      id: l.id || `link_${index}`,
      title: String(l.title || "Link").slice(0, 120),
      url: String(l.url || "").slice(0, 2000),
      comment: l.comment ? String(l.comment).slice(0, 300) : undefined,
      type: l.type || "other",
      order: l.order ?? index,
      ...(thumbnailUrl ? { thumbnailUrl } : {}),
    };
  });
}

/**
 * 長い /s/ トークンの代わりに、短い /u/{uuid} を発行する。
 * SHARE_BOT_EMAIL / SHARE_BOT_PASSWORD が無い場合は 503。
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "supabase_not_configured" },
      { status: 503 },
    );
  }

  const botEmail = process.env.SHARE_BOT_EMAIL?.trim();
  const botPassword = process.env.SHARE_BOT_PASSWORD?.trim();
  if (!botEmail || !botPassword) {
    return NextResponse.json(
      { error: "share_bot_not_configured" },
      { status: 503 },
    );
  }

  let body: ShareBody;
  try {
    body = (await request.json()) as ShareBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const title = String(body.title || "Shared").slice(0, 120);
  const displayName = String(body.displayName || title).slice(0, 120);
  const bio = body.bio ? String(body.bio).slice(0, 500) : "";
  const links = sanitizeLinks(body.links);
  if (!links.length) {
    return NextResponse.json({ error: "empty_links" }, { status: 400 });
  }

  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) {
    return NextResponse.json(
      { error: "supabase_not_configured" },
      { status: 503 },
    );
  }

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: botEmail,
      password: botPassword,
    });
  if (authError || !authData.user) {
    return NextResponse.json(
      { error: authError?.message || "share_bot_auth_failed" },
      { status: 503 },
    );
  }

  const slug = `share-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  // 本番 DB によっては icon_data_url 未適用のため、共有 API では送らない
  const { data, error } = await supabase
    .from("profile_pages")
    .insert({
      owner_id: authData.user.id,
      title,
      slug,
      display_name: displayName,
      bio,
      links,
      is_default: false,
    })
    .select("id")
    .single();

  // セッションを残さない
  await supabase.auth.signOut();

  if (error || !data?.id) {
    return NextResponse.json(
      { error: error?.message || "insert_failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    id: data.id,
    path: `/u/${data.id}`,
  });
}
