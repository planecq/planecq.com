#!/bin/bash

# print outputs and exit on first failure
set -xe

# Compress assets with Zopfli
zopfli/zopfli --i1000 **/*.html *.html  **/*.css *.css **/*.js *.js **/*.xml *.xml
