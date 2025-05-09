// Script to build Docker image with version from package.json
const { execSync } = require("child_process");
const path = require("path");
const packageJson = require("../package.json");

// Get version from package.json
const version = packageJson.version;
console.log(`Building Docker image with version: ${version}`);

let os;
let tags;
let envVariables = {
  ...process.env,
};
if (process.platform === "win32") {
  os = "windows";
  tags = ["windows", "latest-windows", `${version}-windows`];
  envVariables.DOCKER_BUILDKIT = 0;
  // Pull the latest Windows base image
  console.log("Pulling Windows base image...");
  execSync("docker pull mcr.microsoft.com/windows:ltsc2019", {
    stdio: "inherit",
  });
} else if (process.platform === "linux") {
  os = "linux";
  tags = ["linux", "latest", "latest-linux", version, `${version}-linux`];
} else {
  console.error("Unsupported platform:", process.platform);
  process.exit(1);
}
console.log(`Detected OS: ${os}`);
console.log(`Tags: ${tags}`);

// Construct '-t' arguments for Docker build
const tagArgs = tags
  .map((tag) => `-t docdetective/docdetective:${tag}`)
  .join(" ");
console.log(`Tag arguments: ${tagArgs}`);

// Build the Docker command
let dockerCommand = `docker build -f ./${os}.Dockerfile ${tagArgs} . --build-arg PACKAGE_VERSION=${version}`;

// Add --no-cache flag if requested
// Check if --no-cache is passed as an argument
const args = process.argv.slice(2);
const useNoCache = args.includes("--no-cache");
if (useNoCache) {
  console.log("Using --no-cache option");
  dockerCommand += " --no-cache";
}

console.log(`Docker command: ${dockerCommand}`);

// Execute the command
try {
  console.log(`Executing: ${dockerCommand}`);

  execSync(dockerCommand, {
    stdio: "inherit",
    env: envVariables,
  });

  console.log("Docker build completed successfully");
} catch (error) {
  console.error("Docker build failed:", error);
  process.exit(1);
}
