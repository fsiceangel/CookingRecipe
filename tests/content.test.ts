import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateCatalog, readCatalog } from '../scripts/content';
import { createDraft } from '../scripts/new-recipe';
import { recipeSchema, type RecipeSource } from '../src/domain/schema';

let root: string;
const minimal: RecipeSource = { id: 'tomato-soup', tags: ['dish'], difficulty: 1, defaultLanguage: 'cn', ingredients: [{ id: 'tomato-1', ingredient: 'tomato' }], translations: { cn: { title: '番茄汤', steps: ['煮熟。'] } } };
beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'recipe-content-test-'));
  await mkdir(join(root, 'content/recipes'), { recursive: true });
  await writeFile(join(root, 'content/ingredients.json'), JSON.stringify({ tomato: { category: 'veggie', names: { cn: '番茄' } } }));
});
afterEach(async () => { await rm(root, { recursive: true, force: true }); });
async function save(recipe: RecipeSource) { await writeFile(join(root, 'content/recipes/tomato-soup.json'), JSON.stringify(recipe)); }
describe('Adding content', () => {
  it('discovers a new file without editing any index or application code', async () => {
    await save(minimal);
    expect((await generateCatalog(root)).recipes.map(recipe => recipe.id)).toEqual(['tomato-soup']);
    expect(JSON.parse(await readFile(join(root, 'public/data/catalog.json'), 'utf8')).version).toBe(1);
  });
  it('creates a valid draft, excludes it from publication, and never overwrites it', async () => {
    await createDraft(root, 'tomato-soup', 'cn', '番茄汤');
    expect((await readCatalog(root)).recipes).toEqual([]);
    await expect(createDraft(root, 'tomato-soup', 'cn', 'Overwrite')).rejects.toThrow();
    expect(JSON.parse(await readFile(join(root, 'content/recipes/tomato-soup.json'), 'utf8')).translations.cn.title).toBe('番茄汤');
  });
  it('excludes hidden recipes from generated data while preserving their source', async () => {
    await save({ ...minimal, hidden: true });
    expect((await generateCatalog(root)).recipes).toEqual([]);
    const published = await readFile(join(root, 'public/data/catalog.json'), 'utf8');
    expect(published).not.toContain(minimal.id);
    expect(published).not.toContain('番茄汤');
    expect(JSON.parse(await readFile(join(root, 'content/recipes/tomato-soup.json'), 'utf8')).hidden).toBe(true);
    await save({ ...minimal, hidden: false });
    expect((await generateCatalog(root)).recipes.map(recipe => recipe.id)).toEqual([minimal.id]);
  });
  it('keeps the family pound cake out of the public catalog', async () => {
    expect((await readCatalog()).recipes.some(recipe => /evelyn|jemerson/i.test(recipe.id))).toBe(false);
  });
  it('never publishes local private files, even without a hidden flag', async () => {
    await mkdir(join(root, 'content/private'), { recursive: true });
    await writeFile(join(root, 'content/private/tomato-soup.json'), JSON.stringify(minimal));
    expect((await generateCatalog(root)).recipes).toEqual([]);
  });
  it('loads private content only when explicitly requested and never writes it into the public catalog', async () => {
    await mkdir(join(root, 'content/private'), { recursive: true });
    await writeFile(join(root, 'content/private/tomato-soup.json'), JSON.stringify({ ...minimal, hidden: true }));
    expect((await readCatalog(root, { includePrivate: true })).recipes.map(recipe => recipe.id)).toEqual([minimal.id]);
    expect((await generateCatalog(root)).recipes).toEqual([]);
    expect(await readFile(join(root, 'public/data/catalog.json'), 'utf8')).not.toContain(minimal.id);
  });
  it('rejects duplicate IDs when combining public and private content', async () => {
    await save(minimal);
    await mkdir(join(root, 'content/private'), { recursive: true });
    await writeFile(join(root, 'content/private/tomato-soup.json'), JSON.stringify(minimal));
    await expect(readCatalog(root, { includePrivate: true })).rejects.toThrow('Duplicate recipe ID');
  });
  it('rejects unknown ingredients with the filename and reference', async () => {
    await save({ ...minimal, ingredients: [{ id: 'unknown-1', ingredient: 'unknown' }] });
    await expect(readCatalog(root)).rejects.toThrow(/tomato-soup.json.*unknown/s);
  });
  it('rejects mismatched file IDs', async () => {
    await save({ ...minimal, id: 'other-id' });
    await expect(readCatalog(root)).rejects.toThrow('id must match');
  });
  it('requires a default translation and unique entry IDs', () => {
    expect(recipeSchema.safeParse({ ...minimal, defaultLanguage: 'fr' }).success).toBe(false);
    expect(recipeSchema.safeParse({ ...minimal, ingredients: [minimal.ingredients[0], minimal.ingredients[0]] }).success).toBe(false);
  });
  it('rejects bad categories, unsafe video URLs, empty steps and accidental misspellings', () => {
    for (const changes of [{ tags: ['unknown'] }, { videoLink: 'javascript:alert(1)' }, { translations: { cn: { title: '番茄汤', steps: [] } } }, { dificultty: 3 }]) {
      expect(recipeSchema.safeParse({ ...minimal, ...changes }).success).toBe(false);
    }
  });
  it('prevents publishing placeholder content', () => {
    expect(recipeSchema.safeParse({ ...minimal, translations: { cn: { title: '番茄汤', steps: ['TODO'] } } }).success).toBe(false);
    expect(recipeSchema.safeParse({ ...minimal, draft: true, translations: { cn: { title: '番茄汤', steps: ['TODO'] } } }).success).toBe(true);
  });
  it('blocks path traversal in recipe creation', async () => {
    await expect(createDraft(root, '../outside', 'cn', 'bad')).rejects.toThrow('Invalid recipe ID');
  });
});
