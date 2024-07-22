const path = require("path");
const assert = require("assert").strict;
const fs = require("fs");
const artifactPath = path.resolve(__dirname, "./artifacts");
const outputFile = path.resolve(artifactPath, "results.json");
const { exec } = require("child_process");

describe("Run tests sucessfully", function () {
  // Set indefinite timeout
  this.timeout(0);
  it("All specs pass", async () => {
    const runTests = await exec(
      `docker run -v ${artifactPath}:/app hawkeyexl/doc-detective:dev runTests -c ./config.json -i . -o ./results.json`
    );
    runTests.on("exit", () => {
      const result = JSON.parse(
        fs.readFileSync(outputFile, { encoding: "utf8" })
      );
      console.log(result);
      assert.equal(result.summary.specs.fail, 0);
      assert.equal(result.summary.contexts.skipped, 0);
      fs.unlinkSync(outputFile);
    });
  });
});
