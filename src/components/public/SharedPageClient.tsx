"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAppData } from "@/lib/app-data";
import {
  decodeSharedPage,
  encodeSharedPage,
  sharedPayloadToPage,
} from "@/lib/share-codec";
import { useAutoSaveViewedPage } from "@/lib/use-auto-save-viewed-page";
import { ProfileView } from "@/components/links/ProfileView";

export function SharedPageClient({ token }: { token: string }) {
  const { ready, data } = useAppData();
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
        <h1 className="text-xl font-bold">無効な共有リンクです</h1>
        <Link href="/" className="text-sm font-medium text-violet-700">
          ホームへ
        </Link>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-zinc-500">
        読み込み中…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <ProfileView page={page} showPageTitle />
    </div>
  );
}
