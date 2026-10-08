"use client";

import { useEffect, useRef } from "react";
import { useAppData } from "@/lib/app-data";
import {
  findSavedBySourcePageId,
  isOwnPage,
  savePersonFromPage,
} from "@/lib/storage";
import type { ProfilePage } from "@/lib/types";

/** 他人の公開ページを開いたら一度だけ自動保存（自分のページはスキップ） */
export function useAutoSaveViewedPage(
  page: ProfilePage | null,
  options?: { skip?: boolean },
) {
  const { ready, data, setData } = useAppData();
  const done = useRef(false);

  useEffect(() => {
    if (!ready || !page || done.current || options?.skip) return;
    if (isOwnPage(data, page)) return;
    if (findSavedBySourcePageId(data, page.id)) return;
    if (page.cloudId && findSavedBySourcePageId(data, page.cloudId)) return;
    done.current = true;
    setData(savePersonFromPage(data, page));
  }, [ready, page, data, setData, options?.skip]);
}
