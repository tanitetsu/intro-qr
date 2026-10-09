"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppData } from "@/lib/app-data";
import { useI18n } from "@/lib/i18n/locale";
import {
  addLinkToPage,
  getPageById,
  removeLinkFromPage,
  upsertPage,
} from "@/lib/storage";
import { detectLinkType, guessTitleFromUrl } from "@/lib/link-meta";
import { syncPageToCloud } from "@/lib/supabase/auto-sync";
import type { AppData, ProfilePage } from "@/lib/types";

const SYNC_DEBOUNCE_MS = 900;

export function EditPageClient({ pageId }: { pageId: string }) {
  const { ready, data, setData } = useAppData();
  const { t } = useI18n();
  const page = useMemo(
    () => (ready ? getPageById(data, pageId) : null),
    [ready, data, pageId],
  );

  const [url, setUrl] = useState("");
  const [comment, setComment] = useState("");
  const [syncHint, setSyncHint] = useState("");

  const dataRef = useRef(data);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tRef = useRef(t);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    tRef.current = t;
  }, [t]);

  useEffect(() => {
    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, []);

  function scheduleCloudSync(targetPageId: string) {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      const current = dataRef.current;
      const latest = getPageById(current, targetPageId);
      if (!latest) return;
      const result = await syncPageToCloud(current, latest);
      if (result.error === "not_logged_in") {
        setSyncHint(tRef.current("pages.syncLogin"));
        return;
      }
      if (result.error) return;
      setData(result.data);
      setSyncHint(tRef.current("pages.syncOk"));
    }, SYNC_DEBOUNCE_MS);
  }

  function commit(next: AppData) {
    dataRef.current = next;
    setData(next);
    scheduleCloudSync(pageId);
  }

  function patchPage(patch: Partial<ProfilePage>) {
    if (!page) return;
    commit(
      upsertPage(data, {
        ...page,
        ...patch,
        updatedAt: new Date().toISOString(),
      }),
    );
  }

  if (!ready) {
    return <div className="p-4 text-sm text-zinc-500">{t("common.loading")}</div>;
  }

  if (!page) {
    return (
      <div className="space-y-3 p-4">
        <p className="text-sm text-zinc-600">{t("edit.notFound")}</p>
        <Link href="/" className="text-sm text-violet-700">
          {t("common.home")}
        </Link>
      </div>
    );
  }

  const previewHref = page.cloudId ? `/u/${page.cloudId}` : `/u/${page.id}`;
  const defaultLinkTitle = t("edit.defaultLinkTitle");

  return (
    <div className="space-y-5 p-4">
      <div>
        <h1 className="text-xl font-bold">{t("edit.title")}</h1>
        {page.cloudId ? (
          <Link
            href={previewHref}
            className="mt-1 inline-block text-xs text-zinc-400 underline-offset-2 hover:underline"
          >
            {t("common.preview")}
          </Link>
        ) : null}
      </div>

      {syncHint ? (
        <p className="rounded-xl bg-zinc-100 px-3 py-2 text-xs text-zinc-700">
          {syncHint}
        </p>
      ) : null}

      <section className="space-y-3 rounded-2xl border border-black/8 bg-white p-4">
        <label className="block space-y-1">
          <span className="text-xs font-medium text-zinc-500">
            {t("edit.pageName")}
          </span>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            value={page.title}
            onChange={(e) => patchPage({ title: e.target.value })}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-zinc-500">
            {t("edit.displayName")}
          </span>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            value={page.displayName}
            onChange={(e) => patchPage({ displayName: e.target.value })}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-zinc-500">
            {t("edit.bio")}
          </span>
          <textarea
            className="min-h-20 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            value={page.bio ?? ""}
            onChange={(e) => patchPage({ bio: e.target.value })}
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={page.isDefault}
            onChange={(e) => patchPage({ isDefault: e.target.checked })}
          />
          {t("edit.setDefault")}
        </label>
      </section>

      <section className="space-y-3 rounded-2xl border border-black/8 bg-white p-4">
        <h2 className="text-sm font-semibold">{t("edit.addLink")}</h2>
        <input
          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          placeholder={t("edit.linkComment")}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          type="button"
          className="w-full rounded-xl bg-violet-600 px-3 py-2.5 text-sm font-medium text-white"
          onClick={() => {
            const trimmedUrl = url.trim();
            if (!trimmedUrl) {
              alert(t("edit.urlRequired"));
              return;
            }
            commit(
              addLinkToPage(data, page.id, {
                title: guessTitleFromUrl(trimmedUrl, defaultLinkTitle),
                url: trimmedUrl,
                comment: comment.trim() || undefined,
                type: detectLinkType(trimmedUrl),
              }),
            );
            setUrl("");
            setComment("");
          }}
        >
          {t("edit.addLink")}
        </button>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">{t("edit.savedLinks")}</h2>
        {page.links.length === 0 ? (
          <p className="text-sm text-zinc-500">{t("edit.noneYet")}</p>
        ) : (
          [...page.links]
            .sort((a, b) => a.order - b.order)
            .map((link) => (
              <div
                key={link.id}
                className="rounded-2xl border border-black/8 bg-white p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="break-all text-sm font-semibold">{link.url}</p>
                    {link.comment ? (
                      <p className="mt-1 text-xs text-zinc-500">{link.comment}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="shrink-0 text-xs font-medium text-red-600"
                    onClick={() =>
                      commit(removeLinkFromPage(data, page.id, link.id))
                    }
                  >
                    {t("common.delete")}
                  </button>
                </div>
              </div>
            ))
        )}
      </section>
    </div>
  );
}
