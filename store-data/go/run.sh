#!/bin/bash

# Update package lists
apt-get update

# Install Go
apt-get install -y golang-go

# Verify Go installation
go version
