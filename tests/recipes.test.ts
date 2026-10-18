import { beforeAll, describe, expect, it } from 'vitest';
import { readCatalog } from '../scripts/content';
import { availableIngredients, emptyFilters, filterRecipes, translateRecipe } from '../src/domain/recipes';
import { type Catalog, type RecipeSource, recipeSchema } from '../src/domain/schema';
import { parseRoute, routeHref } from '../src/app/navigation';

let catalog: Catalog;
beforeAll(async () => { catalog = await readCatalog(); });
describe('Recipe content and filtering', () => {
  it('loads published content and renders each available or fallback language', () => {
    expect(catalog.recipes.length).toBeGreaterThan(0);
    for (const recipe of catalog.recipes) {
      for (const language of ['cn', 'en', 'fr'] as const) {
        expect(translateRecipe(recipe, catalog.ingredients, language).ingredients).toHaveLength(recipe.ingredients.length);
      }
    }
  });
  it('combines title search, category and ALL selected ingredient filters', () => {
    const recipes = catalog.recipes.filter(recipe => ['tomato-scrambled-eggs', 'butter-mochi-cake', 'braised-beef-shank'].includes(recipe.id)).map(recipe => translateRecipe(recipe, catalog.ingredients, 'cn'));
    const result = filterRecipes(recipes, { ...emptyFilters, query: '西红柿', tag: 'dish', ingredients: ['egg', 'tomato'] }, 'cn');
    expect(filterRecipes(recipes, { ...emptyFilters, ingredients: ['egg', 'tomato'] }, 'cn').map(recipe => recipe.id)).toEqual(['tomato-scrambled-eggs']);
    expect(result.map(recipe => recipe.id)).toEqual(['tomato-scrambled-eggs']);
    expect(filterRecipes(recipes, { ...emptyFilters, query: '西红柿', ingredients: ['milk'] }, 'cn')).toEqual([]);
  });
  it('finds French accents and English titles while browsing in Chinese', () => {
    const recipes = catalog.recipes.map(recipe => translateRecipe(recipe, catalog.ingredients, 'cn'));
    expect(filterRecipes(recipes, { ...emptyFilters, query: 'gateau mochi' }, 'cn').map(recipe => recipe.id)).toContain('butter-mochi-cake');
    expect(filterRecipes(recipes, { ...emptyFilters, query: '  TOMATO  ' }, 'cn').map(recipe => recipe.id)).toContain('tomato-scrambled-eggs');
  });
  it('sorts without mutating the input', () => {
    const recipes = catalog.recipes.map(recipe => translateRecipe(recipe, catalog.ingredients, 'cn'));
    const original = recipes.map(recipe => recipe.id);
    const sorted = filterRecipes(recipes, { ...emptyFilters, sort: 'difficulty' }, 'cn');
    expect(sorted.map(recipe => recipe.difficulty)).toEqual(sorted.map(recipe => recipe.difficulty).sort((a, b) => a - b));
    expect(recipes.map(recipe => recipe.id)).toEqual(original);
  });
  it('preserves repeated ingredient references with distinct row IDs', () => {
    const source = catalog.recipes.find(recipe => recipe.id === 'braised-beef-shank')!;
    const translated = translateRecipe(source, catalog.ingredients, 'cn');
    expect(translated.ingredients.filter(entry => entry.key === 'light-soy-sauce')).toHaveLength(3);
    expect(new Set(translated.ingredients.map(entry => entry.id)).size).toBe(translated.ingredients.length);
  });
  it('provides distinct cream labels and a standard egg-white name', () => {
    const options = availableIngredients(catalog, 'cn');
    expect(options.find(option => option.key === 'egg-white')?.name).toBe('蛋清');
    expect(options.find(option => option.key === 'light-cream')?.name).not.toBe(options.find(option => option.key === 'heavy-cream')?.name);
  });
  it('allows a Chinese-only recipe and falls back consistently', () => {
    const source: RecipeSource = {
      id: 'simple-tomato', tags: ['dish'], difficulty: 1, defaultLanguage: 'cn',
      ingredients: [{ id: 'tomato-1', ingredient: 'tomato', amount: { cn: '适量' } }],
      translations: { cn: { title: '番茄', steps: ['切块。'] } },
    };
    expect(recipeSchema.safeParse(source).success).toBe(true);
    const recipe = translateRecipe(source, catalog.ingredients, 'fr');
    expect(recipe.language).toBe('cn');
    expect(recipe.title).toBe('番茄');
    expect(recipe.ingredients[0]).toMatchObject({ name: '西红柿', amount: '适量' });
  });
});

describe('Shareable routes', () => {
  it('round trips search text and repeated ingredients through recipe and list links', () => {
    const filters = { ...emptyFilters, query: '番茄 & œuf', ingredients: ['egg', 'tomato'] };
    expect(parseRoute(routeHref('tomato-scrambled-eggs', filters))).toEqual({ recipeId: 'tomato-scrambled-eggs', filters });
    expect(parseRoute(routeHref(null, filters))).toEqual({ recipeId: null, filters });
  });
  it('tolerates malformed and unsupported URL values', () => {
    expect(parseRoute('#/recipes/%XX?tag=bad&sort=bad&ingredient=egg&ingredient=egg')).toEqual({ recipeId: '__invalid__', filters: { ...emptyFilters, ingredients: ['egg'] } });
  });
});
