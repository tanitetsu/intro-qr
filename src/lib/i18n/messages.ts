export type Locale = "ja" | "en";

const ja = {
  "nav.qr": "QR",
  "nav.pages": "ページ",
  "nav.people": "相手",
  "nav.account": "設定",

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
  "common.note": "メモ",
  "common.location": "位置",

  "home.emptyTitle": "QR",
  "home.emptyBody": "ページがありません",
  "home.createPage": "ページを作る",

  "pages.title": "ページ",
  "pages.linkCount": "{count}",
  "pages.newTitle": "ページ {n}",
  "pages.deleteLast": "最後の1ページは削除できません",
  "pages.deleteConfirm": "「{title}」を削除しますか？",
  "pages.syncOk": "同期済み",
  "pages.syncLogin": "ログインで同期",

  "edit.title": "編集",
  "edit.notFound": "ページが見つかりません。",
  "edit.pageName": "用途",
  "edit.displayName": "名前",
  "edit.bio": "自己紹介",
  "edit.icon": "アイコン",
  "edit.iconChange": "画像",
  "edit.iconRemove": "アイコン削除",
  "edit.iconAlt": "プロフィールアイコン",
  "edit.setDefault": "デフォルトにする",
  "edit.addLink": "リンク追加",
  "edit.linkTitle": "タイトル",
  "edit.linkComment": "コメント",
  "edit.savedLinks": "リンク",
  "edit.noneYet": "まだありません",
  "edit.urlRequired": "URLを入力してください",
  "edit.defaultLinkTitle": "リンク",
  "edit.defaultDisplayName": "あなたの名前",
  "edit.defaultPageTitle": "新しいページ",

  "linkType.interest": "関心",
  "linkType.contact": "連絡先",
  "linkType.org": "所属",
  "linkType.other": "その他",

  "people.title": "相手",
  "people.empty": "相手のQRを開くとここに入ります",
  "people.deleteConfirm": "この相手を削除しますか？",
  "people.notFound": "見つかりません",
  "people.savedOn": "{date}",
  "people.place": "場所",
  "people.placePlaceholder": "渋谷 / イベント名",
  "people.useCurrentLocation": "現在地",
  "people.locationBusy": "取得中…",
  "people.locationFailed": "位置を取得できません",
  "people.locationAutoHint": "自動入力（編集可）",
  "people.note": "メモ",
  "people.facePhoto": "顔写真（この端末のみ）",
  "people.receivedLinks": "リンク",
  "people.memoEmpty": "メモなし",
  "people.saved": "相手に保存しました",
  "people.done": "完了",
  "people.reorder": "並び替え",

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
  "qr.preparing": "短い共有リンクを準備中…",
  "qr.loginForShort": "ログインして短いQRにする",
  "qr.needShortShareConfig":
    "短い共有リンク用の設定がありません。ログインするか、リンク数を減らしてください。",
  "qr.shortShareFailed":
    "短い共有リンクの作成に失敗しました。ログインするか、リンク数を減らしてください。",
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
  "public.photoConsentTitle": "顔写真",
  "public.photoConsentBody":
    "本人の承諾を得て顔写真を撮影してください",
  "public.photoStart": "撮影",
  "public.photoCancel": "キャンセル",
  "public.photoSaved": "写真を保存しました",
  "public.photoViewExisting": "保存済みを見る",

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
  "nav.people": "People",
  "nav.account": "Settings",

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
  "common.note": "Note",
  "common.location": "Location",

  "home.emptyTitle": "QR",
  "home.emptyBody": "No pages yet",
  "home.createPage": "Create a page",

  "pages.title": "Pages",
  "pages.linkCount": "{count}",
  "pages.newTitle": "Page {n}",
  "pages.deleteLast": "You can’t delete the last page",
  "pages.deleteConfirm": "Delete “{title}”?",
  "pages.syncOk": "Synced",
  "pages.syncLogin": "Sign in to sync",

  "edit.title": "Edit",
  "edit.notFound": "Page not found.",
  "edit.pageName": "Label",
  "edit.displayName": "Name",
  "edit.bio": "Bio",
  "edit.icon": "Icon",
  "edit.iconChange": "Image",
  "edit.iconRemove": "Remove icon",
  "edit.iconAlt": "Profile icon",
  "edit.setDefault": "Make default",
  "edit.addLink": "Add link",
  "edit.linkTitle": "Title",
  "edit.linkComment": "Comment",
  "edit.savedLinks": "Links",
  "edit.noneYet": "None yet",
  "edit.urlRequired": "Enter a URL",
  "edit.defaultLinkTitle": "Link",
  "edit.defaultDisplayName": "Your name",
  "edit.defaultPageTitle": "New page",

  "linkType.interest": "Interest",
  "linkType.contact": "Contact",
  "linkType.org": "Org",
  "linkType.other": "Other",

  "people.title": "People",
  "people.empty": "Open someone’s QR to add them here",
  "people.deleteConfirm": "Delete this person?",
  "people.notFound": "Not found",
  "people.savedOn": "{date}",
  "people.place": "Place",
  "people.placePlaceholder": "Shibuya / Meetup",
  "people.useCurrentLocation": "Current location",
  "people.locationBusy": "Getting…",
  "people.locationFailed": "Couldn’t get location",
  "people.locationAutoHint": "Auto-filled (editable)",
  "people.note": "Note",
  "people.facePhoto": "Face photo (this device only)",
  "people.receivedLinks": "Links",
  "people.memoEmpty": "No note",
  "people.saved": "Saved to People",
  "people.done": "Done",
  "people.reorder": "Reorder",

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
  "qr.preparing": "Preparing a short share link…",
  "qr.loginForShort": "Sign in for a short QR",
  "qr.needShortShareConfig":
    "Short-link sharing isn’t configured. Sign in or remove some links.",
  "qr.shortShareFailed":
    "Couldn’t create a short link. Sign in or remove some links.",
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
  "public.photoSaved": "Photo saved",
  "public.photoViewExisting": "View saved photo",

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
