#!/bin/bash

# Update package lists
apt-get update

# Install curl
apt-get install -y curl

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Add Rust to PATH
source $HOME/.cargo/env

# Verify Rust installation
rustc --version
