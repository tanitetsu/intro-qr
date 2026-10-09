import { PenLine, QrCode, Settings, UserRoundSearch } from "lucide-react";

/** QRコードを見せるタブ — Lucide qr-code */
export function QrTabIcon({ className }: { className?: string }) {
  return <QrCode className={className} strokeWidth={1.75} aria-hidden />;
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
