/**
 * QR に載せる URL の上限（origin 込み）。
 * 200px 表示・誤り訂正 M でマスが約 4px 以上になる長さ。
 * これより長いページは /u/{uuid} にする。
 */
export const QR_URL_MAX_CHARS = 150;

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
