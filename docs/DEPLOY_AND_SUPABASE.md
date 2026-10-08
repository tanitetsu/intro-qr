# Vercel デプロイ & Supabase 接続手順

## 1. Vercel（公開URLで iPhone 確認）

### A. 今回作った一時デプロイを自分のアカウントに引き継ぐ（最短）

1. PCブラウザで Claim URL を開く（チャットに記載）
2. Vercel にログイン / 新規登録（GitHub 連携が簡単）
3. デプロイを自分のプロジェクトとして Claim
4. 発行された本番URLを iPhone Safari で開く

一時デプロイは短時間で消えるため、**必ず Claim** してください。

### B. Win11 から正式にデプロイする（推奨・以後これ）

前提: Node.js が入っていること

```powershell
cd <このリポジトリ>
npm install
npm i -g vercel
vercel login
vercel
vercel --prod
```

初回 `vercel` で聞かれる項目の目安:

- Set up and deploy? → **Y**
- Which scope? → 自分のアカウント
- Link to existing project? → **N**（初回）
- Project name? → `intro-qr` など
- Directory? → `./`（そのまま）

成功すると `https://xxxx.vercel.app` が出ます。  
それを iPhone で開けばOKです。

---

## 2. Supabase（あなたが行う手順）

こちらは **あなたのブラウザ操作** が必要です。完了後、発行される2つの値を共有してください。

### Step 1. プロジェクト作成

1. https://supabase.com を開く
2. **Start your project** / GitHub などでログイン
3. **New project**
4. 入力例:
   - Name: `intro-qr`
   - Database password: 自分で決めてメモ（あとで必要）
   - Region: `Northeast Asia (Tokyo)` があればそれ
5. **Create new project**（1〜2分待つ）

### Step 2. APIキーを控える

1. 左メニュー **Project Settings**（歯車）
2. **API**
3. 次をコピー:
   - **Project URL**（例: `https://xxxx.supabase.co`）
   - **anon public** key

※ `service_role` は秘密鍵なので、チャットやフロントには貼らないでください。

### Step 3. テーブル作成（SQL）

1. 左メニュー **SQL Editor**
2. **New query**
3. 下のSQLを貼って **Run**

```sql
-- 公開プロフィール用（最小）
create table if not exists public.profile_pages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  title text not null,
  slug text not null,
  display_name text not null,
  bio text,
  links jsonb not null default '[]'::jsonb,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profile_pages_owner_slug_uidx
  on public.profile_pages (owner_id, slug);

alter table public.profile_pages enable row level security;

-- 公開読取（QR先）
create policy "Public can read profile pages"
  on public.profile_pages
  for select
  using (true);

-- 本人のみ作成・更新・削除（ログイン後）
create policy "Owners can insert their pages"
  on public.profile_pages
  for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their pages"
  on public.profile_pages
  for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Owners can delete their pages"
  on public.profile_pages
  for delete
  using (auth.uid() = owner_id);
```

### Step 4. 認証を有効化（最初はメールでOK）

1. 左メニュー **Authentication** → **Providers**
2. **Email** が有効であることを確認
3. 開発中は「Confirm email」をオフにしても可  
   （本番前に戻す）

### Step 5. こちらへ共有するもの

次の2つだけ送ってください（パスワードや service_role は不要）:

```text
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

受け取ったら、アプリ側の接続実装を進めます。

### 補足（費用）

- Free プランで開始でOK
- 当面は公開プロフィールだけクラウド保存
- 保存した相手・顔写真は端末内のまま（費用を抑える）
