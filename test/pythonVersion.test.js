const { exec } = require("child_process");
const assert = require("assert").strict;

// Parse command line arguments
const args = process.argv.slice(2);
const versionArg = args.find(arg => arg.startsWith('--version=') || arg.startsWith('-v='));
const version = versionArg ? versionArg.split('=')[1] : 'latest';

let os;
if (process.platform === "win32") {
  os = "windows";
} else {
  os = "linux";
}

// Test Python version command
describe("Python is installed", function () {
  // Set indefinite timeout for Docker operations
  this.timeout(0);
  
  it("python --version returns valid output", async () => {
    return new Promise((resolve, reject) => {
      let pythonVersionCmd;
      if (os === "linux") {
        pythonVersionCmd = `docker run --rm --entrypoint "" docdetective/docdetective:${version}-${os} python3 --version`;
      } else {
        pythonVersionCmd = `docker run --rm --entrypoint cmd.exe docdetective/docdetective:${version}-${os} /c "python --version"`;
      }

      console.log(`Running: ${pythonVersionCmd}`);
      
      const pythonVersion = exec(pythonVersionCmd);
      
      let stdout = "";
      let stderr = "";
      
      pythonVersion.stdout.on("data", (data) => {
        stdout += data;
        console.log(`stdout: ${data}`);
      });
      
      pythonVersion.stderr.on("data", (data) => {
        stderr += data;
        console.error(`stderr: ${data}`);
      });
      
      pythonVersion.on("error", (error) => {
        console.error(`Error: ${error.message}`);
        reject(error);
      });
      
      pythonVersion.on("close", (code) => {
        console.log(`Child process exited with code ${code}`);
        if (code !== 0) {
          reject(new Error(`Docker process exited with code ${code}. stderr: ${stderr}`));
        } else {
          // Verify that output contains "Python" and a version number
          // Note: We check for "Python 3." rather than specific versions because:
          // - Linux uses Python from apt (currently 3.11.2)
          // - Windows uses Python from official installer (currently 3.13.1)
          // This flexible check ensures the test works across both platforms
          const trimmedStdout = stdout.trim();
          const trimmedStderr = stderr.trim();
          
          if (trimmedStdout.includes("Python 3.") || trimmedStderr.includes("Python 3.")) {
            console.log("Python 3.x confirmed");
            resolve();
          } else {
            reject(new Error(`Version output does not contain expected "Python 3.". stdout: ${trimmedStdout}, stderr: ${trimmedStderr}`));
          }
        }
      });
    });
  });
});
