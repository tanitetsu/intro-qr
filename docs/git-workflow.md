# Git とデプロイ（intro-qr）

正本は常に **GitHub の `main`**。  
**デプロイ・Git 同期の考え方は姉妹リポ [AI_Cripping](https://github.com/tanitetsu/AI_Clipping_Mercari_to_Amazon)（クリッピング）と同仕様**（`check-git-sync` / 「同時に1本だけ」 / merge だけでは Agent はデプロイしない）。

## 用語

| 言葉 | 意味 |
|------|------|
| **main** | 本番の元になる本線 |
| **ブランチ** | main から分けた作業用の枝（Cloud Agent は `cursor/...` 枝が多い） |
| **PR** | 枝を main に入れる申請 |
| **デプロイ** | 本番 URL（Vercel）に反映すること。**git push とは別の概念**（Vercel では push がトリガーになる） |
| **自動デプロイ** | Vercel が GitHub の `main` への **push** を見てビルドする動き（Vercel 側の設定） |
| **同時デプロイ** | 上記と **CLI `vercel --prod` を同時に走らせる**こと（禁止） |

## 全体像

```text
【修正】
  スマホ / PC → Cloud Agent が枝 → PR →（確認）→ main に merge

【本番反映（通常）】
  main に merge 済み → origin へ push → Vercel Git 連携が 1 本デプロイ
  Agent は push 後に vercel CLI を叩かない（Vercel 任せ）

【本番反映（CLI・救急）】
  ユーザーが明示したときだけ ./scripts/deploy-vercel.sh
  最新 origin/main・作業ツリーきれい・Vercel 自動ビルドと同時に走らせない
```

### 守ること

1. **main に長い直しを直書きしない**（枝 + PR）
2. **作業開始前に同期**（`./check-git-sync.sh --agent`）
3. **デプロイは同時に 1 本だけ**（遅れ・分岐・衝突見込みが残れば中止）
4. **`main` に merge しただけでは Agent はデプロイコマンドを実行しない**（「デプロイして」と言われたときだけ。通常は merge + push で Vercel 任せ）
5. **一時トンネル**（trycloudflare / loca.lt）は本番共有禁止

## 同期チェック（PC と Cloud Agent で同じ）

| いつ | 何をするか |
|------|------------|
| **Cloud Agent** 修正前 | `./check-git-sync.sh --agent`（必須） |
| **PC** 修正・デプロイ前 | `.\check-git-sync.ps1 -PromptPull` |
| **CLI デプロイ** | `./scripts/deploy-vercel.sh` が内部で同期チェック（`--skip-git-sync-check` は明示時のみ） |

`--agent` の動き:

- **遅れのみ・衝突なし・きれい** → 自動 `git pull origin main`
- **ぶつかりそう／未コミット＋遅れ／分岐** → 警告して **exit 1**（修正に入らない）
- **進みのみ（push 忘れ）** → pull しない。push を促す

スキップ（非推奨）: `SKIP_GIT_SYNC_CHECK=1`

## デバイス別

| どこ | 修正 | 本番反映 |
|------|------|----------|
| Cloud Agent | 枝 → PR → merge。開始前に `./check-git-sync.sh --agent` | 通常は **merge 後の push のみ**（Vercel 自動）。CLI は依頼時のみ `deploy-vercel.sh` |
| 自宅 PC | 枝 → PR、または短い修正後すぐ push | Vercel ダッシュボード / Git push。CLI は `deploy-vercel.sh` または `vercel --prod`（依頼時） |

## Vercel 初回・環境変数

GitHub 連携の手順: [`GITHUB_VERCEL_SETUP.md`](GITHUB_VERCEL_SETUP.md)  
Supabase: [`DEPLOY_AND_SUPABASE.md`](DEPLOY_AND_SUPABASE.md)

## よく使うコマンド

```bash
git fetch origin main
git pull origin main
./check-git-sync.sh --agent

# 本番 CLI（ユーザー依頼・Git 連携が使えないとき）
./scripts/deploy-vercel.sh --dry-run
./scripts/deploy-vercel.sh
```

```powershell
.\check-git-sync.ps1 -PromptPull
```

## コミットしないもの

`.gitignore` 済み: `.env.local`、`node_modules/`、`.next/` など。
