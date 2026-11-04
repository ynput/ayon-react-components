#!/usr/bin/env sh
# Builds public/fonts/material-symbols-outlined.woff2 from the material-symbols package.
#
# The package's variable font has four axes (FILL, wght, GRAD, opsz) and is 3.1 MB. We only use
# outlined and filled icons, so every axis except FILL is pinned to the values in index.scss.
# All icons are kept: icon names come from user data (anatomy, statuses, folder types).
#
# Needs fonttools with brotli: pip install fonttools brotli
# Run again after updating material-symbols: yarn build:icon-font
set -e

SRC=node_modules/material-symbols/material-symbols-outlined.woff2
OUT=public/fonts/material-symbols-outlined.woff2
TMP=$(mktemp -d)

fonttools varLib.instancer "$SRC" FILL=0:1 wght=200 GRAD=200 opsz=20 -o "$TMP/instance.woff2"
# glyph names are not needed for ligatures
pyftsubset "$TMP/instance.woff2" --glyphs='*' --unicodes='*' --layout-features='*' \
  --no-glyph-names --notdef-outline --name-IDs='*' --flavor=woff2 --output-file="$OUT"

rm -rf "$TMP"
ls -l "$OUT"
