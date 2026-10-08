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
          const cloudPath = page.cloudId ? `/u/${page.cloudId}` : null;
          const shareToken = encodeSharedPage(page);
          const sharePath = `/s/${shareToken}`;
          const qrPath = cloudPath ?? sharePath;
          const qrUrl = origin ? `${origin}${qrPath}` : qrPath;
          return (
            <div className="space-y-3">
              <QrCard
                value={qrUrl}
                title={page.title}
                subtitle={
                  cloudPath
                    ? `${page.displayName}（クラウド公開）`
                    : `${page.displayName}（一時共有）`
                }
              />
              {!cloudPath ? (
                <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  まだクラウド未同期です。他端末向け本公開は「ページ」タブでログイン後に同期してください。
                </p>
              ) : (
                <div className="space-y-2 rounded-xl bg-emerald-50 px-3 py-2">
                  <p className="text-xs font-medium text-emerald-800">
                    本番公開URL（これを共有）
                  </p>
                  <p className="break-all text-[11px] text-emerald-900">{qrUrl}</p>
                  <button
                    type="button"
                    className="w-full rounded-lg bg-emerald-700 px-3 py-2 text-xs font-medium text-white"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(qrUrl);
                        alert("公開URLをコピーしました");
                      } catch {
                        alert(qrUrl);
                      }
                    }}
                  >
                    URLをコピー
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <Link
                  href={cloudPath ?? `/u/${page.id}`}
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
