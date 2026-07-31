import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting OneFeed Export Build...');

// 1. Ensure public directory exists
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 2. Build Singlefile Standalone HTML
console.log('📦 Bundling standalone index.html with inline CSS & JS...');
try {
  execSync('npx vite build --config vite.singlefile.config.ts', { stdio: 'inherit' });
  
  const singleFileSource = path.resolve('dist-singlefile/index.html');
  const singleFileTarget = path.join(publicDir, 'onefeed-standalone.html');
  
  if (fs.existsSync(singleFileSource)) {
    fs.copyFileSync(singleFileSource, singleFileTarget);
    const sizeMb = (fs.statSync(singleFileTarget).size / (1024 * 1024)).toFixed(2);
    console.log(`✅ Standalone singlefile HTML created successfully: ${singleFileTarget} (${sizeMb} MB)`);
  } else {
    console.error('❌ Singlefile build output not found!');
  }
} catch (err) {
  console.error('❌ Error building singlefile:', err.message);
}

// 3. Build Source ZIP Archive
console.log('📦 Zipping entire source codebase...');
try {
  const zipPath = path.join(publicDir, 'onefeed-source-code.zip');
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  // Ensure zip utility is installed
  try {
    execSync('which zip', { stdio: 'ignore' });
  } catch {
    console.log('Installing zip utility...');
    execSync('apt-get update && apt-get install -y zip', { stdio: 'inherit' });
  }

  // Zip command excluding node_modules, dist, dist-singlefile, .git, public/onefeed-source-code.zip
  const zipCmd = `zip -r ${zipPath} . -x "node_modules/*" "dist/*" "dist-singlefile/*" ".git/*" "public/onefeed-source-code.zip"`;
  execSync(zipCmd, { stdio: 'inherit' });
  
  const zipSizeMb = (fs.statSync(zipPath).size / (1024 * 1024)).toFixed(2);
  console.log(`✅ Source code ZIP created successfully: ${zipPath} (${zipSizeMb} MB)`);
} catch (err) {
  console.error('❌ Error zipping source code:', err.message);
}

console.log('🎉 Export process complete!');
