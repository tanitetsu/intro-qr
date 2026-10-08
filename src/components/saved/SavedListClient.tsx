"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppData } from "@/lib/app-data";
import { formatDate } from "@/lib/dates";
import { useI18n } from "@/lib/i18n/locale";
import { deleteSavedPerson } from "@/lib/storage";

export function SavedListClient() {
  const { ready, savedPeople, data, setData } = useAppData();
  const { t, locale } = useI18n();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  if (!ready) {
    return <div className="p-4 text-sm text-zinc-500">{t("common.loading")}</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-bold">{t("album.title")}</h1>

      {savedPeople.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8" />
      ) : (
        <div className="space-y-3">
          {savedPeople.map((person) => (
            <div
              key={person.id}
              className="rounded-2xl border border-black/8 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-zinc-900">
                    {person.customName}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatDate(person.savedOn, locale)}
                    {person.metPlaceManual
                      ? ` · ${person.metPlaceManual}`
                      : ""}
                  </p>
                  {person.note ? (
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                      {person.note}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  disabled={!person.facePhotoDataUrl}
                  onClick={() =>
                    person.facePhotoDataUrl &&
                    setPhotoPreview(person.facePhotoDataUrl)
                  }
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    person.facePhotoDataUrl
                      ? "bg-violet-50 text-violet-700"
                      : "bg-zinc-100 text-zinc-400"
                  }`}
                >
                  {t("common.photo")}
                </button>
              </div>
              <div className="mt-3 flex gap-2">
                <Link
                  href={`/saved/${person.id}`}
                  className="flex-1 rounded-xl bg-zinc-900 px-3 py-2 text-center text-xs font-medium text-white"
                >
                  {t("common.detail")}
                </Link>
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
    </div>
  );
}
