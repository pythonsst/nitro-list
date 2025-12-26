#!/usr/bin/env bash
set -e

# ----------------------------------------
# Config
# ----------------------------------------
BRANCH="main"
PACKAGE_NAME="react-native-nitro-list"

echo "🚀 Publishing $PACKAGE_NAME"
echo "----------------------------------------"

# ----------------------------------------
# Safety checks
# ----------------------------------------

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
  echo "❌ You must be on '$BRANCH' branch (current: $CURRENT_BRANCH)"
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Working tree is not clean"
  git status --short
  exit 1
fi

# ----------------------------------------
# NPM auth check
# ----------------------------------------

if ! npm whoami >/dev/null 2>&1; then
  echo "❌ Not logged in to npm"
  echo "👉 Run: npm login"
  exit 1
fi

# ----------------------------------------
# Build
# ----------------------------------------

echo "🔧 Building package..."
npm run build

# ----------------------------------------
# Dry run
# ----------------------------------------

echo "🧪 Running npm publish --dry-run"
npm publish --dry-run

read -p "✅ Dry-run looks good? Publish now? (y/N): " CONFIRM
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
  echo "❌ Publish aborted"
  exit 1
fi

# ----------------------------------------
# Publish
# ----------------------------------------

echo "📦 Publishing to npm..."
npm publish --access public

# ----------------------------------------
# Tag release
# ----------------------------------------

VERSION=$(node -p "require('./package.json').version")
git tag "v$VERSION"
git push origin "v$VERSION"

echo "✅ Published $PACKAGE_NAME@${VERSION}"
echo "🎉 Done"
