"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppData } from "@/lib/app-data";
import { formatDate } from "@/lib/dates";
import { useI18n } from "@/lib/i18n/locale";
import { deleteSavedPerson } from "@/lib/storage";
import type { SavedPerson } from "@/lib/types";

function actionButtonClass(enabled: boolean) {
  return `rounded-full px-3 py-1.5 text-xs font-medium ${
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
        <div className="space-y-3">
          {savedPeople.map((person) => (
            <div
              key={person.id}
              className="rounded-2xl border border-black/8 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/u/${person.sourcePageId}`}
                    className="font-semibold text-zinc-900 underline-offset-2 hover:underline"
                  >
                    {person.customName}
                  </Link>
                  <p className="text-xs text-zinc-500">
                    {formatDate(person.savedOn, locale)}
                    {person.metPlaceManual || person.metPlaceAuto
                      ? ` · ${person.metPlaceManual || person.metPlaceAuto}`
                      : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  {person.facePhotoDataUrl ? (
                    <button
                      type="button"
                      onClick={() =>
                        setPhotoPreview(person.facePhotoDataUrl ?? null)
                      }
                      className={actionButtonClass(true)}
                    >
                      {t("common.photo")}
                    </button>
                  ) : (
                    <Link
                      href={`/saved/${person.id}`}
                      className={`text-center ${actionButtonClass(false)}`}
                    >
                      {t("common.photo")}
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => setMemoPreview(person)}
                    className={actionButtonClass(!!person.note.trim())}
                  >
                    {t("album.note")}
                  </button>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  className="rounded-xl border border-red-200 px-3 py-2 text-xs font-medium text-red-600"
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
          ))}
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
