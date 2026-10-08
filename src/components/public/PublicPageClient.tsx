"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAppData } from "@/lib/app-data";
import { useI18n } from "@/lib/i18n/locale";
import { getPageById } from "@/lib/storage";
import { useAutoSaveViewedPage } from "@/lib/use-auto-save-viewed-page";
import { ProfileView } from "@/components/links/ProfileView";

export function PublicPageClient({ pageId }: { pageId: string }) {
  const { ready, data } = useAppData();
  const { t } = useI18n();
  const page = useMemo(
    () => (ready ? getPageById(data, pageId) : null),
    [ready, data, pageId],
  );

  useAutoSaveViewedPage(page);

  if (!ready) {
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
        <p className="text-sm text-zinc-600">{t("public.localMissing")}</p>
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
