"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAppData } from "@/lib/app-data";
import { savePersonFromPage } from "@/lib/storage";
import {
  decodeSharedPage,
  sharedPayloadToPage,
} from "@/lib/share-codec";
import { ProfileView } from "@/components/links/ProfileView";

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function SharedPageClient({ token }: { token: string }) {
  const { ready, data, setData } = useAppData();
  const page = useMemo(() => {
    const payload = decodeSharedPage(token);
    return payload ? sharedPayloadToPage(payload, `shared_${token.slice(0, 8)}`) : null;
  }, [token]);

  const [open, setOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [metPlaceManual, setMetPlaceManual] = useState("");
  const [note, setNote] = useState("");
  const [facePhotoDataUrl, setFacePhotoDataUrl] = useState<string>();
  const [savedId, setSavedId] = useState<string | null>(null);

  if (!page) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-3 p-6">
        <h1 className="text-xl font-bold">無効な共有リンクです</h1>
        <Link href="/" className="text-sm font-medium text-violet-700">
          ホームへ
        </Link>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-zinc-500">
        読み込み中…
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[linear-gradient(180deg,#f5f3ff_0%,#fafafa_35%,#ffffff_100%)] px-4 py-6">
      <ProfileView page={page} showPageTitle />

      <div className="sticky bottom-4 mt-8 space-y-2">
        {savedId ? (
          <Link
            href={`/saved/${savedId}`}
            className="block rounded-2xl bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg"
          >
            保存しました（詳細を見る）
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => {
              setCustomName(page.displayName);
              setOpen(true);
            }}
            className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-lg"
          >
            この人を保存
          </button>
        )}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 p-4 sm:items-center sm:justify-center">
          <div className="w-full max-w-md space-y-3 rounded-3xl bg-white p-4 shadow-xl">
            <h2 className="text-lg font-bold">相手を保存</h2>
            <input
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              placeholder="名前"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
            <input
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              placeholder="場所・イベント名"
              value={metPlaceManual}
              onChange={(e) => setMetPlaceManual(e.target.value)}
            />
            <textarea
              className="min-h-20 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              placeholder="メモ（任意）"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <label className="block space-y-1 text-sm">
              <span className="text-xs text-zinc-500">顔写真（端末内のみ）</span>
              <input
                type="file"
                accept="image/*"
                capture="user"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setFacePhotoDataUrl(await fileToDataUrl(file));
                }}
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="rounded-xl border border-zinc-200 px-3 py-2.5 text-sm"
                onClick={() => setOpen(false)}
              >
                キャンセル
              </button>
              <button
                type="button"
                className="rounded-xl bg-violet-600 px-3 py-2.5 text-sm font-medium text-white"
                onClick={() => {
                  const before = new Set(data.savedPeople.map((p) => p.id));
                  const next = savePersonFromPage(data, page, {
                    customName,
                    note,
                    metPlaceManual,
                    facePhotoDataUrl,
                  });
                  setData(next);
                  const created = next.savedPeople.find((p) => !before.has(p.id));
                  setSavedId(created?.id ?? null);
                  setOpen(false);
                }}
              >
                保存する
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
