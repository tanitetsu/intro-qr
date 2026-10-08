"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
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

const listeners = new Set<() => void>();
let cachedData: AppData | null = null;

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getClientSnapshot(): AppData {
  // useSyncExternalStore は「変化がなければ同一参照」を返す必要がある
  if (!cachedData) {
    cachedData = loadAppData();
  }
  return cachedData;
}

function getServerSnapshot(): AppData {
  return EMPTY_DATA;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const data = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const ready = typeof window !== "undefined";

  const setData = useCallback(
    (updater: AppData | ((prev: AppData) => AppData)) => {
      const prev = cachedData ?? loadAppData();
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveAppData(next);
      cachedData = next;
      emitChange();
    },
    [],
  );

  const refresh = useCallback(() => {
    cachedData = loadAppData();
    emitChange();
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
