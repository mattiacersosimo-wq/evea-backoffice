#!/usr/bin/env bash
# Deploy del backoffice React su VPS forge.
# Usage:
#   ./scripts/deploy.sh staging   -> staging.backoffice.myevea.com
#   ./scripts/deploy.sh prod      -> backoffice.myevea.com
#
# Step: npm run build -> tar -> scp -> atomic symlink switch -> reload nginx
# Rollback rapido: ssh ubuntu@VPS "sudo ln -sfn /home/forge/SITE/releases/<TS_PRECEDENTE> /home/forge/SITE/current"

set -euo pipefail

TARGET="${1:-}"
SKIP_BUILD="${2:-}"

case "$TARGET" in
  staging) SITE="staging.backoffice.myevea.com" ;;
  prod)    SITE="backoffice.myevea.com" ;;
  *)
    echo "Usage: $0 <staging|prod> [--skip-build]"
    exit 1
    ;;
esac

VPS="ubuntu@57.131.21.48"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TS=$(date +%Y%m%d_%H%M%S)
TAR="/tmp/build_${SITE}_${TS}.tar.gz"

echo "==> Deploy $SITE (release $TS)"

cd "$REPO_ROOT"

if [ "$SKIP_BUILD" != "--skip-build" ]; then
  if [ ! -d node_modules ]; then
    echo "==> npm install (node_modules mancante)"
    npm install --legacy-peer-deps
  fi
  echo "==> npm run build"
  npm run build
fi

if [ ! -f build/index.html ]; then
  echo "ERROR: build/ vuota. Builda prima di --skip-build."
  exit 1
fi

echo "==> Tar + upload"
tar -czf "$TAR" -C "$REPO_ROOT" build
scp -q "$TAR" "$VPS:/tmp/"

echo "==> Estrai sul VPS + switch symlink atomico"
ssh "$VPS" "
  set -e
  RELEASE=/home/forge/$SITE/releases/$TS
  OLD=\$(readlink /home/forge/$SITE/current 2>/dev/null || echo 'none')
  sudo mkdir -p \$RELEASE
  sudo tar -xzf $TAR -C \$RELEASE
  sudo chown -R forge:forge \$RELEASE
  sudo ln -sfn \$RELEASE /home/forge/$SITE/current
  sudo rm $TAR
  echo \"Previous: \$OLD\"
  echo \"Current:  \$(readlink /home/forge/$SITE/current)\"

  # Mantieni solo le ultime 10 release (cleanup automatico)
  cd /home/forge/$SITE/releases
  ls -t | tail -n +11 | xargs -r sudo rm -rf
"

rm -f "$TAR"
echo "==> Done. Verifica: https://$SITE/"

# ─────────────────────────────────────────────────────────────
# OTA LIVE UPDATES (solo per prod)
# ─────────────────────────────────────────────────────────────
# Dopo il deploy web, pubblica anche il bundle React come OTA update
# per l'app iOS/Android. Il plugin Capgo lo scarica al prossimo boot.
# Zip generato lato VPS (Windows Git Bash non ha 'zip' by default).
if [ "$TARGET" = "prod" ]; then
  echo ""
  echo "==> OTA: pubblico bundle per Live Updates app iOS/Android"
  BUNDLE_VERSION="ota-${TS}"
  RELEASED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

  ssh "$VPS" "
    set -e
    RELEASE=/home/forge/$SITE/releases/$TS
    UPD=/home/forge/api.myevea.com/current/public/updates
    BUNDLE=bundle_${BUNDLE_VERSION}.zip

    sudo -u forge mkdir -p \$UPD
    cd \$RELEASE/build
    sudo -u forge zip -qr \$UPD/\$BUNDLE .
    CHECKSUM=\$(sha256sum \$UPD/\$BUNDLE | awk '{print \$1}')

    sudo -u forge tee \$UPD/manifest.json > /dev/null <<JSON
{
  \"version\": \"${BUNDLE_VERSION}\",
  \"url\": \"https://api.myevea.com/updates/\$BUNDLE\",
  \"checksum\": \"\$CHECKSUM\",
  \"released_at\": \"${RELEASED_AT}\"
}
JSON

    # Mantieni solo gli ultimi 5 bundle
    cd \$UPD
    ls -t bundle_ota-*.zip 2>/dev/null | tail -n +6 | xargs -r sudo -u forge rm -f

    echo \"OTA bundle: \$UPD/\$BUNDLE (checksum \$CHECKSUM)\"
  "

  echo "==> OTA pubblicato: version=$BUNDLE_VERSION"
  echo "==> Manifest: https://api.myevea.com/updates/manifest.json"
  echo "==> Le app iOS/Android v16+ scaricheranno al prossimo boot"
fi
