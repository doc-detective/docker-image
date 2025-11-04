# Test Artifacts

This directory contains comprehensive test artifacts borrowed from [doc-detective/core](https://github.com/doc-detective/core) for thorough testing of the Doc Detective Docker images.

## Overview

These test artifacts validate various Doc Detective actions and ensure the Docker images work correctly across different platforms and browsers.

## Files

### Configuration
- **config.json**: Main configuration file that sets up test contexts for Chrome and Firefox browsers on different platforms
- **env**: Environment variables file used by tests (contains USER, JOB, SECRET, URL, WAIT variables)

### Spec Files
Test specification files that validate different Doc Detective actions:

- **test.spec.json**: Main comprehensive test that exercises multiple actions
- **setup.spec.json**: Setup tasks run before tests
- **cleanup.spec.json**: Cleanup tasks run after tests

#### Action-Specific Tests
- **checkLink.spec.json**: Tests link validation functionality
- **goTo.spec.json**: Tests navigation to URLs
- **find_matchText.spec.json**: Tests finding elements by text matching
- **find_rightClick.spec.json**: Tests right-click functionality
- **find_setVariables.spec.json**: Tests variable setting from found elements
- **runShell.spec.json**: Tests shell command execution
- **runShell_pipes.spec.json**: Tests piped shell commands
- **runCode.spec.json**: Tests code execution (JavaScript, Python, Bash)
- **screenshot.spec.json**: Tests screenshot capture functionality
- **type.spec.json**: Tests keyboard input
- **wait.spec.json**: Tests wait/delay functionality

#### Context-Specific Tests
- **context_chrome.spec.json**: Tests specific to Chrome browser
- **context_firefox.spec.json**: Tests specific to Firefox browser
- **context_safari.spec.json**: Tests specific to Safari browser

### Documentation Files
- **doc-content.md**: Sample markdown documentation with embedded test steps
- **httpRequestFormat.md**: Documentation for HTTP request formatting

### Server-Dependent Tests
The `requires-server/` subdirectory contains tests that require a running test server:
- **cookie-test.spec.json**: Tests cookie handling (requires localhost server)
- **dragAndDrop.spec.json**: Tests drag-and-drop functionality (requires localhost server)
- **httpRequest.spec.yaml**: Tests HTTP request actions (requires localhost server)

These are separated to avoid failures when running tests in CI/CD environments without a test server.

## Running Tests

### Full Test Suite
```bash
npm test
```

This runs all spec files in the test/artifacts directory (except those in requires-server/) inside the Docker container.

### Individual Spec Files
To run a specific spec file:
```bash
docker run --rm -v "$(pwd)/test/artifacts:/app" docdetective/docdetective:latest-linux \
  -c /app/config.json \
  -i /app/checkLink.spec.json
```

### With Test Server
To run server-dependent tests, first start a test server on port 8092, then:
```bash
docker run --rm --network=host -v "$(pwd)/test/artifacts:/app" docdetective/docdetective:latest-linux \
  -c /app/config.json \
  -i /app/requires-server/
```

## Test Results

Tests generate a `results.json` file with detailed information about:
- Spec pass/fail counts
- Test pass/fail counts
- Context execution results
- Individual step results

## Maintenance

These test artifacts are synchronized with [doc-detective/core](https://github.com/doc-detective/core/tree/main/test/artifacts) to ensure they remain up-to-date with the latest Doc Detective features and best practices.

To update artifacts from core:
```bash
# From test/artifacts directory
BASE_URL="https://raw.githubusercontent.com/doc-detective/core/main/test/artifacts"
wget -N "$BASE_URL/checkLink.spec.json"
# ... download other files as needed
```
