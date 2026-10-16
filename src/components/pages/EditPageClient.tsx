"use client";

import Link from "next/link";
import {
  Eye,
  ImagePlus,
  Plus,
  Star,
  Tag,
  Trash2,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ContactLink } from "@/components/links/ContactLink";
import { PlatformIcon } from "@/components/links/PlatformIcon";
import { IconButton, IconLink } from "@/components/ui/IconButton";
import { useAppData } from "@/lib/app-data";
import { useI18n } from "@/lib/i18n/locale";
import {
  addLinkToPage,
  applyCloudIdToPage,
  getPageById,
  removeLinkFromPage,
  upsertPage,
} from "@/lib/storage";
import {
  detectLinkType,
  displayLinkComment,
  displayLinkTitle,
  fetchLinkMeta,
  getSnsLabel,
  guessTitleFromUrl,
  isContactProfileUrl,
  isPlatformishTitle,
  profileHandleFromUrl,
  resolveLinkThumbnail,
} from "@/lib/link-meta";
import { detectPlatform } from "@/lib/platform";
import { fileToIconDataUrl } from "@/lib/image";
import { syncPageToCloud } from "@/lib/supabase/auto-sync";
import type { AppData, ProfilePage } from "@/lib/types";

const SYNC_DEBOUNCE_MS = 900;
const META_DEBOUNCE_MS = 450;

