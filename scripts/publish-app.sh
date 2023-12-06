#!/bin/bash
set -ex

dotnet publish ./app/Contoso.Api/Contoso.Api.csproj -c Release -o ./dist/app/linux-x64/ -r linux-x64 -f 'net8.0' --self-contained

pushd ./dist/app/linux-x64

zip -r -q -9 ../../app.linux-x64.zip *

popd

rm -rf ./dist/app