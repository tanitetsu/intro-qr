# 本番公開手順（Win11 → Vercel）

一時トンネル（trycloudflare / loca.lt）は本番利用禁止です。  
他アプリ（LINE / Gmail / Instagram）から開くリンクは、**Vercelの本番URL**を使います。

## 1. 準備

- Node.js インストール済み
- このリポジトリを取得済み
- Vercel アカウント作成済み（すでにあり）

## 2. デプロイ

PowerShell:

```powershell
cd <リポジトリのフォルダ>
git pull
npm install
npm i -g vercel

vercel login
vercel link
# 既存プロジェクト racing-granite-oc43vjb を選択

# 環境変数（Production に設定）
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# 入力値:
# https://rzomrytqcooatyhugpcc.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# 入力値:
# sb_publishable_XB42UdX9zwM3hdDDaJwqJw_SyQ8W12O

vercel --prod
```

## 3. 確認

本番URL例:

`https://racing-granite-oc43vjb.vercel.app`

確認項目:

1. Safari で開く → QR表示
2. Gmail / メモ にURLを貼って開く → 開ける
3. 「ログイン」→ アカウント作成
4. 「ページ」→ クラウド同期
5. QRが `/u/<cloudId>` になる
6. 別端末/別アプリからそのURLを開く

## 4. 運用ルール

- 共有するのは本番URLだけ
- trycloudflare / loca.lt は開発確認用のみ
- SQL（`docs/supabase-schema.sql`）未実行なら先に実行
