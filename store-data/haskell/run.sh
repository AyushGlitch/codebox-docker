#!/bin/bash

# Update package lists
apt-get update

# Install minimal prerequisites
apt-get install -y curl libnuma-dev

# Install GHCup (Haskell toolchain installer)
curl --proto '=https' --tlsv1.2 -sSf https://get-ghcup.haskell.org | BOOTSTRAP_HASKELL_NONINTERACTIVE=1 GHCUP_INSTALL_BASE_PREFIX=/usr/local sh

# Add GHCup to PATH
export PATH="/usr/local/.ghcup/bin:$PATH"

# Install minimal GHC (Glasgow Haskell Compiler)
ghcup install ghc --set 9.2.7

# Install Cabal (Haskell build tool)
ghcup install cabal

# Verify Haskell installation
ghc --version
cabal --version

# Clean up
apt-get clean
rm -rf /var/lib/apt/lists/*
