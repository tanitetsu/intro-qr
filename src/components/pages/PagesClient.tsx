"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAppData } from "@/lib/app-data";
import { createEmptyPage, deletePage, upsertPage } from "@/lib/storage";
import { syncAllPagesToCloud } from "@/lib/supabase/auto-sync";

export function PagesClient() {
  const { ready, pages, data, setData } = useAppData();
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
        setSyncHint("クラウドへ自動同期しました");
      } else if (result.error === "not_logged_in") {
        setSyncHint("ログインすると自動でクラウド同期されます");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, pages.length, data, setData]);

  if (!ready) {
    return <div className="p-4 text-sm text-zinc-500">読み込み中…</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">自己紹介ページ</h1>
          <p className="text-sm text-zinc-600">場に応じて使い分けできます</p>
        </div>
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
                  リンク {page.links.length} 件
                  {page.isDefault ? " · デフォルト" : ""}
                  {page.cloudId ? " · 同期済み" : ""}
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                href={`/pages/${page.id}/edit`}
                className="rounded-xl bg-zinc-900 px-2 py-2 text-center text-xs font-medium text-white"
              >
                編集
              </Link>
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
        ))}
      </div>
    </div>
  );
}
