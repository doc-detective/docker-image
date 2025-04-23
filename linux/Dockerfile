FROM node:23-slim AS system
ARG PACKAGE_VERSION
ARG DOC_DETECTIVE_VERSION=latest

LABEL authors="Doc Detective"
LABEL description="The official Docker image for Doc Detective. Keep your docs accurate with ease."
LABEL version=$PACKAGE_VERSION
LABEL maintainer="hawkeyexl@gmail.com"
LABEL license="AGPL-3.0"
LABEL homepage="https://www.doc-detective.com"
LABEL repository="https://github.com/doc-detective/docker-image"
LABEL source="https://github.com/doc-detective/docker-image"
LABEL documentation="https://www.doc-detective.com"
LABEL vendor="Doc Detective"

# Set environment container to trigger container-based behaviors
ENV CONTAINER=true

# Install dependencies
ENV DEBIAN_FRONTEND=noninteractive
RUN apt update \
    && apt install -y --no-install-recommends software-properties-common curl \
    && apt autoclean -y \
    && apt autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# Install Google Chrome
RUN apt update \
    && apt install -y gpg-agent \
    && curl -LO https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && (dpkg -i ./google-chrome-stable_current_amd64.deb || apt-get install -fy) \
    && curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add \
    && rm google-chrome-stable_current_amd64.deb \
    && rm -rf /var/lib/apt/lists/*

# Install Doc Detective from NPM
RUN npm install -g doc-detective@$DOC_DETECTIVE_VERSION

# Create app directory
WORKDIR /app

# Add entrypoint command base
ENTRYPOINT [ "npx", "doc-detective" ]

# Set default command
# CMD [ "/bin/bash" ]
CMD [ "" ]