import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectRoot } from './content';
import { languages, type Language, type RecipeSource } from '../src/domain/schema';

export async function createDraft(root: string, id: string, language: Language, title: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || !languages.includes(language)) throw new Error('Invalid recipe ID or language');
  const recipe: RecipeSource = {
    $schema: '../recipe.schema.json', id, draft: true, tags: ['dish'], difficulty: 1,
    defaultLanguage: language,
    ingredients: [{ id: 'tomato-1', ingredient: 'tomato', amount: { [language]: 'TODO' } }],
    translations: { [language]: { title, steps: ['TODO'], notes: [] } },
  };
  await writeFile(resolve(root, 'content/recipes', `${id}.json`), JSON.stringify(recipe, null, 2) + '\n', { flag: 'wx' });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [id, ...args] = process.argv.slice(2);
  const language = (args.find(arg => arg.startsWith('--lang='))?.split('=')[1] ?? 'cn') as Language;
  const title = args.find(arg => arg.startsWith('--title='))?.slice(8) ?? id;
  if (!id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || !languages.includes(language)) {
    console.error('Usage: npm run recipe:new -- tomato-soup --lang=cn --title="番茄汤"');
    process.exitCode = 1;
  } else {
    try {
      await createDraft(projectRoot, id, language, title);
      console.log(`Created content/recipes/${id}.json (draft). Fill in ingredients and steps, then set draft to false. Existing files are never overwritten.`);
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    }
  }
}
