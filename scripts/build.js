// Script to build Docker image with version from package.json
const { execSync } = require("child_process");

// Get arguments from command line
const args = process.argv.slice(2);

// Check if a custom version is specified with --version
let version = "latest";
const versionArgIndex = args.findIndex(arg => arg === '--version');
if (versionArgIndex !== -1 && versionArgIndex + 1 < args.length) {
  version = args[versionArgIndex + 1];
  console.log(`Building Docker image with version: ${version}`);
}

let os;
let tags;
let envVariables = {
  ...process.env,
};
if (process.platform === "win32") {
  os = "windows";
  tags = ["windows", "latest-windows", `${version}-windows`];
  envVariables.DOCKER_BUILDKIT = 0;
} else {
  os = "linux";
  tags = ["linux", "latest", "latest-linux", version, `${version}-linux`];
}
console.log(`Detected OS: ${os}`);
console.log(`Tags: ${tags}`);

// Construct '-t' arguments for Docker build
const tagArgs = tags
  .map((tag) => `-t docdetective/docdetective:${tag}`)
  .join(" ");
console.log(`Tag arguments: ${tagArgs}`);

let pullOption = "";
if (args.includes("--pull")) pullOption = "--pull ";

// Build the Docker command
let dockerCommand = `docker build ${pullOption} -f ./${os}.Dockerfile ${tagArgs} . --build-arg PACKAGE_VERSION=${version}`;

// Add --no-cache flag if requested
// Check if --no-cache is passed as an argument
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
