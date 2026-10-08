# Intro QR（Web先行MVP）

オフラインで出会った人と、**関心リンク中心の自己紹介**をQRで共有するWebアプリです。

## 今できること

- 起動ホームで **すぐQR表示**
- **左右スワイプ**で自己紹介ページ切替（複数ページ対応）
- 関心・連絡先リンクの作成/編集
- QR先の公開ページ閲覧（URLにページデータを載せる方式）
- 相手の保存（名前 / メモ / 場所・イベント名 / 保存日YYYY-MM-DD）
- 顔写真は **端末内のみ**（一覧の「写真」ボタンで表示）
- 保存一覧は **保存順**

## 技術スタック

- Next.js (App Router) + TypeScript + Tailwind CSS
- データ: いまは `localStorage`（後で Supabase へ移行予定）
- ホスティング想定: Vercel
- 将来アプリ化: Expo

## 開発

```bash
npm install
npm run dev
```

iPhone で試す場合:

1. 同じWi-Fi内のPCで `npm run dev -- --hostname 0.0.0.0`
2. iPhone Safari で `http://<PCのIP>:3000` を開く

## 注意（現状）

- 公開プロフィールの本命同期（Supabase）は未接続です
- QRは共有トークン方式（`/s/[token]`）なので、他端末でもページを開けます
- 顔写真・保存データはブラウザ端末内に残ります

## 次の予定

1. Supabase で公開ページをクラウド保存
2. 位置情報の任意自動提案
3. Vercel へデプロイ
4. 後から Expo でアプリ化
