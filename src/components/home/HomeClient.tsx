"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAppData } from "@/lib/app-data";
import { setActivePageId } from "@/lib/storage";
import { encodeSharedPage } from "@/lib/share-codec";
import { PageCarousel } from "@/components/swipe/PageCarousel";
import { QrCard } from "@/components/qr/QrCard";

export function HomeClient() {
  const { ready, pages, activePage, data, setData } = useAppData();

  const origin = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.origin;
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-sm text-zinc-500">
        読み込み中…
      </div>
    );
  }

  if (!pages.length || !activePage) {
    return (
      <div className="space-y-4 p-4">
        <h1 className="text-xl font-bold">自己紹介QR</h1>
        <p className="text-sm text-zinc-600">
          まだページがありません。先に自己紹介ページを作成してください。
        </p>
        <Link
          href="/pages"
          className="inline-flex rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white"
        >
          ページを作る
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      <div className="flex items-end justify-between px-4">
        <div>
          <p className="text-xs font-medium text-violet-700">Intro QR</p>
          <h1 className="text-xl font-bold tracking-tight">今すぐ見せる</h1>
        </div>
        <Link
          href={`/pages/${activePage.id}/edit`}
          className="text-sm font-medium text-violet-700"
        >
          編集
        </Link>
      </div>

      <PageCarousel
        items={pages.map((p) => ({ id: p.id, label: p.title }))}
        activeId={activePage.id}
        onChange={(id) => setData(setActivePageId(data, id))}
        renderItem={(id) => {
          const page = pages.find((p) => p.id === id);
          if (!page) return null;
          const shareToken = encodeSharedPage(page);
          const shareUrl = origin
            ? `${origin}/s/${shareToken}`
            : `/s/${shareToken}`;
          return (
            <div className="space-y-3">
              <QrCard
                value={shareUrl}
                title={page.title}
                subtitle={`${page.displayName} の自己紹介`}
              />
              <div className="flex gap-2">
                <Link
                  href={`/u/${page.id}`}
                  className="flex-1 rounded-2xl border border-black/10 bg-white px-3 py-3 text-center text-sm font-medium"
                >
                  ページを見る
                </Link>
                <Link
                  href={`/pages/${page.id}/edit`}
                  className="flex-1 rounded-2xl bg-zinc-900 px-3 py-3 text-center text-sm font-medium text-white"
                >
                  リンク編集
                </Link>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
