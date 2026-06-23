#!/usr/bin/env bash
# Rollback rapido alla release precedente.
# Usage:
#   ./scripts/rollback.sh staging   -> staging.backoffice.myevea.com
#   ./scripts/rollback.sh prod      -> backoffice.myevea.com
#
# Lista le ultime 5 release, chiede quale ripristinare.

set -euo pipefail

TARGET="${1:-}"

case "$TARGET" in
  staging) SITE="staging.backoffice.myevea.com" ;;
  prod)    SITE="backoffice.myevea.com" ;;
  *)
    echo "Usage: $0 <staging|prod>"
    exit 1
    ;;
esac

VPS="ubuntu@57.131.21.48"

echo "==> Release recenti su $SITE:"
ssh "$VPS" "ls -t /home/forge/$SITE/releases | head -10"
echo ""
echo "==> Current: $(ssh "$VPS" "readlink /home/forge/$SITE/current")"
echo ""
read -rp "Quale release ripristinare? (incolla il timestamp completo o 'q' per uscire): " TARGET_RELEASE

if [ "$TARGET_RELEASE" = "q" ] || [ -z "$TARGET_RELEASE" ]; then
  echo "Annullato."
  exit 0
fi

ssh "$VPS" "
  if [ ! -d /home/forge/$SITE/releases/$TARGET_RELEASE ]; then
    echo 'ERROR: release inesistente'
    exit 1
  fi
  sudo ln -sfn /home/forge/$SITE/releases/$TARGET_RELEASE /home/forge/$SITE/current
  echo 'Current: '\$(readlink /home/forge/$SITE/current)
"

echo "==> Rollback completo. Verifica: https://$SITE/"
