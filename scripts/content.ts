import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { recipeSchema, registrySchema, type Catalog } from '../src/domain/schema';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));
export async function readCatalog(root = projectRoot, options: { includePrivate?: boolean } = {}): Promise<Catalog> {
  const ingredients = registrySchema.parse(JSON.parse(await readFile(resolve(root, 'content/ingredients.json'), 'utf8')));
  const directories = options.includePrivate ? ['recipes', 'private'] : ['recipes'];
  const recipes: Catalog['recipes'] = [];
  const ids = new Set<string>();
  for (const directory of directories) {
    const files = (await readdir(resolve(root, 'content', directory)).catch(error => {
      if (directory === 'private' && error.code === 'ENOENT') return [];
      throw error;
    })).filter(file => file.endsWith('.json')).sort();
    for (const file of files) {
      try {
        const recipe = recipeSchema.parse(JSON.parse(await readFile(resolve(root, 'content', directory, file), 'utf8')));
        if (recipe.id !== basename(file, '.json')) throw new Error('id must match the filename');
        for (const entry of recipe.ingredients) {
          if (!ingredients[entry.ingredient]) throw new Error(`ingredients.${entry.id}: unknown ingredient "${entry.ingredient}"; add it to content/ingredients.json`);
        }
        if (ids.has(recipe.id)) throw new Error('Duplicate recipe ID across public and private content');
        ids.add(recipe.id);
        if (!recipe.draft && (directory === 'private' || !recipe.hidden)) recipes.push(recipe);
      } catch (error) {
        throw new Error(`content/${directory}/${file}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
  return { version: 1, recipes, ingredients };
}

export async function generateCatalog(root = projectRoot) {
  const catalog = await readCatalog(root);
  const target = resolve(root, 'public/data/catalog.json');
  await mkdir(resolve(root, 'public/data'), { recursive: true });
  const output = JSON.stringify(catalog);
  const previous = await readFile(target, 'utf8').catch(() => '');
  if (previous !== output) await writeFile(target, output);
  return catalog;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const catalog = await (process.argv.includes('--check') ? readCatalog() : generateCatalog());
    console.log(`Content valid: ${catalog.recipes.length} published recipes, ${Object.keys(catalog.ingredients).length} ingredients.`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
