import type { Locale } from "@/lib/i18n/messages";

export function toDateString(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** @deprecated use formatDate(date, locale) */
export function formatDateJa(dateString: string): string {
  return formatDate(dateString, "ja");
}

export function formatDate(dateString: string, locale: Locale = "ja"): string {
  const [y, m, d] = dateString.split("-").map(Number);
  if (!y || !m || !d) return dateString;
  if (locale === "en") {
    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return `${y}年${m}月${d}日`;
}
