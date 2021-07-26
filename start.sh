#!/bin/bash
set -Eeuo pipefail
[[ "${DEBUG:-0}" -eq 1 ]] && set -x

ARGUMENTS="$*"
trap 'echo "ERROR: ${BASH_SOURCE:-$BASH_COMMAND in $0}: ${FUNCNAME[0]:-line} at line: $LINENO, arguments: $ARGUMENTS" 1>&2; exit 1' ERR

# Custom startup script. Before using, check if the startup parameters match your server configuration and your needs.
exec java -jar battleship44-0.0.1.jar \
  --server.port=8090 \
  --spring.resources.chain.enabled=true \
  --spring.resources.chain.compressed=true \
  --server.forward-headers-strategy=native \
  --spring.jackson.serialization.INDENT_OUTPUT=true
