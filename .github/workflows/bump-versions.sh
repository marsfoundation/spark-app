#!/bin/sh

set -e

# update workspace dependencies to point to any version
jq '.dependencies |= with_entries(if .value == "workspace:^" then .value = "*" else . end)' package.json > temp.json && mv temp.json package.json
jq '.peerDependencies |= with_entries(if .value == "workspace:^" then .value = "*" else . end)' package.json > temp.json && mv temp.json package.json
echo "Updated workspace dependencies to '*'"

npm pkg set version=0.2.0-$(date +'%Y%m%d').$(git rev-parse --short HEAD)

echo "Version changed: $(npm pkg get version)"
