import { PenLine, Settings, UserRoundSearch } from "lucide-react";

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

/** ページ編集タブ — Lucide pen-line */
export function EditTabIcon({ className }: { className?: string }) {
  return <PenLine className={className} strokeWidth={1.75} aria-hidden />;
}

/** 保存した人のアルバム — Lucide user-round-search */
export function AlbumTabIcon({ className }: { className?: string }) {
  return <UserRoundSearch className={className} strokeWidth={1.75} aria-hidden />;
}

/** マイページ／設定 — Lucide settings */
export function ProfileTabIcon({ className }: { className?: string }) {
  return <Settings className={className} strokeWidth={1.75} aria-hidden />;
}
