#!/bin/sh

rsync -av --delete \
  --exclude='package.json' \
  --exclude='appengine' \
  --exclude='demos' \
  --exclude='tests' \
    ./node_modules/blockly/ ./assets/blockly/scripts/blockly/
