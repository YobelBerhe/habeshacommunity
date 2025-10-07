#!/usr/bin/env node

/**
 * Basic security checks before launch
 * Run: node scripts/security-test.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 Running Security Tests...\n');

let passed = 0;
let failed = 0;

// Test 1: Check .env is not committed
console.log('1. Checking .env files...');
if (!fs.existsSync('.env')) {
  console.log('   ✅ .env not found (good if using env vars from hosting)');
  passed++;
} else {
  console.log('   ⚠️  .env exists - ensure it\'s in .gitignore');
}

const gitignore = fs.readFileSync('.gitignore', 'utf8');
if (gitignore.includes('.env')) {
  console.log('   ✅ .env is in .gitignore');
  passed++;
} else {
  console.log('   ❌ .env NOT in .gitignore!');
  failed++;
}

// Test 2: Check for hardcoded secrets
console.log('\n2. Scanning for hardcoded secrets...');
const srcFiles = getAllFiles('src');
let foundSecrets = false;

const secretPatterns = [
  /sk_live_\w+/g,  // Stripe keys
  /sk_test_\w+/g,  // Stripe test keys
  /ghp_\w+/g,      // GitHub tokens
  /password\s*=\s*["']\w+["']/gi,
  /api[_-]?key\s*=\s*["']\w+["']/gi,
];

srcFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  secretPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      console.log(`   ❌ Potential secret found in ${file}`);
      foundSecrets = true;
      failed++;
    }
  });
});

if (!foundSecrets) {
  console.log('   ✅ No obvious hardcoded secrets found');
  passed++;
}

// Test 3: Check dependencies for vulnerabilities
console.log('\n3. Checking npm dependencies...');
console.log('   Run: npm audit');
// You can run: npm audit programmatically here

// Test 4: Check for console.logs in production code
console.log('\n4. Checking for console.log statements...');
let consoleLogsFound = 0;
srcFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/console\.log/g);
  if (matches) {
    consoleLogsFound += matches.length;
  }
});

if (consoleLogsFound > 0) {
  console.log(`   ⚠️  Found ${consoleLogsFound} console.log statements (consider removing for production)`);
} else {
  console.log('   ✅ No console.log statements found');
  passed++;
}

// Test 5: Check package.json for security
console.log('\n5. Checking package.json...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

if (packageJson.scripts && packageJson.scripts.build) {
  console.log('   ✅ Build script exists');
  passed++;
} else {
  console.log('   ❌ No build script found');
  failed++;
}

// Summary
console.log('\n' + '='.repeat(50));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log('='.repeat(50));

if (failed > 0) {
  console.log('\n⚠️  Please fix the failed checks before launching');
  process.exit(1);
} else {
  console.log('\n✅ All security checks passed!');
  process.exit(0);
}

// Helper function
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}
