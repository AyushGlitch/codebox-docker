#!/bin/bash

# Update the package list
apt-get update

# Install PHP
apt-get install -y php

# Clean up
apt-get clean

# Verify PHP installation
php -v

