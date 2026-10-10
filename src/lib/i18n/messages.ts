export type Locale = "ja" | "en";

const ja = {
  "nav.qr": "QR",
  "nav.pages": "ページ",
  "nav.album": "アルバム",
  "nav.account": "マイページ",

  "common.loading": "読み込み中…",
  "common.edit": "編集",
  "common.delete": "削除",
  "common.add": "追加",
  "common.detail": "詳細",
  "common.photo": "写真",
  "common.share": "共有",
  "common.preview": "プレビュー",
  "common.home": "ホームへ",
  "common.backToList": "一覧へ",
  "common.links": "リンク",
  "common.default": "デフォルト",
  "common.synced": "同期済み",
  "common.facePhotoAlt": "顔写真",

  "home.emptyTitle": "QR",
  "home.emptyBody": "ページがありません",
  "home.createPage": "ページを作る",

  "pages.title": "ページ",
  "pages.linkCount": "リンク {count} 件",
  "pages.newTitle": "ページ {n}",
  "pages.deleteLast": "最後の1ページは削除できません",
  "pages.deleteConfirm": "「{title}」を削除しますか？",
  "pages.syncOk": "同期しました",
  "pages.syncLogin": "ログインすると同期できます",

  "edit.title": "編集",
  "edit.notFound": "ページが見つかりません。",
  "edit.pageName": "ページ名",
  "edit.displayName": "表示名",
  "edit.bio": "自己紹介（任意）",
  "edit.setDefault": "デフォルトページにする",
  "edit.addLink": "リンクを追加",
  "edit.linkTitle": "タイトル",
  "edit.linkComment": "コメント（任意）",
  "edit.savedLinks": "登録済みリンク",
  "edit.noneYet": "まだありません",
  "edit.urlRequired": "URLを入力してください",
  "edit.defaultLinkTitle": "リンク",

  "linkType.interest": "関心",
  "linkType.contact": "連絡先",
  "linkType.org": "所属",
  "linkType.other": "その他",

  "album.title": "アルバム",
  "album.empty": "まだ登録がありません。",
  "album.deleteConfirm": "この保存を削除しますか？",
  "album.notFound": "保存データが見つかりません。",
  "album.savedOn": "保存日 {date}",
  "album.place": "位置情報（任意）",
  "album.placePlaceholder": "例: 渋谷、東京都 / 技術書典",
  "album.useCurrentLocation": "現在地から入力",
  "album.locationBusy": "取得中…",
  "album.locationFailed": "位置情報を取得できませんでした",
  "album.locationAutoHint": "自動入力済み（編集できます）",
  "album.note": "メモ",
  "album.facePhoto": "顔写真（この端末内のみ）",
  "album.receivedLinks": "受け取ったリンク",

  "auth.title": "ログイン",
  "auth.missingConfig": "Supabase の環境変数が未設定です。",
  "auth.signedInPrefix": "ログイン中:",
  "auth.logout": "ログアウト",
  "auth.passwordPlaceholder": "パスワード（6文字以上）",
  "auth.login": "ログイン",
  "auth.signUp": "新規登録",
  "auth.loggedOut": "ログアウトしました",
  "auth.loggedIn": "ログインしました",
  "auth.accountCreated": "アカウントを作成しました",
  "auth.language": "言語",
  "auth.languageJa": "日本語",
  "auth.languageEn": "English",

  "qr.tooLong": "QRを表示できません。ページを編集してください。",
  "qr.copied": "リンクをコピーしました",
  "qr.manualCopy": "下のURLを長押ししてコピーしてください",

  "profile.noLinks": "まだリンクがありません。",

  "public.notFound": "ページが見つかりません",
  "public.localMissing":
    "この端末にデータがない公開URLの可能性があります。",
  "public.cloudHint":
    "クラウド未公開か、URLが古い可能性があります。持ち主がログインしてページを編集すると自動同期されます。",
  "public.loadFailed": "読み込みに失敗しました",
  "public.invalidShare": "無効な共有リンクです",
  "public.photoButton": "顔写真を撮る",
  "public.photoConsentTitle": "顔写真の撮影",
  "public.photoConsentBody":
    "本人の承諾を得て顔写真を撮影してください",
  "public.photoStart": "撮影する",
  "public.photoCancel": "キャンセル",
  "public.photoSaved": "アルバムに保存しました",
  "public.photoViewExisting": "保存済みの写真を見る",
  "edit.defaultDisplayName": "あなたの名前",
  "edit.defaultPageTitle": "新しいページ",

  "banner.inAppTitle": "アプリ内ブラウザで開いています",
  "banner.inAppBody":
    "うまく動かない場合は、右下メニューから「Safariで開く」を選んでください。",
  "banner.openExternal": "外部ブラウザで開き直す",

  "error.title": "表示エラー",
  "error.reset": "データを初期化して再読み込み",
} as const;

