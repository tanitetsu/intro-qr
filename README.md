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

## 本番公開（推奨）

**GitHub → Vercel 自動デプロイ** を使います。  
一時トンネル（trycloudflare / loca.lt）は本番利用禁止です。

手順: [`docs/GITHUB_VERCEL_SETUP.md`](docs/GITHUB_VERCEL_SETUP.md)

必要な環境変数:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

## 注意

- 顔写真・保存した相手は端末内（ブラウザ）に保存
- 公開プロフィールは Supabase に同期可能
- Supabase テーブル作成 SQL: `docs/supabase-schema.sql`

## 次の予定

1. GitHub × Vercel で本番URL固定
2. 位置情報の任意自動提案
3. 後から Expo でアプリ化
