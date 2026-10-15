/** QR に載せる URL の上限（QrCard と同じ）。これ超えると読めない/無効になりやすい */
export const QR_URL_MAX_CHARS = 1200;

/** 余裕を見て /s/ トークン方式を使う上限（origin 込みで収まる目安） */
export const INLINE_SHARE_MAX_CHARS = 900;

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
