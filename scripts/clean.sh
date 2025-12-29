set -e

echo "🧹 Cleaning everything..."

rm -rf node_modules lib dist build .turbo .cache
rm -f package-lock.json yarn.lock pnpm-lock.yaml
rm -rf nitrogen/generated

rm -rf ios/Pods ios/Podfile.lock ios/build
rm -rf android/.gradle android/build android/app/build

watchman watch-del-all 2>/dev/null || true
rm -rf /tmp/metro-* $TMPDIR/metro-* 2>/dev/null || true

echo "🚀 Reinstalling & rebuilding..."

npm install
npx codegen
npm run build

cd ios
bundle install
bundle exec pod install
cd ..

echo "🎉 Clean rebuild complete!"
