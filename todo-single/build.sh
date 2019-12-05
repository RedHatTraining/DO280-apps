#!/bin/bash

echo "Preparing build folder"
rm -fr build
mkdir -p build
cp -ap nodejs-source/* build
rm build/*.sh
chmod -R a+rwX build

podman build --layers=false -t do280/todo-single .
