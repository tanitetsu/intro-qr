"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAppData } from "@/lib/app-data";
import { useI18n } from "@/lib/i18n/locale";
import { createEmptyPage, deletePage, upsertPage } from "@/lib/storage";
import { syncAllPagesToCloud } from "@/lib/supabase/auto-sync";

export function PagesClient() {
  const { ready, pages, data, setData } = useAppData();
  const { t } = useI18n();
  const [syncHint, setSyncHint] = useState("");
  const syncedOnce = useRef(false);

  useEffect(() => {
    if (!ready || syncedOnce.current || !pages.length) return;
    syncedOnce.current = true;
    let cancelled = false;
    (async () => {
      const result = await syncAllPagesToCloud(data);
      if (cancelled) return;
      if (result.synced > 0) {
        setData(result.data);
        setSyncHint(t("pages.syncOk"));
      } else if (result.error === "not_logged_in") {
        setSyncHint(t("pages.syncLogin"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, pages.length, data, setData, t]);

  if (!ready) {
    return <div className="p-4 text-sm text-zinc-500">{t("common.loading")}</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{t("pages.title")}</h1>
        <button
          type="button"
          className="rounded-full bg-violet-600 px-3 py-2 text-sm font-medium text-white"
          onClick={() => {
            const page = createEmptyPage(
              t("pages.newTitle", { n: pages.length + 1 }),
              t("edit.defaultDisplayName"),
            );
            if (!pages.length) page.isDefault = true;
            setData(upsertPage(data, page));
          }}
        >
          {t("common.add")}
        </button>
      </div>

      {syncHint ? (
        <p className="rounded-xl bg-zinc-100 px-3 py-2 text-xs text-zinc-700">
          {syncHint}
        </p>
      ) : null}

      <div className="space-y-3">
        {pages.map((page) => (
          <div
            key={page.id}
            className="rounded-2xl border border-black/8 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-zinc-900">{page.title}</p>
                <p className="text-sm text-zinc-600">{page.displayName}</p>
                <p className="mt-1 text-xs text-zinc-400">
                  {t("pages.linkCount", { count: page.links.length })}
                  {page.isDefault ? ` · ${t("common.default")}` : ""}
                  {page.cloudId ? ` · ${t("common.synced")}` : ""}
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                href={`/pages/${page.id}/edit`}
                className="rounded-xl bg-zinc-900 px-2 py-2 text-center text-xs font-medium text-white"
              >
                {t("common.edit")}
              </Link>
              <button
                type="button"
                className="rounded-xl border border-red-200 px-2 py-2 text-xs font-medium text-red-600"
                onClick={() => {
                  if (pages.length <= 1) {
                    alert(t("pages.deleteLast"));
                    return;
                  }
                  if (confirm(t("pages.deleteConfirm", { title: page.title }))) {
                    setData(deletePage(data, page.id));
                  }
                }}
              >
                {t("common.delete")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
