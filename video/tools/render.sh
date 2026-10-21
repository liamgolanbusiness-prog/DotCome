#!/usr/bin/env bash
# Render one or more variants to out/. Usage: tools/render.sh land-text port-text [land-vo port-vo]
set -euo pipefail
cd "$(dirname "$0")/.."
export NO_COLOR=1 HYPERFRAMES_NO_TELEMETRY=1
: "${HYPERFRAMES_BROWSER_PATH:=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell 2>/dev/null | head -1)}"
export HYPERFRAMES_BROWSER_PATH
mkdir -p out
variants=("$@")
[ ${#variants[@]} -eq 0 ] && variants=(land-text port-text)
for v in "${variants[@]}"; do
  case "$v" in land-*) tag=16x9 ;; port-*) tag=9x16 ;; *) echo "unknown variant $v"; exit 1 ;; esac
  npx hyperframes render "builds/$v" -o "out/dani-$tag-${v#*-}.mp4" -q high -f 30
done
