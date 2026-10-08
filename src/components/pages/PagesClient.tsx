"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppData } from "@/lib/app-data";
import {
  createEmptyPage,
  deletePage,
  setActivePageId,
  upsertPage,
} from "@/lib/storage";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getCurrentUserId, upsertCloudPage } from "@/lib/supabase/pages";

export function PagesClient() {
  const { ready, pages, data, setData, activePage } = useAppData();
  const [syncMessage, setSyncMessage] = useState("");
  const [syncingId, setSyncingId] = useState<string | null>(null);

  if (!ready) {
    return <div className="p-4 text-sm text-zinc-500">読み込み中…</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">自己紹介ページ</h1>
          <p className="text-sm text-zinc-600">
            場に応じて使い分けできます
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/auth" className="text-xs font-medium text-violet-700">
            ログイン
          </Link>
          <button
            type="button"
            className="rounded-full bg-violet-600 px-3 py-2 text-sm font-medium text-white"
            onClick={() => {
              const page = createEmptyPage(`ページ ${pages.length + 1}`);
              if (!pages.length) page.isDefault = true;
              setData(upsertPage(data, page));
            }}
          >
            追加
          </button>
        </div>
      </div>

      {syncMessage ? (
        <p className="rounded-xl bg-zinc-100 px-3 py-2 text-xs text-zinc-700">
          {syncMessage}
        </p>
      ) : null}

      <div className="space-y-3">
        {pages.map((page) => {
          const selected = activePage?.id === page.id;
          return (
            <div
              key={page.id}
              className={`rounded-2xl border bg-white p-4 shadow-sm ${
                selected ? "border-violet-400" : "border-black/8"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-zinc-900">{page.title}</p>
                  <p className="text-sm text-zinc-600">{page.displayName}</p>
                  <p className="mt-1 text-xs text-zinc-400">
                    リンク {page.links.length} 件
                    {page.isDefault ? " · デフォルト" : ""}
                  </p>
                </div>
                {selected ? (
                  <span className="rounded-full bg-violet-50 px-2 py-1 text-[11px] font-medium text-violet-700">
                    表示中
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-[11px] text-zinc-400">
                {page.cloudId ? `クラウド同期済み` : "クラウド未同期"}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="rounded-xl bg-zinc-900 px-2 py-2 text-xs font-medium text-white"
                  onClick={() => setData(setActivePageId(data, page.id))}
                >
                  QRに使う
                </button>
                <Link
                  href={`/pages/${page.id}/edit`}
                  className="rounded-xl border border-black/10 px-2 py-2 text-center text-xs font-medium"
                >
                  編集
                </Link>
                <button
                  type="button"
                  disabled={syncingId === page.id}
                  className="rounded-xl bg-violet-600 px-2 py-2 text-xs font-medium text-white disabled:opacity-60"
                  onClick={async () => {
                    if (!isSupabaseConfigured()) {
                      setSyncMessage("Supabase設定がありません");
                      return;
                    }
                    setSyncingId(page.id);
                    setSyncMessage("");
                    try {
                      const userId = await getCurrentUserId();
                      if (!userId) {
                        setSyncMessage("先にログインしてください（右上）");
                        setSyncingId(null);
                        return;
                      }
                      const cloud = await upsertCloudPage(page, userId);
                      setData((prev) =>
                        upsertPage(prev, {
                          ...page,
                          cloudId: cloud.cloudId,
                          updatedAt: new Date().toISOString(),
                        }),
                      );
                      const publicUrl = `${window.location.origin}/u/${cloud.cloudId}`;
                      setSyncMessage(
                        `「${page.title}」を同期しました。公開URL: ${publicUrl}`,
                      );
                    } catch (e) {
                      const msg =
                        e instanceof Error ? e.message : "同期に失敗しました";
                      setSyncMessage(
                        msg.includes("profile_pages")
                          ? "テーブル未作成です。SQLを実行してください"
                          : msg,
                      );
                    } finally {
                      setSyncingId(null);
                    }
                  }}
                >
                  {syncingId === page.id ? "同期中…" : "クラウド同期"}
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-red-200 px-2 py-2 text-xs font-medium text-red-600"
                  onClick={() => {
                    if (pages.length <= 1) {
                      alert("最後の1ページは削除できません");
                      return;
                    }
                    if (confirm(`「${page.title}」を削除しますか？`)) {
                      setData(deletePage(data, page.id));
                    }
                  }}
                >
                  削除
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
