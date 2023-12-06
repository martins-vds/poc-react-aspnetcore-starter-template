#!/bin/bash
## USAGE  ./replace-env.sh
set -ex

replace="$1"
with="$2"
directory="$3"

# Find js files in the directory and replace the environment variables
find $directory -type f -name "*.js" -print0 | while IFS= read -r -d '' file; do
    # case insensitive replace
    sed -i "s|$replace|$with|gI" $file
done