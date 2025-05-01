# Use Alpine Linux as the base image
FROM alpine:3.21

# Install Node.js, npm, Python, and pip with minimal dependencies
# Also clean up the apk cache to reduce image size
RUN apk add --no-cache \
    nodejs \
    npm \
    python3 \
    py3-pip \
    firefox \
    chromium \
    && rm -rf /var/cache/apk/*

# Install Doc Detective globally
RUN npm install -g doc-detective

# Verify installations
RUN node --version && \
    npm --version && \
    python3 --version && \
    pip3 --version && \
    firefox --version && \
    chromium-browser --version && \
    doc-detective --version

# Set the working directory
WORKDIR /app

# Default command
CMD ["/bin/sh"]