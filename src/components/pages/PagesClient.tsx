"use client";

import { Cloud, CloudOff, Plus, Trash2 } from "lucide-react";
import { PenLine } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IconButton, IconLink } from "@/components/ui/IconButton";
import { useAppData } from "@/lib/app-data";
import { useI18n } from "@/lib/i18n/locale";
import {
  applyCloudIdsToPages,
  createEmptyPage,
  deletePage,
  upsertPage,
} from "@/lib/storage";
import { syncAllPagesToCloud } from "@/lib/supabase/auto-sync";

export function PagesClient() {
  const { ready, pages, data, setData } = useAppData();
  const { t } = useI18n();
  const [syncState, setSyncState] = useState<"idle" | "ok" | "login">("idle");
  const syncedOnce = useRef(false);

  useEffect(() => {
    if (!ready || syncedOnce.current || !pages.length) return;
    syncedOnce.current = true;
    let cancelled = false;
    (async () => {
      const result = await syncAllPagesToCloud(data);
      if (cancelled) return;
      if (result.synced > 0) {
        setData((prev) => applyCloudIdsToPages(prev, result.syncs));
        setSyncState("ok");
      } else if (result.error === "not_logged_in") {
        setSyncState("login");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, pages.length, data, setData]);

  if (!ready) {
    return <div className="p-4 text-sm text-zinc-500">{t("common.loading")}</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="sr-only">{t("pages.title")}</h1>
        <div className="flex min-h-11 items-center gap-2 text-zinc-500">
          {syncState === "ok" ? (
            <span
              className="inline-flex items-center gap-1.5 text-emerald-700"
              title={t("pages.syncOk")}
            >
              <Cloud className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              <span className="sr-only">{t("pages.syncOk")}</span>
            </span>
          ) : null}
          {syncState === "login" ? (
            <IconLink href="/auth" label={t("pages.syncLogin")} tone="ghost">
              <CloudOff className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </IconLink>
          ) : null}
        </div>
        <IconButton
          label={t("common.add")}
          tone="primary"
          onClick={() => {
            const page = createEmptyPage(
              t("pages.newTitle", { n: pages.length + 1 }),
              t("edit.defaultDisplayName"),
            );
            if (!pages.length) page.isDefault = true;
            setData(upsertPage(data, page));
          }}
        >
          <Plus className="h-5 w-5" strokeWidth={2.25} aria-hidden />
        </IconButton>
      </div>

      <div className="space-y-3">
        {pages.map((page) => (
          <div
            key={page.id}
            className="flex items-center gap-2 rounded-2xl border border-black/8 bg-white p-3 shadow-sm"
          >
            <div className="min-w-0 flex-1 px-1">
              <p className="truncate font-semibold text-zinc-900">
                {page.displayName}
              </p>
              <p className="truncate text-xs text-zinc-500">{page.title}</p>
              <p className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                <span aria-label={t("pages.linkCount", { count: page.links.length })}>
                  {page.links.length}
                </span>
                {page.isDefault ? (
                  <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                    ★
                  </span>
                ) : null}
                {page.cloudId ? (
                  <Cloud
                    className="h-3.5 w-3.5 text-emerald-600"
                    strokeWidth={2}
                    aria-label={t("common.synced")}
                  />
                ) : null}
              </p>
            </div>
            <IconLink
              href={`/pages/${page.id}/edit`}
              label={t("common.edit")}
              tone="neutral"
            >
              <PenLine className="h-5 w-5" strokeWidth={2} aria-hidden />
            </IconLink>
            <IconButton
              label={t("common.delete")}
              tone="danger"
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
              <Trash2 className="h-4 w-4" strokeWidth={2} aria-hidden />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
}
