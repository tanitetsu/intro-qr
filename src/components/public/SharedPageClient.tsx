"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAppData } from "@/lib/app-data";
import { useI18n } from "@/lib/i18n/locale";
import {
  decodeSharedPage,
  encodeSharedPage,
  sharedPayloadToPage,
} from "@/lib/share-codec";
import { useAutoSaveViewedPage } from "@/lib/use-auto-save-viewed-page";
import { ProfileView } from "@/components/links/ProfileView";
import { FacePhotoButton } from "@/components/public/FacePhotoButton";

export function SharedPageClient({ token }: { token: string }) {
  const { ready, data } = useAppData();
  const { t } = useI18n();
  const page = useMemo(() => {
    const payload = decodeSharedPage(token);
    return payload
      ? sharedPayloadToPage(payload, `shared_${token.slice(0, 8)}`)
      : null;
  }, [token]);

  const isOwnShared = useMemo(() => {
    if (!ready || !page) return true;
    return data.pages.some((p) => encodeSharedPage(p) === token);
  }, [ready, data.pages, page, token]);

  useAutoSaveViewedPage(page, { skip: isOwnShared });

  if (!page) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-md flex-col justify-center gap-3 p-6">
        <h1 className="text-xl font-bold">{t("public.invalidShare")}</h1>
        <Link href="/" className="text-sm font-medium text-violet-700">
          {t("common.home")}
        </Link>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-zinc-500">
        {t("common.loading")}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <ProfileView page={page} />
      <FacePhotoButton page={page} hidden={isOwnShared} />
    </div>
  );
}
