// Script to build Docker image with version from package.json
const { execSync } = require('child_process');
const path = require('path');
const packageJson = require('../package.json');

// Get version from package.json
const version = packageJson.version;
console.log(`Building Docker image with version: ${version}`);

// Check if --no-cache is passed as an argument
const args = process.argv.slice(2);
const useNoCache = args.includes('--no-cache');

// Build the Docker command
let dockerCommand = `docker build -f ./linux/Dockerfile -t docdetective/docdetective:latest . --build-arg PACKAGE_VERSION=${version}`;

// Add --no-cache flag if requested
if (useNoCache) {
  console.log('Using --no-cache option');
  dockerCommand += ' --no-cache';
}

// Execute the command
try {
  console.log(`Executing: ${dockerCommand}`);
  execSync(dockerCommand, { stdio: 'inherit' });
  console.log('Docker build completed successfully');
} catch (error) {
  console.error('Docker build failed:', error);
  process.exit(1);
}
