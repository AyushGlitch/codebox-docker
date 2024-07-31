#!/bin/bash

# Update package list and install dependencies
apk update
apk add --no-cache python3 py3-pip

# Create symlinks for python and pip
ln -sf python3 /usr/bin/python
ln -sf pip3 /usr/bin/pip

# Verify Python installation
python --version
pip --version

# Optional: Install any additional Python packages you need
# pip install package_name

echo "Python installation completed."
