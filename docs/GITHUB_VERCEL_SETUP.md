# Aルート: GitHub → Vercel 自動デプロイ（本番）

一時トンネルは使いません。  
**安定した本番URL**を作るための手順です。

---

## 全体像

```text
GitHub（コード置き場）
    ↓ 自動連携
Vercel（本番公開 https://xxxx.vercel.app）
    ↓
Supabase（公開プロフィールDB）
```

---

## Step 1. GitHub にリポジトリを作る

1. https://github.com/new を開く
2. 入力:
   - Repository name: `intro-qr`
   - Public / Private: どちらでも可（最初は Private でOK）
   - **Add a README はチェックしない**（空で作る）
3. **Create repository**

作成後に表示されるURLを控える（例）:
`https://github.com/<あなたの名前>/intro-qr.git`

---

## Step 2. コードを GitHub に載せる（Win11）

### 2-A. Cursor から GitHub に Publish できる場合（いちばん簡単）
Cursor の Source Control / Publish Branch から  
作った `intro-qr` リポジトリへ公開する。

### 2-B. コマンドで載せる場合
PowerShell（リポジトリフォルダで）:

```powershell
git remote remove github 2>$null
git remote add github https://github.com/<あなたの名前>/intro-qr.git
git checkout cursor/intro-qr-web-mvp
git push -u github cursor/intro-qr-web-mvp:main
```

成功すると GitHub の `intro-qr` にファイルが見えます。

---

## Step 3. Vercel と GitHub を接続して Import

1. https://vercel.com/new を開く
2. **Import Git Repository**
3. GitHub をまだ接続していなければ **Connect GitHub** → 許可
4. `intro-qr` を選んで **Import**
5. 設定:
   - Framework Preset: **Next.js**（自動認識されるはず）
   - Root Directory: `./`
   - Build Command: そのまま
   - Output: そのまま
6. **Environment Variables** を追加（Production）:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://rzomrytqcooatyhugpcc.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_XB42UdX9zwM3hdDDaJwqJw_SyQ8W12O` |

7. **Deploy**

---

## Step 4. 本番確認（ここが合格ライン）

デプロイ完了後のURL（例）:
`https://intro-qr-xxxx.vercel.app`

必ず確認:

1. **Safari** で開く → QRが出る
2. **Gmail / メモ / LINE** にURLを貼って開く → 開ける
3. 下タブ **ログイン** でアカウント作成
4. **ページ** → **クラウド同期**
5. QRがクラウド公開になる
6. 別のアプリからその公開URLを開く

---

## Step 5. 以後の更新（自動）

```powershell
git add .
git commit -m "更新内容"
git push github HEAD:main
```

push すると Vercel が自動で再デプロイします。

---

## つまずきポイント

### Supabase テーブル未作成
`docs/supabase-schema.sql` を SQL Editor で Run する。

### 古い racing-granite プロジェクト
使わなければ削除してOK。  
新しい GitHub連携プロジェクトを本番として使う。

### 環境変数を入れ忘れた
Vercel → Project → Settings → Environment Variables  
で追加したあと **Redeploy**。

---

## 完了したらこちらへ送るもの

```text
本番URL: https://....vercel.app
GitHub: https://github.com/<name>/intro-qr
クラウド同期: できた / エラー内容
他アプリから開けた: はい / いいえ
```
