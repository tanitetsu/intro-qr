"use client";

import Link from "next/link";
import { Camera, MapPin, StickyNote } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { LinkCard } from "@/components/links/LinkCard";
import { IconButton } from "@/components/ui/IconButton";
import { useAppData } from "@/lib/app-data";
import { formatDate } from "@/lib/dates";
import { suggestMeetingPlace } from "@/lib/geolocation";
import { useI18n } from "@/lib/i18n/locale";
import { updateSavedPerson } from "@/lib/storage";

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
  const { t, locale } = useI18n();
  const person = useMemo(
    () => data.savedPeople.find((p) => p.id === savedId) ?? null,
    [data.savedPeople, savedId],
  );
  const [showPhoto, setShowPhoto] = useState(false);
  const [locationBusy, setLocationBusy] = useState(false);
  const [locationHint, setLocationHint] = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);

  if (!ready) {
    return <div className="p-4 text-sm text-zinc-500">{t("common.loading")}</div>;
  }

  if (!person) {
    return (
      <div className="space-y-3 p-4">
        <p className="text-sm">{t("people.notFound")}</p>
        <Link href="/saved" className="text-sm text-violet-700">
          {t("common.backToList")}
        </Link>
      </div>
    );
  }

  async function fillFromCurrentLocation() {
    if (!person) return;
    setLocationBusy(true);
    setLocationHint("");
    const place = await suggestMeetingPlace(locale);
    setLocationBusy(false);
    if (!place) {
      setLocationHint(t("people.locationFailed"));
      return;
    }
    setData((prev) =>
      updateSavedPerson(prev, person.id, {
        metPlaceAuto: place,
        metPlaceManual: place,
      }),
    );
    setLocationHint(t("people.locationAutoHint"));
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold">{person.customName}</h1>
          <p className="text-sm text-zinc-600">
            {t("people.savedOn", { date: formatDate(person.savedOn, locale) })}
          </p>
        </div>
        <IconButton
          label={t("common.photo")}
          tone={person.facePhotoDataUrl ? "soft" : "ghost"}
          disabled={!person.facePhotoDataUrl}
          onClick={() => setShowPhoto(true)}
        >
          <Camera className="h-5 w-5" strokeWidth={2} aria-hidden />
        </IconButton>
      </div>

      <section className="space-y-3 rounded-2xl border border-black/8 bg-white p-4">
        <label className="block space-y-1">
          <span className="text-xs font-medium text-zinc-500">
            {t("edit.displayName")}
          </span>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            value={person.customName}
            onChange={(e) =>
              setData((prev) =>
                updateSavedPerson(prev, person.id, {
                  customName: e.target.value,
                }),
              )
            }
          />
        </label>
        <div className="space-y-1">
          <label className="block space-y-1">
            <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {t("people.place")}
            </span>
            <input
              className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
              placeholder={t("people.placePlaceholder")}
              value={person.metPlaceManual}
              onChange={(e) =>
                setData((prev) =>
                  updateSavedPerson(prev, person.id, {
                    metPlaceManual: e.target.value,
                  }),
                )
              }
            />
          </label>
          <IconButton
            label={
              locationBusy
                ? t("people.locationBusy")
                : t("people.useCurrentLocation")
            }
            tone="soft"
            disabled={locationBusy}
            onClick={() => void fillFromCurrentLocation()}
          >
            <MapPin className="h-5 w-5" strokeWidth={2} aria-hidden />
          </IconButton>
          {locationHint ||
          (person.metPlaceAuto &&
            person.metPlaceManual === person.metPlaceAuto) ? (
            <p className="text-xs text-zinc-500">
              {locationHint || t("people.locationAutoHint")}
            </p>
          ) : null}
        </div>
        <label className="block space-y-1">
          <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
            <StickyNote className="h-3.5 w-3.5" aria-hidden />
            {t("people.note")}
          </span>
          <textarea
            className="min-h-20 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            value={person.note}
            onChange={(e) =>
              setData((prev) =>
                updateSavedPerson(prev, person.id, { note: e.target.value }),
              )
            }
          />
        </label>
        <div className="space-y-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
            <Camera className="h-3.5 w-3.5" aria-hidden />
            {t("people.facePhoto")}
          </span>
          <IconButton
            label={t("common.photo")}
            tone="neutral"
            onClick={() => photoInputRef.current?.click()}
          >
            <Camera className="h-5 w-5" strokeWidth={2} aria-hidden />
          </IconButton>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const dataUrl = await fileToDataUrl(file);
              setData((prev) =>
                updateSavedPerson(prev, person.id, {
                  facePhotoDataUrl: dataUrl,
                }),
              );
            }}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="sr-only">{t("people.receivedLinks")}</h2>
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
            alt={t("common.facePhotoAlt")}
            className="max-h-[80vh] max-w-full rounded-2xl object-contain"
          />
        </button>
      ) : null}
    </div>
  );
}
