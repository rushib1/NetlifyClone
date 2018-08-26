#!/bin/bash

dir="$(dirname "$0")"
: ${NETLIFY_REPO_URL="/opt/buildhome/repo"}
NETLIFY_BUILD_BASE="/opt/buildhome"

cmd=$*

BUILD_COMMAND_PARSER=$(cat <<EOF
$cmd
EOF
)

. "$dir/run-build-functions.sh"

rm -rf "$HOME/repo"
git clone "$HOME/repo_shave" "$NETLIFY_REPO_URL"
cd "$HOME/repo"

echo "Installing dependencies...."
install_dependencies 8.10.0

echo "Executing build command"
eval "$cmd"
CODE=$?
chmod -R a+rwx *

echo "Caching artifacts"
cache_artifacts

exit $CODE