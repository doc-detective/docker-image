#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Push all DocDetective images if running in a GitHub Action
 */
function main() {
    // Check if running in GitHub Actions
    if (!process.env.GITHUB_ACTIONS) {
        console.log('Not running in GitHub Actions. Exiting.');
        process.exit(0);
    }

    console.log('Pushing docdetective/docdetective...');

    try {
        // Push image
        execSync(`docker push --all-tags docdetective/docdetective`, { stdio: 'inherit' });

        const tags = execSync(`docker images docdetective/docdetective --format "{{.Tag}}"`, { stdio: 'inherit' });
        console.log('Available tags:', tags.toString().trim());


        console.log('Pushed all tags for docdetective/docdetective image.');

    } catch (error) {
        console.error('Error pushing docdetective/docdetective image:', error.message);
        process.exit(1);
    }
}

main();