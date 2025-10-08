FROM mcr.microsoft.com/windows/server:ltsc2022 AS system
ARG PACKAGE_VERSION=latest

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
ENV DOC_DETECTIVE='{"container": "docdetective/docdetective:windows", "version": "'$PACKAGE_VERSION'"}'

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
    # Verify checksum
    # $shaText = (Invoke-RestMethod 'https://nodejs.org/dist/v22.15.0/SHASUMS256.txt'); \
    # $expected = ($shaText | Select-String 'node-v22.15.0-x64.msi').Line.Split(' ')[0]; \
    # if ((Get-FileHash -Path $NodeJsInstaller -Algorithm SHA256).Hash -ne $expected) { \
    #   Write-Error 'Node.js installer checksum mismatch' -ErrorAction Stop; \
    # } \
    # Install Node.js silently
    Start-Process -FilePath 'msiexec.exe' -ArgumentList '/i', "$NodeJsInstaller", '/quiet', '/norestart' -Wait; \
    # Clean up installer
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
    npm install -g doc-detective@$env:PACKAGE_VERSION

# Download and install Java (Azul Zulu OpenJDK 11)
RUN $JavaUrl = 'https://cdn.azul.com/zulu/bin/zulu11.76.21-ca-jdk11.0.25-win_x64.msi'; \
    $JavaInstaller = 'C:\java-installer.msi'; \
    Write-Host 'Downloading Azul Zulu OpenJDK 11...'; \
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; \
    Invoke-WebRequest -Uri $JavaUrl -OutFile $JavaInstaller -UseBasicParsing; \
    Write-Host 'Installing Java...'; \
    Start-Process msiexec.exe -ArgumentList '/i', $JavaInstaller, '/quiet', '/norestart', 'INSTALLDIR=C:\Java\zulu11' -NoNewWindow -Wait; \
    Write-Host 'Java installation completed'; \
    Remove-Item -Path $JavaInstaller -Force

# Add Java to PATH and set JAVA_HOME
RUN $env:JAVA_HOME = 'C:\Java\zulu11'; \
    [Environment]::SetEnvironmentVariable('JAVA_HOME', $env:JAVA_HOME, [System.EnvironmentVariableTarget]::Machine); \
    $env:Path = 'C:\Java\zulu11\bin;' + $env:Path; \
    [Environment]::SetEnvironmentVariable('Path', $env:Path, [System.EnvironmentVariableTarget]::Machine); \
    Write-Host "JAVA_HOME set to: $env:JAVA_HOME"; \
    java -version

# Download and install DITA-OT
RUN $DitaVersion = '4.3.4'; \
    $DitaUrl = "https://github.com/dita-ot/dita-ot/releases/download/$DitaVersion/dita-ot-$DitaVersion.zip"; \
    $DitaZip = 'C:\dita-ot.zip'; \
    Write-Host 'Downloading DITA-OT...'; \
    (New-Object System.Net.WebClient).DownloadFile($DitaUrl, $DitaZip); \
    Write-Host 'Extracting DITA-OT...'; \
    Expand-Archive -Path $DitaZip -DestinationPath 'C:\' -Force; \
    Move-Item -Path "C:\dita-ot-$DitaVersion" -Destination 'C:\dita-ot' -Force; \
    Remove-Item -Path $DitaZip -Force

# Add DITA-OT to PATH
RUN $env:Path = 'C:\dita-ot\bin;' + $env:Path; \
    [Environment]::SetEnvironmentVariable('Path', $env:Path, [System.EnvironmentVariableTarget]::Machine)

# Create app directory
WORKDIR /app

# Add entrypoint command base
ENTRYPOINT ["cmd.exe", "/c", "npx doc-detective"]

# ENTRYPOINT ["cmd.exe"]
# Set default command
CMD []