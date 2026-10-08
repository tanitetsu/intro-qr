"use client";

import Link from "next/link";
import { useAppData } from "@/lib/app-data";
import {
  createEmptyPage,
  deletePage,
  setActivePageId,
  upsertPage,
} from "@/lib/storage";

export function PagesClient() {
  const { ready, pages, data, setData, activePage } = useAppData();

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
              <div className="mt-3 grid grid-cols-3 gap-2">
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
