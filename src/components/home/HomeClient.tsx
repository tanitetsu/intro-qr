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
        <h1 className="text-xl font-bold">QR</h1>
        <p className="text-sm text-zinc-600">ページがありません</p>
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
            <QrCard
              value={qrUrl}
              title={page.title}
              subtitle={page.displayName}
            />
          );
        }}
      />
    </div>
  );
}
