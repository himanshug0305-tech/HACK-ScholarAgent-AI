#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXTENSION_DIR="$ROOT/extension"
OUT_DIR="$ROOT/dashboard/public/downloads"
ZIP_NAME="scholaragent-companion.zip"
STORE_ZIP_NAME="scholaragent-companion-store.zip"
STAGE_DIR="$(mktemp -d)"
trap 'rm -rf "$STAGE_DIR"' EXIT

if ! command -v zip >/dev/null 2>&1; then
  echo "The 'zip' command is required to package the extension." >&2
  exit 1
fi

VERSION="$(node -p "JSON.parse(require('fs').readFileSync('$EXTENSION_DIR/manifest.json', 'utf8')).version")"

mkdir -p "$OUT_DIR" "$STAGE_DIR/scholaragent-companion"
cp -R "$EXTENSION_DIR"/. "$STAGE_DIR/scholaragent-companion/"
find "$STAGE_DIR" -name '.DS_Store' -delete

rm -f "$OUT_DIR/$ZIP_NAME" "$OUT_DIR/$STORE_ZIP_NAME"
(cd "$STAGE_DIR" && zip -qr "$OUT_DIR/$ZIP_NAME" "scholaragent-companion")
(cd "$EXTENSION_DIR" && zip -qr "$OUT_DIR/$STORE_ZIP_NAME" .)

echo "Packaged ScholarAgent ${VERSION}"
echo "  Download / unpacked install: $OUT_DIR/$ZIP_NAME"
echo "  Chrome Web Store upload:     $OUT_DIR/$STORE_ZIP_NAME"
