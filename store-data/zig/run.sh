#!/bin/bash

# Update package lists
apt-get update

# Install dependencies
apt-get install -y wget xz-utils

# Set Zig version and system architecture
ZIG_VERSION="0.11.0"
ARCH="linux-x86_64"

# Download Zig
wget "https://ziglang.org/download/${ZIG_VERSION}/zig-${ARCH}-${ZIG_VERSION}.tar.xz"

# Extract Zig
tar -xf zig-${ARCH}-${ZIG_VERSION}.tar.xz

# Remove existing Zig installation if it exists
if [ -d "/usr/local/zig" ]; then
    rm -rf /usr/local/zig
fi

# Move Zig to /usr/local
mv zig-${ARCH}-${ZIG_VERSION} /usr/local/zig

# Remove existing symlink if it exists
if [ -L "/usr/local/bin/zig" ]; then
    rm /usr/local/bin/zig
fi

# Create a new symlink
ln -s /usr/local/zig/zig /usr/local/bin/zig

# Clean up
rm zig-${ARCH}-${ZIG_VERSION}.tar.xz

# Verify Zig installation
zig version
