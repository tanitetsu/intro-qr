"use client";

import Link from "next/link";
import { Camera, StickyNote, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { IconButton, IconLink } from "@/components/ui/IconButton";
import { useAppData } from "@/lib/app-data";
import { formatDate } from "@/lib/dates";
import { useI18n } from "@/lib/i18n/locale";
import { deleteSavedPerson } from "@/lib/storage";
import type { SavedPerson } from "@/lib/types";

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
      <h1 className="sr-only">{t("people.title")}</h1>

      {savedPeople.length === 0 ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-violet-50 text-violet-700">
            <Users className="h-10 w-10" strokeWidth={1.75} aria-hidden />
          </div>
          <p className="max-w-xs text-sm leading-6 text-zinc-600">
            {t("people.empty")}
          </p>
        </div>
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
                className="flex items-center gap-1 rounded-2xl border border-black/8 bg-white px-2 py-2 shadow-sm"
              >
                <Link
                  href={`/u/${person.sourcePageId}`}
                  className="min-w-0 flex-1 rounded-lg px-2 py-1.5 active:bg-zinc-50"
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

                <div className="flex shrink-0 items-center">
                  {person.facePhotoDataUrl ? (
                    <IconButton
                      label={t("common.photo")}
                      tone="soft"
                      onClick={() =>
                        setPhotoPreview(person.facePhotoDataUrl ?? null)
                      }
                    >
                      <Camera className="h-5 w-5" strokeWidth={2} aria-hidden />
                    </IconButton>
                  ) : (
                    <IconLink
                      href={`/saved/${person.id}`}
                      label={t("common.photo")}
                      tone="ghost"
                    >
                      <Camera className="h-5 w-5" strokeWidth={2} aria-hidden />
                    </IconLink>
                  )}
                  <IconButton
                    label={t("people.note")}
                    tone={person.note.trim() ? "soft" : "ghost"}
                    onClick={() => setMemoPreview(person)}
                  >
                    <StickyNote
                      className="h-5 w-5"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </IconButton>
                  <IconButton
                    label={t("common.delete")}
                    tone="danger"
                    onClick={() => {
                      if (confirm(t("people.deleteConfirm"))) {
                        setData(deleteSavedPerson(data, person.id));
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} aria-hidden />
                  </IconButton>
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
            aria-labelledby="people-memo-title"
            className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="people-memo-title"
              className="flex items-center gap-2 text-sm font-semibold text-zinc-900"
            >
              <StickyNote className="h-4 w-4" aria-hidden />
              {memoPreview.customName}
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
              {memoPreview.note.trim()
                ? memoPreview.note
                : t("people.memoEmpty")}
            </p>
            <div className="mt-4 flex justify-end">
              <Link
                href={`/saved/${memoPreview.id}`}
                className="inline-flex h-11 items-center justify-center rounded-full bg-violet-600 px-4 text-xs font-medium text-white"
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
