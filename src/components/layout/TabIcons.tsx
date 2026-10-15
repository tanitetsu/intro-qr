import { PenLine, QrCode, Settings, Users } from "lucide-react";

/** QRコードを見せるタブ — Lucide qr-code */
export function QrTabIcon({ className }: { className?: string }) {
  return <QrCode className={className} strokeWidth={1.75} aria-hidden />;
}

/** ページ編集タブ — Lucide pen-line */
export function EditTabIcon({ className }: { className?: string }) {
  return <PenLine className={className} strokeWidth={1.75} aria-hidden />;
}

/** 受け取った相手一覧 — Lucide users */
export function PeopleTabIcon({ className }: { className?: string }) {
  return <Users className={className} strokeWidth={1.75} aria-hidden />;
}

/** @deprecated PeopleTabIcon を使う */
export const AlbumTabIcon = PeopleTabIcon;

/** マイページ／設定 — Lucide settings */
export function ProfileTabIcon({ className }: { className?: string }) {
  return <Settings className={className} strokeWidth={1.75} aria-hidden />;
}
