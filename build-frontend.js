import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '.');

const distDir = path.join(rootDir, 'dist');

console.log('🧹 Cleaning and creating dist directory...');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

const filesToCopy = ['index.html', 'styles.css', 'app.js'];
const dirsToCopy = ['pages', 'photos', 'js'];

// Filter to prevent copying any .ts files
const filterFunc = (src) => {
  const isTs = src.endsWith('.ts') || src.endsWith('.tsx');
  return !isTs;
};

console.log('📦 Copying frontend files to dist...');
for (const file of filesToCopy) {
  const srcPath = path.join(rootDir, file);
  const destPath = path.join(distDir, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`  ✓ Copied file: ${file}`);
  }
}

for (const dir of dirsToCopy) {
  const srcPath = path.join(rootDir, dir);
  const destPath = path.join(distDir, dir);
  if (fs.existsSync(srcPath)) {
    fs.cpSync(srcPath, destPath, { recursive: true, filter: filterFunc });
    console.log(`  ✓ Copied directory: ${dir}`);
  }
}

console.log('✨ Frontend build completed successfully!');
