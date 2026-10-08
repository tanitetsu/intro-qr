"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppData } from "@/lib/app-data";
import { getPageById } from "@/lib/storage";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { fetchCloudPage } from "@/lib/supabase/pages";
import { useAutoSaveViewedPage } from "@/lib/use-auto-save-viewed-page";
import { ProfileView } from "@/components/links/ProfileView";
import type { ProfilePage } from "@/lib/types";

export function CloudOrLocalPublicPage({ pageId }: { pageId: string }) {
  const { ready, data } = useAppData();
  const [page, setPage] = useState<ProfilePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useAutoSaveViewedPage(page);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      const local = ready ? getPageById(data, pageId) : null;
      if (local) {
        if (!cancelled) {
          setPage(local);
          setLoading(false);
        }
        return;
      }
      if (!isSupabaseConfigured()) {
        if (!cancelled) {
          setPage(null);
          setLoading(false);
        }
        return;
      }
      try {
        const cloud = await fetchCloudPage(pageId);
        if (!cancelled) {
          setPage(cloud);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "読み込みに失敗しました");
          setLoading(false);
        }
      }
    }
    if (ready) void load();
    return () => {
      cancelled = true;
    };
  }, [ready, data, pageId]);

  if (!ready || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-zinc-500">
        読み込み中…
      </div>
    );
  }

  if (!page) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col justify-center gap-3 p-6">
        <h1 className="text-xl font-bold">ページが見つかりません</h1>
        <p className="text-sm text-zinc-600">
          {error ||
            "クラウド未公開か、URLが古い可能性があります。持ち主がログインしてページを編集すると自動同期されます。"}
        </p>
        <Link href="/" className="text-sm font-medium text-violet-700">
          ホームへ
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <ProfileView page={page} showPageTitle />
    </div>
  );
}
