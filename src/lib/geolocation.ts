import type { Locale } from "@/lib/i18n/messages";

type ReverseGeocodeResponse = {
  locality?: string;
  city?: string;
  principalSubdivision?: string;
  countryName?: string;
};

function formatCoords(latitude: number, longitude: number): string {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

function formatPlaceLabel(
  data: ReverseGeocodeResponse,
  locale: Locale,
): string | null {
  const parts = [
    data.locality,
    data.city,
    data.principalSubdivision,
  ].filter((part, index, all): part is string => {
    if (!part?.trim()) return false;
    return all.findIndex((p) => p === part) === index;
  });

  if (parts.length) {
    // ja: 渋谷, 東京都 / en: Shibuya, Tokyo
    return parts.slice(0, 2).join(locale === "ja" ? "、" : ", ");
  }
  if (data.countryName?.trim()) return data.countryName.trim();
  return null;
}

function getCurrentPosition(): Promise<GeolocationPosition | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      () => resolve(null),
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 120_000,
      },
    );
  });
}

async function reverseGeocode(
  latitude: number,
  longitude: number,
  locale: Locale,
): Promise<string | null> {
  try {
    const url = new URL(
      "https://api.bigdatacloud.net/data/reverse-geocode-client",
    );
    url.searchParams.set("latitude", String(latitude));
    url.searchParams.set("longitude", String(longitude));
    url.searchParams.set("localityLanguage", locale === "ja" ? "ja" : "en");
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const data = (await res.json()) as ReverseGeocodeResponse;
    return formatPlaceLabel(data, locale);
  } catch {
    return null;
  }
}

/** 位置情報の任意提案。拒否・失敗時は null（UIは止めない） */
export async function suggestMeetingPlace(
  locale: Locale = "ja",
): Promise<string | null> {
  const position = await getCurrentPosition();
  if (!position) return null;

  const { latitude, longitude } = position.coords;
  const label = await reverseGeocode(latitude, longitude, locale);
  return label || formatCoords(latitude, longitude);
}
