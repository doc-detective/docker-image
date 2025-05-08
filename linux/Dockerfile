# Builder stage to install packages and dependencies
FROM node:22-slim AS builder
ARG DOC_DETECTIVE_VERSION=latest

# Set environment container to trigger container-based behaviors
ENV CONTAINER=true

# Install dependencies
ENV DEBIAN_FRONTEND=noninteractive
RUN apt update \
    && apt install -y --no-install-recommends software-properties-common curl xz-utils \
    && apt autoclean -y \
    && apt autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# Install Doc Detective from NPM
RUN npm install -g doc-detective@$DOC_DETECTIVE_VERSION

# Final stage with minimal footprint
FROM node:22-slim AS runtime
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
ENV DEBIAN_FRONTEND=noninteractive

# Install only the essential dependencies for Chrome
RUN apt update \
    && apt install -y --no-install-recommends ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 \
    libatk1.0-0 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libglib2.0-0 \
    libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libx11-6 libx11-xcb1 libxcb1 \
    libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 \
    libxtst6 wget xdg-utils \
    && apt install -y gpg-agent \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy node modules from builder stage
COPY --from=builder /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=builder /usr/local/bin/doc-detective /usr/local/bin/doc-detective

# Create app directory
WORKDIR /app

# Add entrypoint command base
ENTRYPOINT [ "npx", "doc-detective" ]

# Set default command
CMD [ "" ]