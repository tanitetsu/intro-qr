"use client";

import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAppData } from "@/lib/app-data";
import { useI18n } from "@/lib/i18n/locale";
import {
  findSavedBySourcePageId,
  isOwnPage,
  setFacePhotoForPage,
} from "@/lib/storage";
import type { ProfilePage } from "@/lib/types";

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function FacePhotoButton({
  page,
  hidden = false,
}: {
  page: ProfilePage;
  /** 自分のページなど、撮影UIを出さないとき */
  hidden?: boolean;
}) {
  const { ready, data, setData } = useAppData();
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [consentOpen, setConsentOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [savedHint, setSavedHint] = useState(false);

  const sourceId = page.cloudId || page.id;
  const saved =
    findSavedBySourcePageId(data, sourceId) ??
    findSavedBySourcePageId(data, page.id);
  const hasPhoto = Boolean(saved?.facePhotoDataUrl);
  const own = ready && isOwnPage(data, page);

  useEffect(() => {
    if (!savedHint) return;
    const timer = window.setTimeout(() => setSavedHint(false), 2000);
    return () => window.clearTimeout(timer);
  }, [savedHint]);

  if (!ready || hidden || own) return null;

  async function onFileChange(file: File | undefined) {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setData((prev) => setFacePhotoForPage(prev, page, dataUrl));
    setSavedHint(true);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <>
      <button
        type="button"
        aria-label={t("public.photoButton")}
        onClick={() => setConsentOpen(true)}
        className={`fixed bottom-24 right-[max(1rem,calc(50%-11rem))] z-30 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition active:scale-95 ${
          hasPhoto
            ? "bg-violet-700 text-white"
            : "bg-white text-violet-700 ring-1 ring-violet-200"
        }`}
      >
        <Camera className="h-6 w-6" strokeWidth={2.25} />
        {hasPhoto ? (
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white" />
        ) : null}
      </button>

      {savedHint ? (
        <p
          role="status"
          className="fixed bottom-40 right-[max(1rem,calc(50%-11rem))] z-30 rounded-full bg-zinc-900/90 px-3 py-1.5 text-xs font-medium text-white"
        >
          {t("public.photoSaved")}
        </p>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => void onFileChange(e.target.files?.[0])}
      />

      {consentOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="face-photo-consent-title"
            className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-5 shadow-xl"
          >
            <h2
              id="face-photo-consent-title"
              className="text-base font-semibold text-zinc-900"
            >
              {t("public.photoConsentTitle")}
            </h2>
            <p className="text-sm leading-6 text-zinc-600">
              {t("public.photoConsentBody")}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConsentOpen(false)}
                className="flex-1 rounded-xl border border-zinc-200 px-3 py-2.5 text-sm font-medium text-zinc-700"
              >
                {t("public.photoCancel")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConsentOpen(false);
                  // ダイアログを閉じた直後にファイル選択を開く
                  window.setTimeout(() => inputRef.current?.click(), 0);
                }}
                className="flex-1 rounded-xl bg-violet-700 px-3 py-2.5 text-sm font-medium text-white"
              >
                {t("public.photoStart")}
              </button>
            </div>
            {hasPhoto && saved?.facePhotoDataUrl ? (
              <button
                type="button"
                onClick={() => {
                  setConsentOpen(false);
                  setPreviewUrl(saved.facePhotoDataUrl ?? null);
                }}
                className="w-full text-center text-xs font-medium text-violet-700"
              >
                {t("public.photoViewExisting")}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {previewUrl ? (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setPreviewUrl(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={t("common.facePhotoAlt")}
            className="max-h-[80vh] max-w-full rounded-2xl object-contain"
          />
        </button>
      ) : null}
    </>
  );
}
