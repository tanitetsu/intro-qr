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

## Cursor ワークスペース

リポ: https://github.com/tanitetsu/intro-qr

**手元（Cursor デスクトップ / Web）**

1. 上のリポを Clone
2. `intro-qr.code-workspace` を Open（フォルダごと Open でも可）
3. `.env.example` を `.env.local` にコピーして Supabase 値を入れる
4. `npm install` → `npm run dev`

**Cloud Agent**

`.cursor/environment.json` で起動時に `npm install`、その後 `npm run dev` が走ります。  
Cursor の Environment 保存画面で提案中の設定を確認して保存してください。

- 修正前: `./check-git-sync.sh --agent`（[クリッピングと同仕様](docs/git-workflow.md)）
- 本番: merge 後は **push で Vercel 任せ**。merge だけでは Agent は CLI デプロイしない。CLI は依頼時のみ [`scripts/deploy-vercel.sh`](scripts/deploy-vercel.sh)
- **デバッグモード**で指示したとき: テスト完了後は「マージして」と言わなくても PR を merge 可（テスト省略は不可）

## 本番公開（推奨）

**GitHub → Vercel 自動デプロイ** を使います（`main` への push で 1 本）。  
**同時デプロイ禁止**（Vercel ビルド中に CLI `vercel --prod` を走らせない）。  
一時トンネル（trycloudflare / loca.lt）は本番利用禁止です。

手順: [`docs/GITHUB_VERCEL_SETUP.md`](docs/GITHUB_VERCEL_SETUP.md)  
運用ルール（Git・デプロイ）: [`docs/git-workflow.md`](docs/git-workflow.md)

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
2. ~~位置情報の任意自動提案~~（アルバム保存時・詳細の「現在地から入力」）
3. 後から Expo でアプリ化
