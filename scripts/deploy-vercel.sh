#!/usr/bin/env bash
# Production deploy via Vercel CLI (Linux / Cloud Agent).
# Normal path: merge to main + push → Vercel Git integration deploys once.
# Use this only when the user explicitly asked to deploy via CLI, or Git hook is unavailable.
#
# Usage:
#   ./scripts/deploy-vercel.sh
#   ./scripts/deploy-vercel.sh --dry-run
#   ./scripts/deploy-vercel.sh --skip-git-sync-check
#
# Rules (same family as AI_Cripping): latest origin/main, clean tree, one deploy at a time.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SKIP_GIT_SYNC=0
ALLOW_NON_MAIN=0
ALLOW_DIRTY=0
DRY_RUN=0

usage() {
  sed -n '2,14p' "$0"
  exit 0
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-git-sync-check) SKIP_GIT_SYNC=1; shift ;;
    --allow-non-main) ALLOW_NON_MAIN=1; shift ;;
    --allow-dirty) ALLOW_DIRTY=1; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    -h|--help) usage ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

log() { printf '%s\n' "$*"; }
warn() { printf 'WARN: %s\n' "$*" >&2; }
die() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

assert_git_ready() {
  if [[ "$SKIP_GIT_SYNC" -eq 1 || "${SKIP_GIT_SYNC_CHECK:-}" == "1" ]]; then
    warn "Git sync check skipped."
    return 0
  fi
  ./check-git-sync.sh --fail-if-behind
  git fetch origin main >/dev/null 2>&1 || true
  local head main_sha
  head="$(git rev-parse HEAD)"
  main_sha="$(git rev-parse origin/main)"
  if [[ "$head" != "$main_sha" && "$ALLOW_NON_MAIN" -ne 1 ]]; then
    die "Deploy only from origin/main (HEAD=${head:0:7} main=${main_sha:0:7} branch=$(git rev-parse --abbrev-ref HEAD)). Merge first, or pass --allow-non-main only if explicitly requested."
  fi
  if [[ "$ALLOW_DIRTY" -ne 1 ]]; then
    if [[ -n "$(git status --porcelain)" ]]; then
      die "Working tree is not clean. Commit/stash first, or pass --allow-dirty only if explicitly requested."
    fi
  fi
}

assert_git_ready

if ! command -v vercel >/dev/null 2>&1; then
  die "vercel CLI not found. Install: npm i -g vercel"
fi

log "Deploy rules: one production deploy at a time."
log "If Vercel is already building from a recent push to main, do not run another deploy until it finishes."

if [[ "$DRY_RUN" -eq 1 ]]; then
  log "[dry-run] Git checks passed. Would run: vercel --prod"
  log "[dry-run] Prefer merge + push to main when Git integration is enabled."
  exit 0
fi

log "Running: vercel --prod"
vercel --prod
