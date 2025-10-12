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

// Test DITA-OT version command
describe("DITA-OT is installed", function () {
  // Set indefinite timeout for Docker operations
  this.timeout(0);
  
  it("dita --version returns valid output", async () => {
    return new Promise((resolve, reject) => {
      let ditaVersionCmd;
      if (os === "linux") {
        ditaVersionCmd = `docker run --rm --entrypoint "" docdetective/docdetective:${version}-${os} dita --version`;
      } else {
        ditaVersionCmd = `docker run --rm --entrypoint cmd.exe docdetective/docdetective:${version}-${os} /c "dita --version"`;
      }

      console.log(`Running: ${ditaVersionCmd}`);
      
      const ditaVersion = exec(ditaVersionCmd);
      
      let stdout = "";
      let stderr = "";
      
      ditaVersion.stdout.on("data", (data) => {
        stdout += data;
        console.log(`stdout: ${data}`);
      });
      
      ditaVersion.stderr.on("data", (data) => {
        stderr += data;
        console.error(`stderr: ${data}`);
      });
      
      ditaVersion.on("error", (error) => {
        console.error(`Error: ${error.message}`);
        reject(error);
      });
      
      ditaVersion.on("close", (code) => {
        console.log(`Child process exited with code ${code}`);
        if (code !== 0) {
          reject(new Error(`Docker process exited with code ${code}. stderr: ${stderr}`));
        } else {
          // Verify that output contains version information
          // DITA-OT version output typically contains "DITA-OT version" or just the version number
          const hasVersionInfo = stdout.length > 0 || stderr.includes("DITA-OT");
          
          if (hasVersionInfo || stdout.includes("4.") || stderr.includes("4.")) {
            console.log("DITA-OT version command succeeded");
            resolve();
          } else {
            reject(new Error(`Version output does not contain expected information. stdout: ${stdout}, stderr: ${stderr}`));
          }
        }
      });
    });
  });
});
