"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Camera,
  Check,
  GripVertical,
  PenLine,
  StickyNote,
  Trash2,
} from "lucide-react";
import { useAppData } from "@/lib/app-data";
import { formatDate } from "@/lib/dates";
import { useI18n } from "@/lib/i18n/locale";
import {
  deleteSavedPerson,
  reorderSavedPeople,
} from "@/lib/storage";
import type { SavedPerson } from "@/lib/types";

const ICON_BTN =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition active:scale-[0.96]";

function PictogramButton({
  enabled,
  label,
  onClick,
  href,
  children,
}: {
  enabled: boolean;
  label: string;
  onClick?: () => void;
  href?: string;
  children: ReactNode;
}) {
  const className = `${ICON_BTN} ${
    enabled
      ? "bg-violet-50 text-violet-700"
      : "bg-zinc-100 text-zinc-400"
  }`;
  if (href) {
    return (
      <Link href={href} aria-label={label} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
}

export function SavedListClient() {
  const { ready, savedPeople, data, setData } = useAppData();
  const { t, locale } = useI18n();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [memoPreview, setMemoPreview] = useState<SavedPerson | null>(null);
  const [editing, setEditing] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragId = useRef<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef(data);
  const peopleRef = useRef(savedPeople);
  useEffect(() => {
    dataRef.current = data;
    peopleRef.current = savedPeople;
  }, [data, savedPeople]);

  if (!ready) {
    return <div className="p-4 text-sm text-zinc-500">{t("common.loading")}</div>;
  }

  function commitOrder(orderedIds: string[]) {
    setData(reorderSavedPeople(dataRef.current, orderedIds));
  }

  function movePerson(fromId: string, toId: string) {
    if (fromId === toId) return;
    const ids = peopleRef.current.map((p) => p.id);
    const from = ids.indexOf(fromId);
    const to = ids.indexOf(toId);
    if (from < 0 || to < 0) return;
    const next = [...ids];
    next.splice(from, 1);
    next.splice(to, 0, fromId);
    commitOrder(next);
  }

  function rowIdFromPoint(clientY: number): string | null {
    const root = listRef.current;
    if (!root) return null;
    const rows = root.querySelectorAll<HTMLElement>("[data-person-id]");
    for (const row of rows) {
      const rect = row.getBoundingClientRect();
      if (clientY >= rect.top && clientY <= rect.bottom) {
        return row.dataset.personId ?? null;
      }
    }
    return null;
  }

  function onGripPointerDown(
    personId: string,
    e: React.PointerEvent<HTMLButtonElement>,
  ) {
    if (!editing) return;
    e.preventDefault();
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    dragId.current = personId;
    setDraggingId(personId);

    const onMove = (ev: PointerEvent) => {
      const overId = rowIdFromPoint(ev.clientY);
      if (overId && dragId.current) movePerson(dragId.current, overId);
    };
    const onUp = (ev: PointerEvent) => {
      target.releasePointerCapture(ev.pointerId);
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerup", onUp);
      target.removeEventListener("pointercancel", onUp);
      dragId.current = null;
      setDraggingId(null);
    };
    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerup", onUp);
    target.addEventListener("pointercancel", onUp);
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">{t("album.title")}</h1>
        {savedPeople.length > 0 ? (
          <button
            type="button"
            aria-label={editing ? t("album.done") : t("common.edit")}
            aria-pressed={editing}
            onClick={() => setEditing((v) => !v)}
            className={`${ICON_BTN} ${
              editing
                ? "bg-violet-600 text-white"
                : "bg-zinc-100 text-zinc-800"
            }`}
          >
            {editing ? (
              <Check className="h-6 w-6" strokeWidth={2} aria-hidden />
            ) : (
              <PenLine className="h-6 w-6" strokeWidth={1.75} aria-hidden />
            )}
          </button>
        ) : null}
      </div>

      {savedPeople.length === 0 ? (
        <p className="text-sm text-zinc-600">{t("album.empty")}</p>
      ) : (
        <div ref={listRef} className="space-y-2">
          {savedPeople.map((person) => {
            const meta = [
              formatDate(person.savedOn, locale),
              person.metPlaceManual || person.metPlaceAuto,
            ]
              .filter(Boolean)
              .join(" · ");
            const hasPhoto = !!person.facePhotoDataUrl?.trim();
            const hasNote = !!person.note.trim();

            return (
              <div
                key={person.id}
                data-person-id={person.id}
                className={`flex items-center gap-1.5 rounded-2xl border border-black/8 bg-white px-2 py-2 shadow-sm ${
                  draggingId === person.id ? "opacity-60 ring-2 ring-violet-300" : ""
                }`}
              >
                {editing ? (
                  <button
                    type="button"
                    aria-label={t("album.reorder")}
                    className="inline-flex h-11 w-11 shrink-0 touch-none items-center justify-center rounded-xl text-zinc-400"
                    onPointerDown={(e) => onGripPointerDown(person.id, e)}
                  >
                    <GripVertical
                      className="h-6 w-6"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </button>
                ) : null}

                <Link
                  href={`/u/${person.sourcePageId}`}
                  className="min-w-0 flex-1 rounded-lg px-1 py-0.5 active:bg-zinc-50"
                  onClick={(e) => {
                    if (editing) e.preventDefault();
                  }}
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

                {editing ? (
                  <button
                    type="button"
                    aria-label={t("common.delete")}
                    className={`${ICON_BTN} text-red-600`}
                    onClick={() => {
                      if (confirm(t("album.deleteConfirm"))) {
                        setData(deleteSavedPerson(data, person.id));
                      }
                    }}
                  >
                    <Trash2 className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                  </button>
                ) : (
                  <div className="flex shrink-0 items-center gap-1">
                    {hasPhoto ? (
                      <PictogramButton
                        enabled
                        label={t("common.photo")}
                        onClick={() =>
                          setPhotoPreview(person.facePhotoDataUrl ?? null)
                        }
                      >
                        <Camera
                          className="h-6 w-6"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                      </PictogramButton>
                    ) : (
                      <PictogramButton
                        enabled={false}
                        label={t("common.photo")}
                        href={`/saved/${person.id}`}
                      >
                        <Camera
                          className="h-6 w-6"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                      </PictogramButton>
                    )}
                    <PictogramButton
                      enabled={hasNote}
                      label={t("album.note")}
                      onClick={() => setMemoPreview(person)}
                    >
                      <StickyNote
                        className="h-6 w-6"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                    </PictogramButton>
                  </div>
                )}
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
              {memoPreview.customName}
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
              {memoPreview.note.trim()
                ? memoPreview.note
                : t("album.memoEmpty")}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                aria-label={t("public.photoCancel")}
                className="rounded-xl px-3 py-2 text-xs font-medium text-zinc-600"
                onClick={() => setMemoPreview(null)}
              >
                {t("public.photoCancel")}
              </button>
              <Link
                href={`/saved/${memoPreview.id}`}
                aria-label={t("common.edit")}
                className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-zinc-900 px-3 text-white"
                onClick={() => setMemoPreview(null)}
              >
                <PenLine className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
