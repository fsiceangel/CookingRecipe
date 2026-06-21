import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Vite copies the entire public/ directory into dist/, which would include any
// private recipes. Remove them after the build so they are never deployed.
const distPrivateDir = path.join(__dirname, '..', 'dist', 'data', 'recipes', 'private');

try {
  if (fs.existsSync(distPrivateDir)) {
    fs.rmSync(distPrivateDir, { recursive: true, force: true });
    console.log('Removed private recipes from dist/ build output.');
  } else {
    console.log('No private recipes in dist/ to remove.');
  }
} catch (error) {
  console.error('Error stripping private recipes from dist:', error);
  process.exit(1);
}