export function EditPageClient({ pageId }: { pageId: string }) {
  const { ready, data, setData } = useAppData();
  const { t } = useI18n();
  const page = useMemo(
    () => (ready ? getPageById(data, pageId) : null),
    [ready, data, pageId],
  );

  const [url, setUrl] = useState("");
  const [comment, setComment] = useState("");
  const [resolvedTitle, setResolvedTitle] = useState<string | undefined>();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>();
  const [metaBusy, setMetaBusy] = useState(false);
  const [syncHint, setSyncHint] = useState("");
  const [iconBusy, setIconBusy] = useState(false);
  const iconInputRef = useRef<HTMLInputElement>(null);

  const dataRef = useRef(data);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const metaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const metaRequestId = useRef(0);
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
      if (metaTimer.current) clearTimeout(metaTimer.current);
    };
  }, []);

  function scheduleLinkMeta(nextUrl: string) {
    if (metaTimer.current) clearTimeout(metaTimer.current);
    const trimmed = nextUrl.trim();
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      setThumbnailUrl(undefined);
      setResolvedTitle(undefined);
      setMetaBusy(false);
      return;
    }
    setThumbnailUrl(resolveLinkThumbnail(trimmed));
    setResolvedTitle(undefined);
    const requestId = ++metaRequestId.current;
    setMetaBusy(true);
    metaTimer.current = setTimeout(async () => {
      const meta = await fetchLinkMeta(trimmed);
      if (requestId !== metaRequestId.current) return;
      setThumbnailUrl(meta.thumbnailUrl);
      if (meta.title) {
        setResolvedTitle(meta.title);
      }
      setMetaBusy(false);
    }, META_DEBOUNCE_MS);
  }

  function scheduleCloudSync(targetPageId: string) {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      const current = dataRef.current;
      const latest = getPageById(current, targetPageId);
      if (!latest) return;
      const result = await syncPageToCloud(latest);
      if (result.error === "not_logged_in") {
        setSyncHint(tRef.current("pages.syncLogin"));
        return;
      }
      if (result.error) return;
      if (result.sync) {
        const { localPageId, cloudId } = result.sync;
        setData((prev) => {
          const next = applyCloudIdToPage(prev, localPageId, cloudId);
          dataRef.current = next;
          return next;
        });
      }
      setSyncHint(tRef.current("pages.syncOk"));
    }, SYNC_DEBOUNCE_MS);
  }

  function commit(updater: (prev: AppData) => AppData) {
    setData((prev) => {
      const next = updater(prev);
      dataRef.current = next;
      return next;
    });
    scheduleCloudSync(pageId);
  }

  function patchPage(patch: Partial<ProfilePage>) {
    commit((prev) => {
      const current = getPageById(prev, pageId);
      if (!current) return prev;
      return upsertPage(prev, {
        ...current,
        ...patch,
        updatedAt: new Date().toISOString(),
      });
    });
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
  const iconSrc = page.iconDataUrl?.trim();

  return (
    <div className="space-y-5 p-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="sr-only">{t("edit.title")}</h1>
        <div className="flex items-center gap-2">
          {page.cloudId ? (
            <IconLink href={previewHref} label={t("common.preview")} tone="ghost">
              <Eye className="h-5 w-5" strokeWidth={2} aria-hidden />
            </IconLink>
          ) : null}
          <IconButton
            label={t("edit.setDefault")}
            tone={page.isDefault ? "soft" : "ghost"}
            onClick={() => patchPage({ isDefault: !page.isDefault })}
          >
            <Star
              className="h-5 w-5"
              strokeWidth={2}
              fill={page.isDefault ? "currentColor" : "none"}
              aria-hidden
            />
          </IconButton>
        </div>
        {syncHint ? (
          <p className="text-xs text-zinc-500">{syncHint}</p>
        ) : null}
      </div>

      {/* 相手に見えるプレビュー（名前＝表示名の意味を視覚で固定） */}
      <section className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/60 p-4">
        <div className="flex items-center gap-3">
          {iconSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={iconSrc}
              alt=""
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-zinc-300 ring-1 ring-zinc-200">
              <UserRound className="h-7 w-7" aria-hidden />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-zinc-900">
              {page.displayName || t("edit.defaultDisplayName")}
            </p>
            {page.bio ? (
              <p className="mt-0.5 line-clamp-2 text-xs text-zinc-600">
                {page.bio}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-black/8 bg-white p-4">
        <label className="block space-y-1">
          <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
            <UserRound className="h-3.5 w-3.5" aria-hidden />
            {t("edit.displayName")}
          </span>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            value={page.displayName}
            onChange={(e) => patchPage({ displayName: e.target.value })}
          />
        </label>
        <label className="block space-y-1">
          <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
            <Tag className="h-3.5 w-3.5" aria-hidden />
            {t("edit.pageName")}
          </span>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            value={page.title}
            onChange={(e) => patchPage({ title: e.target.value })}
          />
        </label>
        <div className="space-y-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
            <ImagePlus className="h-3.5 w-3.5" aria-hidden />
            {t("edit.icon")}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {iconSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={iconSrc}
                alt={t("edit.iconAlt")}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : null}
            <IconButton
              label={t("edit.iconChange")}
              tone="neutral"
              disabled={iconBusy}
              onClick={() => iconInputRef.current?.click()}
            >
              <ImagePlus className="h-5 w-5" strokeWidth={2} aria-hidden />
            </IconButton>
            {iconSrc ? (
              <IconButton
                label={t("edit.iconRemove")}
                tone="danger"
                disabled={iconBusy}
                onClick={() => {
                  commit((prev) => {
                    const current = getPageById(prev, pageId);
                    if (!current) return prev;
                    const rest = { ...current };
                    delete rest.iconDataUrl;
                    return upsertPage(prev, {
                      ...rest,
                      updatedAt: new Date().toISOString(),
                    });
                  });
                }}
              >
                <Trash2 className="h-4 w-4" strokeWidth={2} aria-hidden />
              </IconButton>
            ) : null}
          </div>
          <input
            ref={iconInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              void (async () => {
                setIconBusy(true);
                try {
                  const iconDataUrl = await fileToIconDataUrl(file);
                  patchPage({ iconDataUrl });
                } finally {
                  setIconBusy(false);
                }
              })();
            }}
          />
        </div>
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
      </section>

      <section className="space-y-3 rounded-2xl border border-black/8 bg-white p-4">
        <input
          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          placeholder="https://..."
          value={url}
          onChange={(e) => {
            const next = e.target.value;
            setUrl(next);
            scheduleLinkMeta(next);
          }}
        />
        <input
          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          placeholder={t("edit.linkComment")}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {url.trim().startsWith("http") ? (
          <div className="flex items-center gap-2 rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2">
            <PlatformIcon url={url.trim()} />
            <p className="min-w-0 truncate text-sm font-medium text-zinc-800">
              {resolvedTitle ||
                (metaBusy
                  ? t("common.loading")
                  : guessTitleFromUrl(url.trim(), defaultLinkTitle))}
            </p>
          </div>
        ) : null}
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt=""
            className="h-28 w-full rounded-xl object-cover"
          />
        ) : metaBusy ? (
          <p className="text-xs text-zinc-400">{t("common.loading")}</p>
        ) : null}
        <IconButton
          label={t("edit.addLink")}
          tone="primary"
          wide
          onClick={() => {
            const trimmedUrl = url.trim();
            if (!trimmedUrl) {
              alert(t("edit.urlRequired"));
              return;
            }
            const platform = detectPlatform(trimmedUrl);
            let title =
              resolvedTitle?.trim() ||
              guessTitleFromUrl(trimmedUrl, defaultLinkTitle);
            // PF名だけのタイトルは保存しない（コメント側にコンテンツ名があればそちらを採用）
            const note = comment.trim();
            const contact = isContactProfileUrl(trimmedUrl);
            if (
              !contact &&
              isPlatformishTitle(title, platform.label, platform.id) &&
              note &&
              !isPlatformishTitle(note, platform.label, platform.id)
            ) {
              title = note;
            }
            const handle = profileHandleFromUrl(trimmedUrl);
            commit((prev) =>
              addLinkToPage(prev, pageId, {
                title: contact
                  ? handle || getSnsLabel(trimmedUrl) || platform.label
                  : title,
                url: trimmedUrl,
                comment:
                  note && note !== title ? note : undefined,
                type: detectLinkType(trimmedUrl),
                thumbnailUrl: contact
                  ? undefined
                  : thumbnailUrl || resolveLinkThumbnail(trimmedUrl),
              }),
            );
            setUrl("");
            setComment("");
            setResolvedTitle(undefined);
            setThumbnailUrl(undefined);
            metaRequestId.current += 1;
            setMetaBusy(false);
          }}
        >
          <Plus className="h-5 w-5" strokeWidth={2.25} aria-hidden />
        </IconButton>
      </section>

      <section className="space-y-3">
        <h2 className="sr-only">{t("edit.savedLinks")}</h2>
        {page.links.length === 0 ? (
          <p className="text-sm text-zinc-500">{t("edit.noneYet")}</p>
        ) : (
          [...page.links]
            .sort((a, b) => a.order - b.order)
            .map((link) => {
              const isProfile = isContactProfileUrl(link.url);
              const thumb = isProfile
                ? undefined
                : link.thumbnailUrl || resolveLinkThumbnail(link.url);
              const title = displayLinkTitle(link);
              const note = displayLinkComment(link);
              return (
                <div
                  key={link.id}
                  className="overflow-hidden rounded-2xl border border-black/8 bg-white"
                >
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb}
                      alt=""
                      className="h-28 w-full object-cover"
                    />
                  ) : null}
                  <div className="flex items-center justify-between gap-2 p-2">
                    {isProfile ? (
                      <ContactLink url={link.url} />
                    ) : (
                    <div className="flex min-w-0 items-start gap-2 p-1">
                      <PlatformIcon url={link.url} className="mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900">
                          {title}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-zinc-400">
                          {link.url}
                        </p>
                        {note ? (
                          <p className="mt-1 text-xs text-zinc-500">{note}</p>
                        ) : null}
                      </div>
                    </div>
                    )}
                    <IconButton
                      label={t("common.delete")}
                      tone="danger"
                      onClick={() =>
                        commit((prev) =>
                          removeLinkFromPage(prev, pageId, link.id),
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={2} aria-hidden />
                    </IconButton>
                  </div>
                </div>
              );
            })
        )}
      </section>
    </div>
  );
}