export type MessageKey = keyof typeof ja;

const en: Record<MessageKey, string> = {
  "nav.qr": "QR",
  "nav.pages": "Pages",
  "nav.album": "Album",
  "nav.account": "Account",

  "common.loading": "Loading…",
  "common.edit": "Edit",
  "common.delete": "Delete",
  "common.add": "Add",
  "common.detail": "Details",
  "common.photo": "Photo",
  "common.share": "Share",
  "common.preview": "Preview",
  "common.home": "Home",
  "common.backToList": "Back",
  "common.links": "Links",
  "common.default": "Default",
  "common.synced": "Synced",
  "common.facePhotoAlt": "Face photo",

  "home.emptyTitle": "QR",
  "home.emptyBody": "No pages yet",
  "home.createPage": "Create a page",

  "pages.title": "Pages",
  "pages.linkCount": "{count} links",
  "pages.newTitle": "Page {n}",
  "pages.deleteLast": "You can’t delete the last page",
  "pages.deleteConfirm": "Delete “{title}”?",
  "pages.syncOk": "Synced",
  "pages.syncLogin": "Sign in to sync",

  "edit.title": "Edit",
  "edit.notFound": "Page not found.",
  "edit.pageName": "Page name",
  "edit.displayName": "Display name",
  "edit.bio": "Bio (optional)",
  "edit.setDefault": "Make default page",
  "edit.addLink": "Add link",
  "edit.linkTitle": "Title",
  "edit.linkComment": "Comment (optional)",
  "edit.savedLinks": "Saved links",
  "edit.noneYet": "None yet",
  "edit.urlRequired": "Enter a URL",
  "edit.defaultLinkTitle": "Link",

  "linkType.interest": "Interest",
  "linkType.contact": "Contact",
  "linkType.org": "Org",
  "linkType.other": "Other",

  "album.title": "Album",
  "album.empty": "No one saved yet.",
  "album.deleteConfirm": "Delete this saved person?",
  "album.notFound": "Saved person not found.",
  "album.savedOn": "Saved {date}",
  "album.place": "Location (optional)",
  "album.placePlaceholder": "e.g. Shibuya, Tokyo / Meetup",
  "album.useCurrentLocation": "Use current location",
  "album.locationBusy": "Getting location…",
  "album.locationFailed": "Couldn’t get location",
  "album.locationAutoHint": "Filled automatically (editable)",
  "album.note": "Note",
  "album.facePhoto": "Face photo (this device only)",
  "album.receivedLinks": "Received links",

  "auth.title": "Sign in",
  "auth.missingConfig": "Supabase environment variables are not set.",
  "auth.signedInPrefix": "Signed in:",
  "auth.logout": "Sign out",
  "auth.passwordPlaceholder": "Password (6+ characters)",
  "auth.login": "Sign in",
  "auth.signUp": "Sign up",
  "auth.loggedOut": "Signed out",
  "auth.loggedIn": "Signed in",
  "auth.accountCreated": "Account created",
  "auth.language": "Language",
  "auth.languageJa": "日本語",
  "auth.languageEn": "English",

  "qr.tooLong": "Can’t show this QR. Edit the page.",
  "qr.copied": "Link copied",
  "qr.manualCopy": "Long-press the URL below to copy",

  "profile.noLinks": "No links yet.",

  "public.notFound": "Page not found",
  "public.localMissing":
    "This public URL may not have data on this device.",
  "public.cloudHint":
    "This page may be unpublished or the URL may be outdated. When the owner signs in and edits the page, it syncs automatically.",
  "public.loadFailed": "Failed to load",
  "public.invalidShare": "Invalid share link",
  "public.photoButton": "Take a face photo",
  "public.photoConsentTitle": "Face photo",
  "public.photoConsentBody":
    "Please take a face photo only with the person’s consent.",
  "public.photoStart": "Take photo",
  "public.photoCancel": "Cancel",
  "public.photoSaved": "Saved to album",
  "public.photoViewExisting": "View saved photo",
  "edit.defaultDisplayName": "Your name",
  "edit.defaultPageTitle": "New page",

  "banner.inAppTitle": "Opened in an in-app browser",
  "banner.inAppBody":
    "If something doesn’t work, open this page in Safari or your system browser.",
  "banner.openExternal": "Open in browser",

  "error.title": "Something went wrong",
  "error.reset": "Reset local data and reload",
};

export const messages: Record<Locale, Record<MessageKey, string>> = { ja, en };

export const LOCALES: Locale[] = ["ja", "en"];

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "ja" || value === "en";
}

export function translate(
  locale: Locale,
  key: MessageKey,
  params?: Record<string, string | number>,
): string {
  let text = messages[locale][key] ?? messages.ja[key] ?? key;
  if (params) {
    for (const [name, value] of Object.entries(params)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}
