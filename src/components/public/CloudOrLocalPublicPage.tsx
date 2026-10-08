"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppData } from "@/lib/app-data";
import { useI18n } from "@/lib/i18n/locale";
import { getPageById } from "@/lib/storage";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { fetchCloudPage } from "@/lib/supabase/pages";
import { useAutoSaveViewedPage } from "@/lib/use-auto-save-viewed-page";
import { ProfileView } from "@/components/links/ProfileView";
import type { ProfilePage } from "@/lib/types";

export function CloudOrLocalPublicPage({ pageId }: { pageId: string }) {
  const { ready, data } = useAppData();
  const { t } = useI18n();
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
          setError(
            e instanceof Error ? e.message : t("public.loadFailed"),
          );
          setLoading(false);
        }
      }
    }
    if (ready) void load();
    return () => {
      cancelled = true;
    };
  }, [ready, data, pageId, t]);

  if (!ready || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-zinc-500">
        {t("common.loading")}
      </div>
    );
  }

  if (!page) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col justify-center gap-3 p-6">
        <h1 className="text-xl font-bold">{t("public.notFound")}</h1>
        <p className="text-sm text-zinc-600">
          {error || t("public.cloudHint")}
        </p>
        <Link href="/" className="text-sm font-medium text-violet-700">
          {t("common.home")}
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
