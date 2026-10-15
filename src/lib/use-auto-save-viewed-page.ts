"use client";

import { useEffect, useRef, useState } from "react";
import { useAppData } from "@/lib/app-data";
import { suggestMeetingPlace } from "@/lib/geolocation";
import { readStoredLocale } from "@/lib/i18n/locale";
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
): { justSaved: boolean } {
  const { ready, data, setData } = useAppData();
  const done = useRef(false);
  const [justSaved, setJustSaved] = useState(false);
  const flashTimers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      for (const timer of flashTimers.current) window.clearTimeout(timer);
      flashTimers.current = [];
    };
  }, []);

  useEffect(() => {
    if (!ready || !page || done.current || options?.skip) return;
    if (isOwnPage(data, page)) return;
    if (findSavedBySourcePageId(data, page.id)) return;
    if (page.cloudId && findSavedBySourcePageId(data, page.cloudId)) return;
    done.current = true;

    const sourceId = page.cloudId || page.id;
    setData(savePersonFromPage(data, page));

    // 自動保存の短いフィードバック（同期 setState を避け、アンマウント時のみクリア）
    const showId = window.setTimeout(() => {
      setJustSaved(true);
      const hideId = window.setTimeout(() => setJustSaved(false), 2200);
      flashTimers.current.push(hideId);
    }, 0);
    flashTimers.current.push(showId);

    // 位置情報は任意。拒否・失敗しても保存自体は完了済みのまま。
    void (async () => {
      const place = await suggestMeetingPlace(readStoredLocale());
      if (!place) return;
      setData((prev) => {
        const saved = findSavedBySourcePageId(prev, sourceId);
        if (!saved) return prev;
        if (saved.metPlaceAuto || saved.metPlaceManual.trim()) return prev;
        return {
          ...prev,
          savedPeople: prev.savedPeople.map((person) =>
            person.id === saved.id
              ? {
                  ...person,
                  metPlaceAuto: place,
                  metPlaceManual: place,
                }
              : person,
          ),
        };
      });
    })();
  }, [ready, page, data, setData, options?.skip]);

  return { justSaved };
}
