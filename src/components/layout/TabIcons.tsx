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

/** 保存した人のアルバム（人が密集している様子） */
export function AlbumTabIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      {/* 左（やや後ろ） */}
      <circle cx="7" cy="8.6" r="2.2" stroke="currentColor" strokeWidth="1.55" />
      <path
        d="M3.6 16.2c.65-2 2-3 3.4-3s2.75 1 3.4 3"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
      {/* 右（やや後ろ） */}
      <circle cx="17" cy="8.6" r="2.2" stroke="currentColor" strokeWidth="1.55" />
      <path
        d="M13.6 16.2c.65-2 2-3 3.4-3s2.75 1 3.4 3"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
      {/* 中央（手前・密集の核） */}
      <circle cx="12" cy="9.4" r="2.45" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M8.1 18.4c.8-2.25 2.25-3.35 3.9-3.35s3.1 1.1 3.9 3.35"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      {/* 隙間を埋める後ろの人（密集感） */}
      <circle cx="9.6" cy="7.2" r="1.7" stroke="currentColor" strokeWidth="1.35" opacity="0.75" />
      <circle cx="14.4" cy="7.2" r="1.7" stroke="currentColor" strokeWidth="1.35" opacity="0.75" />
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
