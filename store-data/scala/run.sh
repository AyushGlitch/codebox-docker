#!/bin/bash

# Update package lists
apt-get update

# Install Java
apt-get install -y default-jdk

# Install Scala
apt-get install -y scala

# Verify Scala installation
scala -version
