/** QRコードを見せるタブ */
export function QrTabIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      {/* 左上ファインダー */}
      <rect x="3" y="3" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="5.2" y="5.2" width="2.6" height="2.6" rx="0.4" fill="currentColor" />
      {/* 右上ファインダー */}
      <rect x="14" y="3" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="16.2" y="5.2" width="2.6" height="2.6" rx="0.4" fill="currentColor" />
      {/* 左下ファインダー */}
      <rect x="3" y="14" width="7" height="7" rx="1.2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="5.2" y="16.2" width="2.6" height="2.6" rx="0.4" fill="currentColor" />
      {/* 右下データ部 */}
      <rect x="14" y="14" width="2.2" height="2.2" fill="currentColor" />
      <rect x="17.4" y="14" width="3.6" height="2.2" fill="currentColor" />
      <rect x="14" y="17.4" width="3.6" height="2.2" fill="currentColor" />
      <rect x="18.8" y="17.4" width="2.2" height="3.6" fill="currentColor" />
    </svg>
  );
}

/** ページ編集タブ（書類＋ペン） */
export function EditTabIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3.8h7.2L19 8.6V20.2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.8a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M14 3.8v4.8H19" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M8.5 12.5h5.5M8.5 15.5h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M15.2 18.8l4.6-4.6a1.1 1.1 0 0 0-1.6-1.6l-4.6 4.6v1.6h1.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** 保存した人のアルバム／名簿 */
export function AlbumTabIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      {/* 後ろのカード */}
      <rect
        x="6.5"
        y="4"
        width="13"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.45"
      />
      {/* 前のカード */}
      <rect
        x="3.5"
        y="6"
        width="13"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      {/* 人物 */}
      <circle cx="10" cy="11.2" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.8 17.2c.7-1.8 1.9-2.7 3.2-2.7s2.5.9 3.2 2.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** マイページ／アカウント */
export function ProfileTabIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M6.8 18.2c1.2-2.2 3-3.3 5.2-3.3s4 1.1 5.2 3.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
