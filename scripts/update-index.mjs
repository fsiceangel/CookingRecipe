import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const recipesDir = path.join(__dirname, '..', 'public', 'data', 'recipes');
const privateDir = path.join(recipesDir, 'private');
const indexPath = path.join(__dirname, '..', 'public', 'data', 'index.json');

// Private recipes are only included locally (dev). They must never end up in the
// committed/deployed index, so production builds run this script WITHOUT the flag.
const includePrivate = process.argv.includes('--include-private');

/** Returns recipe IDs (filename without `.json`) for the .json files directly in `dir`. */
function recipeIdsIn(dir, prefix = '') {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith('.json'))
    .map(entry => prefix + entry.name.replace(/\.json$/, ''));
}

try {
  const ids = recipeIdsIn(recipesDir);

  if (includePrivate) {
    // IDs are prefixed with `private/` so the app fetches data/recipes/private/<id>.json.
    const privateIds = recipeIdsIn(privateDir, 'private/');
    ids.push(...privateIds);
    if (privateIds.length > 0) {
      console.log(`Including ${privateIds.length} private recipe(s) for local use.`);
    }
  }

  fs.writeFileSync(indexPath, JSON.stringify(ids, null, 2) + '\n');
  console.log(
    `Updated data/index.json with ${ids.length} recipe IDs${includePrivate ? '' : ' (public only)'}.`,
  );
} catch (error) {
  console.error('Error generating index.json:', error);
  process.exit(1);
}
