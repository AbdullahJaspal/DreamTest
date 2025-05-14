const fs = require('fs');
const {execSync} = require('child_process');

// Load package.json
console.log('Loading package.json...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

// Get all dependencies from package.json
console.log('Retrieving dependencies from package.json...');
const dependencies = Object.keys(packageJson.dependencies);

// Function to fetch the latest version from npm
const getLatestVersion = dependency => {
  try {
    console.log(`Fetching latest version for ${dependency}...`);
    const version = execSync(`npm show ${dependency} version`)
      .toString()
      .trim();
    console.log(`Latest version for ${dependency}: ${version}`);
    return version;
  } catch (error) {
    console.error(`Error fetching version for ${dependency}:`, error);
    return 'N/A';
  }
};

// Function to get the current version from package.json
const getCurrentVersion = dependency => {
  return packageJson.dependencies[dependency] || 'N/A';
};

const getExistingSupportEntry = (dep, readmeContent) => {
  // Escape special characters in the dependency name
  const escapedDep = dep.replace(/[-\/\\^$.*+?()[\]{}|]/g, '\\$&');

  // Adjusted regex pattern to match the correct structure
  const regex = new RegExp(
    `\\|\\s*${escapedDep}\\s*\\|\\s*[^|]*\\|\\s*[^|]*\\|\\s*([^|]*?)\\|`,
    'i',
  );

  const match = readmeContent.match(regex);

  if (match) {
    console.log(`Found existing support entry for ${dep}: ${match[1].trim()}`);
    return match[1].trim(); // Return existing entry without modification
  } else {
    console.log(`No existing entry found for ${dep}.`);
    return ''; // Return empty string if not found
  }
};

// Function to check if a dependency is upgradable
const isUpgradable = (currentVersion, latestVersion) => {
  // Remove caret (^) or tilde (~) from current version for comparison
  const cleanCurrentVersion = currentVersion.replace(/^[^0-9]*/, ''); // remove ^ or ~

  // Compare versions
  return cleanCurrentVersion < latestVersion ? '✅' : '❌'; // Green tick for upgradable, red cross otherwise
};

// Build the dependencies table
const createDependencyTable = () => {
  const readmePath = 'README.md';
  console.log('Reading README.md...');
  const readmeContent = fs.readFileSync(readmePath, 'utf-8');
  let table =
    '| Dependency Name | Current Version | Latest Version | Supports New Architecture? | Upgradable? | Notes |\n';
  table +=
    '|------------------|----------------|----------------|---------------------------|-------------|-------|\n';

  dependencies.forEach(dep => {
    const currentVersion = getCurrentVersion(dep);
    const latestVersion = getLatestVersion(dep);
    const existingSupport = getExistingSupportEntry(dep, readmeContent);

    // Keep the existing support entry if available; otherwise, leave it blank
    const supportsNewArchitecture = existingSupport;
    // Check if the dependency is upgradable
    const upgradeStatus = isUpgradable(currentVersion, latestVersion);

    table += `| ${dep} | ${currentVersion} | ${latestVersion} | ${supportsNewArchitecture} | ${upgradeStatus} |  |\n`;
  });

  console.log('Dependency table created successfully.');
  return table;
};

// Update README.md
const updateReadme = newTable => {
  const readmePath = 'README.md';
  console.log('Updating README.md...');
  const readmeContent = fs.readFileSync(readmePath, 'utf-8');
  const updatedContent = readmeContent.replace(
    /## Dependencies\n.*?\n\n/s,
    `## Dependencies\n\n${newTable}\n\n`,
  );
  fs.writeFileSync(readmePath, updatedContent);
  console.log('README.md updated successfully.');
};

// Execute the script
const newTable = createDependencyTable();
updateReadme(newTable);

console.log('Script execution completed.');
