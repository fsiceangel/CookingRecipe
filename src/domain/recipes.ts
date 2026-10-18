import type { Catalog, Category, IngredientRegistry, Language, LocalizedText, RecipeSource, Tag } from './schema';

export type SortOrder = 'default' | 'difficulty' | 'title';
export interface Filters { query: string; tag: Tag | 'all'; ingredients: string[]; sort: SortOrder }
export const emptyFilters: Filters = { query: '', tag: 'all', ingredients: [], sort: 'default' };
export interface Recipe {
  id: string; title: string; tags: Tag[]; difficulty: number; videoLink?: string;
  language: Language; steps: string[]; notes: string[];
  ingredients: { id: string; key: string; name: string; amount?: string; category: Category }[];
  searchText: string;
}

export function localized(value: LocalizedText | undefined, language: Language, fallback: Language = 'cn'): string {
  return value?.[language] ?? value?.[fallback] ?? value?.en ?? value?.cn ?? value?.fr ?? '';
}
export function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();
}
export function translateRecipe(source: RecipeSource, registry: IngredientRegistry, language: Language): Recipe {
  const actualLanguage = source.translations[language] ? language : source.defaultLanguage;
  const translation = source.translations[actualLanguage]!;
  const ingredients = source.ingredients.map(entry => ({
    id: entry.id, key: entry.ingredient,
    name: localized(entry.name, actualLanguage, source.defaultLanguage) || localized(registry[entry.ingredient].names, actualLanguage),
    amount: localized(entry.amount, actualLanguage, source.defaultLanguage) || undefined,
    category: registry[entry.ingredient].category,
  }));
  // Search all available languages and standard names, even when the UI language differs.
  const searchable = [
    ...Object.values(source.translations).map(value => value.title),
    ...source.ingredients.flatMap(entry => [...Object.values(entry.name ?? {}), ...Object.values(registry[entry.ingredient].names)]),
  ];
  return { id: source.id, title: translation.title, tags: source.tags, difficulty: source.difficulty,
    videoLink: source.videoLink, language: actualLanguage, steps: translation.steps, notes: translation.notes ?? [], ingredients,
    searchText: normalizeSearch(searchable.join(' ')) };
}
export function filterRecipes(recipes: Recipe[], filters: Filters, language: Language): Recipe[] {
  const terms = normalizeSearch(filters.query).split(/\s+/).filter(Boolean);
  const result = recipes.filter(recipe =>
    (filters.tag === 'all' || recipe.tags.includes(filters.tag)) &&
    terms.every(term => recipe.searchText.includes(term)) &&
    filters.ingredients.every(key => recipe.ingredients.some(entry => entry.key === key)),
  );
  if (filters.sort === 'difficulty') result.sort((a, b) => a.difficulty - b.difficulty);
  if (filters.sort === 'title') result.sort((a, b) => a.title.localeCompare(b.title, locale(language)));
  return result;
}
export function locale(language: Language) { return { cn: 'zh-CN', en: 'en-US', fr: 'fr-FR' }[language]; }
export function availableIngredients(catalog: Catalog, language: Language) {
  const used = new Set(catalog.recipes.flatMap(recipe => recipe.ingredients.map(entry => entry.ingredient)));
  return Object.entries(catalog.ingredients).filter(([key]) => used.has(key)).map(([key, ingredient]) => ({
    key, category: ingredient.category, name: localized(ingredient.names, language),
  })).sort((a, b) => a.name.localeCompare(b.name, locale(language)));
}
