"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAppData } from "@/lib/app-data";
import { useI18n } from "@/lib/i18n/locale";
import { setActivePageId } from "@/lib/storage";
import { resolveQrPath } from "@/lib/share-publish";
import { PageCarousel } from "@/components/swipe/PageCarousel";
import { QrCard } from "@/components/qr/QrCard";
import type { ProfilePage } from "@/lib/types";

function QrForPage({
  page,
  origin,
}: {
  page: ProfilePage;
  origin: string;
}) {
  const { t } = useI18n();
  const [qrUrl, setQrUrl] = useState("");
  const [busy, setBusy] = useState(true);
  const [hint, setHint] = useState("");

  useEffect(() => {
    let cancelled = false;
    setBusy(true);
    setHint("");
    void (async () => {
      const result = await resolveQrPath(page, origin);
      if (cancelled) return;
      if (result.kind === "ready") {
        setQrUrl(origin ? `${origin}${result.path}` : result.path);
        setHint("");
      } else if (result.kind === "error") {
        setQrUrl("");
        setHint(
          result.message === "share_bot_not_configured"
            ? t("qr.needShortShareConfig")
            : t("qr.shortShareFailed"),
        );
      } else {
        setQrUrl("");
        setHint(t("qr.tooLong"));
      }
      setBusy(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [page, origin, t]);

  if (busy) {
    return (
      <div className="flex min-h-[280px] items-center justify-center text-sm text-zinc-500">
        {t("qr.preparing")}
      </div>
    );
  }

  if (!qrUrl) {
    return (
      <div className="space-y-3 px-4 py-8 text-center">
        <p className="text-sm text-zinc-600">{hint || t("qr.tooLong")}</p>
        <Link href="/auth" className="text-sm font-medium text-violet-700">
          {t("qr.loginForShort")}
        </Link>
      </div>
    );
  }

  return (
    <QrCard value={qrUrl} title={page.title} subtitle={page.displayName} />
  );
}

export function HomeClient() {
  const { ready, pages, activePage, data, setData } = useAppData();
  const { t } = useI18n();

  const origin = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.origin;
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-sm text-zinc-500">
        {t("common.loading")}
      </div>
    );
  }

  if (!pages.length || !activePage) {
    return (
      <div className="space-y-4 p-4">
        <h1 className="text-xl font-bold">{t("home.emptyTitle")}</h1>
        <p className="text-sm text-zinc-600">{t("home.emptyBody")}</p>
        <Link
          href="/pages"
          className="inline-flex rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white"
        >
          {t("home.createPage")}
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
          return <QrForPage page={page} origin={origin} />;
        }}
      />
    </div>
  );
}
