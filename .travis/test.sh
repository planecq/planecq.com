#!/bin/bash

# print outputs and exit on first failure
set -xe

htmlproofer ./ --check-html --check-favicon --check-external-hash
