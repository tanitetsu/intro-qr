"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppData } from "@/lib/app-data";
import { formatDate } from "@/lib/dates";
import { useI18n } from "@/lib/i18n/locale";
import { deleteSavedPerson } from "@/lib/storage";
import type { SavedPerson } from "@/lib/types";

function chipButtonClass(enabled: boolean) {
  return `rounded-full px-2.5 py-1 text-[11px] font-medium leading-none ${
    enabled
      ? "bg-violet-50 text-violet-700"
      : "bg-zinc-100 text-zinc-400"
  }`;
}

export function SavedListClient() {
  const { ready, savedPeople, data, setData } = useAppData();
  const { t, locale } = useI18n();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [memoPreview, setMemoPreview] = useState<SavedPerson | null>(null);

  if (!ready) {
    return <div className="p-4 text-sm text-zinc-500">{t("common.loading")}</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-bold">{t("album.title")}</h1>

      {savedPeople.length === 0 ? (
        <p className="text-sm text-zinc-600">{t("album.empty")}</p>
      ) : (
        <div className="space-y-2">
          {savedPeople.map((person) => {
            const meta = [
              formatDate(person.savedOn, locale),
              person.metPlaceManual || person.metPlaceAuto,
            ]
              .filter(Boolean)
              .join(" · ");

            return (
              <div
                key={person.id}
                className="flex items-center gap-2 rounded-2xl border border-black/8 bg-white px-3 py-2.5 shadow-sm"
              >
                <Link
                  href={`/u/${person.sourcePageId}`}
                  className="min-w-0 flex-1 rounded-lg py-0.5 active:bg-zinc-50"
                >
                  <p className="truncate text-sm font-semibold text-violet-800 underline-offset-2 hover:underline">
                    {person.customName}
                  </p>
                  {meta ? (
                    <p className="truncate text-[11px] leading-tight text-zinc-500">
                      {meta}
                    </p>
                  ) : null}
                </Link>

                <div className="flex shrink-0 items-center gap-1">
                  {person.facePhotoDataUrl ? (
                    <button
                      type="button"
                      onClick={() =>
                        setPhotoPreview(person.facePhotoDataUrl ?? null)
                      }
                      className={chipButtonClass(true)}
                    >
                      {t("common.photo")}
                    </button>
                  ) : (
                    <Link
                      href={`/saved/${person.id}`}
                      className={chipButtonClass(false)}
                    >
                      {t("common.photo")}
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => setMemoPreview(person)}
                    className={chipButtonClass(!!person.note.trim())}
                  >
                    {t("album.note")}
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-red-200 px-2 py-1 text-[11px] font-medium leading-none text-red-600"
                    onClick={() => {
                      if (confirm(t("album.deleteConfirm"))) {
                        setData(deleteSavedPerson(data, person.id));
                      }
                    }}
                  >
                    {t("common.delete")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {photoPreview ? (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setPhotoPreview(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoPreview}
            alt={t("common.facePhotoAlt")}
            className="max-h-[80vh] max-w-full rounded-2xl object-contain"
          />
        </button>
      ) : null}

      {memoPreview ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          role="presentation"
          onClick={() => setMemoPreview(null)}
        >
          <div
            role="dialog"
            aria-labelledby="album-memo-title"
            className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="album-memo-title"
              className="text-sm font-semibold text-zinc-900"
            >
              {memoPreview.customName} — {t("album.note")}
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
              {memoPreview.note.trim()
                ? memoPreview.note
                : t("album.memoEmpty")}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-xl px-3 py-2 text-xs font-medium text-zinc-600"
                onClick={() => setMemoPreview(null)}
              >
                {t("public.photoCancel")}
              </button>
              <Link
                href={`/saved/${memoPreview.id}`}
                className="rounded-xl bg-zinc-900 px-3 py-2 text-xs font-medium text-white"
                onClick={() => setMemoPreview(null)}
              >
                {t("common.edit")}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
