FROM mcr.microsoft.com/windows:ltsc2019 AS system
ARG PACKAGE_VERSION
ARG DOC_DETECTIVE_VERSION=latest

LABEL authors="Doc Detective" \
    description="The official Docker image for Doc Detective. Keep your docs accurate with ease." \
    version=$PACKAGE_VERSION \
    maintainer="manny@doc-detective.com" \
    license="AGPL-3.0" \
    homepage="https://www.doc-detective.com" \
    repository="https://github.com/doc-detective/docker-image" \
    source="https://github.com/doc-detective/docker-image" \
    documentation="https://www.doc-detective.com" \
    vendor="Doc Detective"

# Set environment container to trigger container-based behaviors
ENV CONTAINER=true

# Set up PowerShell with proper error handling and execution policy
SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]

# Set PowerShell execution policy to allow scripts to run
RUN Set-ExecutionPolicy Bypass -Scope Process -Force

# Configure TLS for secure downloads
RUN [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072

# Download and install Node.js directly from nodejs.org
RUN $NodeJsUrl = 'https://nodejs.org/dist/v22.15.0/node-v22.15.0-x64.msi'; \
    $NodeJsInstaller = 'C:\node-installer.msi'; \
    (New-Object System.Net.WebClient).DownloadFile($NodeJsUrl, $NodeJsInstaller); \
    Start-Process -FilePath 'msiexec.exe' -ArgumentList '/i', "$NodeJsInstaller", '/quiet', '/norestart' -Wait; \
    Remove-Item -Path $NodeJsInstaller -Force

# Add Node to PATH and verify installation
RUN $env:Path = 'C:\Program Files\nodejs;' + $env:Path; \
    [Environment]::SetEnvironmentVariable('Path', $env:Path, [System.EnvironmentVariableTarget]::Machine); \
    Set-ExecutionPolicy Bypass -Scope Process -Force; \
    node -v; \
    npm -v; \
    npm install -g npm@latest

# Install Doc Detective from NPM
RUN Set-ExecutionPolicy Bypass -Scope Process -Force; \
    npm install -g doc-detective@$env:DOC_DETECTIVE_VERSION

# Create app directory
WORKDIR /app

# Add entrypoint command base
ENTRYPOINT ["cmd.exe", "/c", "npx doc-detective"]

# ENTRYPOINT ["cmd.exe"]
# Set default command
CMD []