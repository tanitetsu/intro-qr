"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getActivePage,
  getSavedPeopleSorted,
  getSortedPages,
  loadAppData,
  saveAppData,
} from "@/lib/storage";
import type { AppData, ProfilePage, SavedPerson } from "@/lib/types";

type AppDataContextValue = {
  ready: boolean;
  data: AppData;
  pages: ProfilePage[];
  activePage: ProfilePage | null;
  savedPeople: SavedPerson[];
  setData: (updater: AppData | ((prev: AppData) => AppData)) => void;
  refresh: () => void;
};

const EMPTY_DATA: AppData = {
  pages: [],
  activePageId: null,
  savedPeople: [],
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [data, setDataState] = useState<AppData>(EMPTY_DATA);

  useEffect(() => {
    // マウント後にだけ localStorage を読む（SSR/ハイドレーションずれ防止）
    const id = window.setTimeout(() => {
      try {
        setDataState(loadAppData());
      } catch {
        setDataState(EMPTY_DATA);
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const setData = useCallback(
    (updater: AppData | ((prev: AppData) => AppData)) => {
      setDataState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        saveAppData(next);
        return next;
      });
    },
    [],
  );

  const refresh = useCallback(() => {
    setDataState(loadAppData());
  }, []);

  const value = useMemo<AppDataContextValue>(
    () => ({
      ready,
      data,
      pages: getSortedPages(data),
      activePage: getActivePage(data),
      savedPeople: getSavedPeopleSorted(data),
      setData,
      refresh,
    }),
    [ready, data, setData, refresh],
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return ctx;
}
