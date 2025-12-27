#!/usr/bin/env bash
set -e

echo "🧨 [1/8] Kill Metro & Watchman"
pkill -f "react-native" || true
watchman watch-del-all || true

echo "🧨 [2/8] Clear Metro & RN caches"
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*
rm -rf $TMPDIR/react-*

echo "🧨 [3/8] Clean repo (git clean)"
npm run clean

echo "📦 [4/8] Install JS dependencies"
npm install

echo "⚙️ [5/8] Run Nitro codegen (unchanged)"
npm run codegen

echo "🧹 [6/8] Clean iOS build artifacts"
cd example/ios
rm -rf Pods Podfile.lock build
rm -rf ~/Library/Developer/Xcode/DerivedData/*

echo "📦 [7/8] Install Pods (New Architecture)"
RCT_NEW_ARCH_ENABLED=1 pod install --repo-update
cd ..

echo "🚀 [8/8] Run iOS app"
npx react-native run-ios --simulator="iPhone 16e"
