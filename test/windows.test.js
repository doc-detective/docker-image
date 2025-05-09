// const { createServer } = require("./server");
const path = require("path");
const assert = require("assert").strict;
const fs = require("fs");
const artifactPath = path.resolve(__dirname, "./artifacts");
const outputFile = path.resolve(artifactPath, "results.json");
const { exec } = require("child_process");

// // Create a server with custom options
// const server = createServer({
//   port: 8080,
//   staticDir: './test/server/public',
//   modifyResponse: (req, body) => {
//     // Optional modification of responses
//     return { ...body, extraField: 'added by server' };
//   }
// });

// // Start the server before tests
// before(async () => {
//   try {
//     await server.start();
//   } catch (error) {
//     console.error(`Failed to start test server: ${error.message}`);
//     throw error;
//   }
// });

// // Stop the server after tests
// after(async () => {
//   try {
//     await server.stop();
//   } catch (error) {
//     console.error(`Failed to stop test server: ${error.message}`);
//     // Don't rethrow here to avoid masking test failures
//   }
// });

// Run tests in Docker container
describe("Run tests sucessfully", async function () {
  // Set indefinite timeout
  this.timeout(0);
  it("All specs pass", async () => {
    return new Promise((resolve, reject) => {
      const runTests = exec(
        `docker run --rm -v "${artifactPath}:C:\\app" docdetective/docdetective:windows -c ./config.json -i . -o ./results.json`
      );
      
      runTests.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
      });
      
      runTests.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
      });
      
      runTests.on("error", (error) => {
        console.error(`Error: ${error.message}`);
        reject(error);
      });
      
      runTests.on("close", (code) => {
        console.log(`Child process exited with code ${code}`);
        if (code !== 0) {
          reject(new Error(`Docker process exited with code ${code}`));
        }
      });
      
      runTests.on("exit", () => {
        try {
          const result = JSON.parse(
            fs.readFileSync(outputFile, { encoding: "utf8" })
          );
          console.log(JSON.stringify(result, null, 2));
          assert.equal(result.summary.specs.fail, 0);
          assert.equal(result.summary.contexts.skipped, 0);
          fs.unlinkSync(outputFile);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  });
});
