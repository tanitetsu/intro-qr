"use client";

import Link from "next/link";
import { Plus, QrCode } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAppData } from "@/lib/app-data";
import { useI18n } from "@/lib/i18n/locale";
import { setActivePageId } from "@/lib/storage";
import { resolveQrPath } from "@/lib/share-publish";
import { PageCarousel } from "@/components/swipe/PageCarousel";
import { QrCard } from "@/components/qr/QrCard";
import { IconLink } from "@/components/ui/IconButton";
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
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="sr-only">{t("home.emptyTitle")}</h1>
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-50 text-violet-700">
          <QrCode className="h-10 w-10" strokeWidth={1.75} aria-hidden />
        </div>
        <p className="text-sm text-zinc-600">{t("home.emptyBody")}</p>
        <IconLink href="/pages" label={t("home.createPage")} tone="primary">
          <Plus className="h-5 w-5" strokeWidth={2.25} aria-hidden />
        </IconLink>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-6rem)] flex-col justify-center py-4">
      <PageCarousel
        items={pages.map((p) => ({ id: p.id, label: p.title }))}
        activeId={activePage.id}
        onChange={(id) => setData(setActivePageId(data, id))}
        renderItem={(id) => {
          const page = pages.find((p) => p.id === id);
          if (!page) return null;
          return <QrForPage key={page.id} page={page} origin={origin} />;
        }}
      />
    </div>
  );
}
