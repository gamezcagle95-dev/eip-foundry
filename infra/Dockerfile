# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV NODE_VERSION=20.x

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION} | bash - \
    && apt-get install -y nodejs

# Set the working directory
WORKDIR /wurkspace

# Install Python dependencies (PyTorch)
RUN pip install --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# Install global node packages
RUN npm install -g hardhat

# Install Gitcoin Passport SDK dependencies (simulated as they are in package.json)
# RUN npm install @gitcoinco/passport-sdk-reader @gitcoinco/passport-sdk-types

CMD ["/bin/bash"]
