"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAppData } from "@/lib/app-data";
import { formatDateJa } from "@/lib/dates";
import { updateSavedPerson } from "@/lib/storage";
import { LinkCard } from "@/components/links/LinkCard";

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function SavedDetailClient({ savedId }: { savedId: string }) {
  const { ready, data, setData } = useAppData();
  const person = useMemo(
    () => data.savedPeople.find((p) => p.id === savedId) ?? null,
    [data.savedPeople, savedId],
  );
  const [showPhoto, setShowPhoto] = useState(false);

  if (!ready) {
    return <div className="p-4 text-sm text-zinc-500">読み込み中…</div>;
  }

  if (!person) {
    return (
      <div className="space-y-3 p-4">
        <p className="text-sm">保存データが見つかりません。</p>
        <Link href="/saved" className="text-sm text-violet-700">
          一覧へ
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{person.customName}</h1>
          <p className="text-sm text-zinc-600">
            保存日 {formatDateJa(person.savedOn)}
          </p>
        </div>
        <button
          type="button"
          disabled={!person.facePhotoDataUrl}
          onClick={() => setShowPhoto(true)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium ${
            person.facePhotoDataUrl
              ? "bg-violet-50 text-violet-700"
              : "bg-zinc-100 text-zinc-400"
          }`}
        >
          写真を見る
        </button>
      </div>

      <section className="space-y-3 rounded-2xl border border-black/8 bg-white p-4">
        <label className="block space-y-1">
          <span className="text-xs font-medium text-zinc-500">表示名</span>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            value={person.customName}
            onChange={(e) =>
              setData(
                updateSavedPerson(data, person.id, {
                  customName: e.target.value,
                }),
              )
            }
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-zinc-500">
            場所・イベント名
          </span>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            placeholder="例: 技術書典 / 大学サークル新歓"
            value={person.metPlaceManual}
            onChange={(e) =>
              setData(
                updateSavedPerson(data, person.id, {
                  metPlaceManual: e.target.value,
                }),
              )
            }
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-zinc-500">メモ</span>
          <textarea
            className="min-h-20 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            value={person.note}
            onChange={(e) =>
              setData(
                updateSavedPerson(data, person.id, { note: e.target.value }),
              )
            }
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-zinc-500">
            顔写真（この端末内のみ）
          </span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="block w-full text-sm"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const dataUrl = await fileToDataUrl(file);
              setData(
                updateSavedPerson(data, person.id, {
                  facePhotoDataUrl: dataUrl,
                }),
              );
            }}
          />
        </label>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">受け取ったリンク</h2>
        {person.snapshot.links
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((link) => (
            <LinkCard key={link.id} link={link} compact />
          ))}
      </section>

      {showPhoto && person.facePhotoDataUrl ? (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setShowPhoto(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={person.facePhotoDataUrl}
            alt="顔写真"
            className="max-h-[80vh] max-w-full rounded-2xl object-contain"
          />
        </button>
      ) : null}
    </div>
  );
}
