#!/bin/bash
set -euo pipefail
[[ "${DEBUG:-0}" -eq 1 ]] && set -x

ARGUMENTS="$*"
trap 'echo "ERROR: ${BASH_SOURCE:-$BASH_COMMAND in $0}: ${FUNCNAME[0]:-line} at line: $LINENO, arguments: $ARGUMENTS" 1>&2; exit 1' ERR

pushd battleship-front-end
if command -v yarn &>/dev/null; then
  yarn install
else
  npm install
fi
npx webpack --mode production
popd

# https://github.com/spring-projects-experimental/spring-boot-thin-launcher
pushd battleship-back-end
mvn clean package -DskipTests -Pfe -Pthinjar
popd

cp battleship-back-end/target/battleship44-0.0.1.jar .
