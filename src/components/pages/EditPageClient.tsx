"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppData } from "@/lib/app-data";
import {
  addLinkToPage,
  getPageById,
  removeLinkFromPage,
  upsertPage,
} from "@/lib/storage";
import { detectLinkType, guessTitleFromUrl, linkTypeLabel } from "@/lib/link-meta";
import { syncPageToCloud } from "@/lib/supabase/auto-sync";
import type { AppData, LinkType, ProfilePage } from "@/lib/types";

const SYNC_DEBOUNCE_MS = 900;

export function EditPageClient({ pageId }: { pageId: string }) {
  const { ready, data, setData } = useAppData();
  const page = useMemo(
    () => (ready ? getPageById(data, pageId) : null),
    [ready, data, pageId],
  );

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [type, setType] = useState<LinkType>("interest");
  const [syncHint, setSyncHint] = useState("");

  const dataRef = useRef(data);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

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
        setSyncHint("ログインすると自動でクラウド同期されます");
        return;
      }
      if (result.error) return;
      setData(result.data);
      setSyncHint("クラウドへ自動同期しました");
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
    return <div className="p-4 text-sm text-zinc-500">読み込み中…</div>;
  }

  if (!page) {
    return (
      <div className="space-y-3 p-4">
        <p className="text-sm text-zinc-600">ページが見つかりません。</p>
        <Link href="/pages" className="text-sm text-violet-700">
          一覧へ戻る
        </Link>
      </div>
    );
  }

  const previewHref = page.cloudId ? `/u/${page.cloudId}` : `/u/${page.id}`;

  return (
    <div className="space-y-5 p-4">
      <div>
        <h1 className="text-xl font-bold">ページ編集</h1>
        <p className="text-sm text-zinc-600">関心リンクを中心に整えます</p>
        {page.cloudId ? (
          <Link
            href={previewHref}
            className="mt-1 inline-block text-xs text-zinc-400 underline-offset-2 hover:underline"
          >
            プレビュー
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
          <span className="text-xs font-medium text-zinc-500">ページ名</span>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            value={page.title}
            onChange={(e) => patchPage({ title: e.target.value })}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-zinc-500">表示名</span>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            value={page.displayName}
            onChange={(e) => patchPage({ displayName: e.target.value })}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-zinc-500">
            自己紹介文（任意・下部補助）
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
          デフォルトページにする
        </label>
      </section>

      <section className="space-y-3 rounded-2xl border border-black/8 bg-white p-4">
        <h2 className="text-sm font-semibold">リンクを追加</h2>
        <input
          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          placeholder="https://..."
          value={url}
          onChange={(e) => {
            const next = e.target.value;
            setUrl(next);
            setType(detectLinkType(next));
            if (!title) setTitle(guessTitleFromUrl(next));
          }}
        />
        <input
          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          placeholder="コメント（任意）"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <select
          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          value={type}
          onChange={(e) => setType(e.target.value as LinkType)}
        >
          {Object.entries(linkTypeLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="w-full rounded-xl bg-violet-600 px-3 py-2.5 text-sm font-medium text-white"
          onClick={() => {
            if (!url.trim()) {
              alert("URLを入力してください");
              return;
            }
            commit(
              addLinkToPage(data, page.id, {
                title: title.trim() || guessTitleFromUrl(url),
                url: url.trim(),
                comment: comment.trim() || undefined,
                type,
              }),
            );
            setUrl("");
            setTitle("");
            setComment("");
            setType("interest");
          }}
        >
          リンクを追加
        </button>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">登録済みリンク</h2>
        {page.links.length === 0 ? (
          <p className="text-sm text-zinc-500">まだありません</p>
        ) : (
          [...page.links]
            .sort((a, b) => a.order - b.order)
            .map((link) => (
              <div
                key={link.id}
                className="rounded-2xl border border-black/8 bg-white p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{link.title}</p>
                    <p className="text-xs text-zinc-500">
                      {linkTypeLabel[link.type]}
                    </p>
                    <p className="mt-1 break-all text-xs text-zinc-400">
                      {link.url}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-medium text-red-600"
                    onClick={() =>
                      commit(removeLinkFromPage(data, page.id, link.id))
                    }
                  >
                    削除
                  </button>
                </div>
              </div>
            ))
        )}
      </section>
    </div>
  );
}
