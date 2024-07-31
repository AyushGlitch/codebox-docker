#!/bin/bash

# Update package lists
apt-get update

# Install TypeScript globally
npm install -g typescript

npm install -g ts-node

# Verify TypeScript installation
tsc --version
