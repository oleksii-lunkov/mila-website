#!/usr/bin/env bash
# Creates the GitHub repo (if missing), pushes main and enables GitHub Pages from main:/ .
# Requires: git, gh (signed in: `gh auth login`).
set -euo pipefail

REPO_NAME="${REPO_NAME:-mila-potapova}"
cd "$(dirname "$0")"

if ! gh auth status >/dev/null 2>&1; then
  echo "GitHub CLI is not signed in. Run: gh auth login   (choose GitHub.com → HTTPS → browser)"; exit 1
fi

OWNER="$(gh api user --jq .login)"

if [ ! -d .git ]; then git init -b main; fi
git add -A
git commit -m "Site update" --quiet || true

if ! gh repo view "$OWNER/$REPO_NAME" >/dev/null 2>&1; then
  gh repo create "$OWNER/$REPO_NAME" --public --description "Personal brand website of Mila Potapova" \
    --source=. --remote=origin --push
else
  git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$OWNER/$REPO_NAME.git"
  git push -u origin main
fi

# Enable Pages (branch main, root). POST creates, PUT updates.
if ! gh api "repos/$OWNER/$REPO_NAME/pages" >/dev/null 2>&1; then
  gh api -X POST "repos/$OWNER/$REPO_NAME/pages" \
    -f build_type=legacy -f "source[branch]=main" -f "source[path]=/" >/dev/null
else
  gh api -X PUT "repos/$OWNER/$REPO_NAME/pages" \
    -f build_type=legacy -f "source[branch]=main" -f "source[path]=/" >/dev/null
fi

echo
echo "Published: https://$OWNER.github.io/$REPO_NAME/   (first build takes about a minute)"
