#!/bin/bash

# Update package lists
apt-get update

# Install Ruby
apt-get install -y ruby-full

# Verify Ruby installation
ruby --version
