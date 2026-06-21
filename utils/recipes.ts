import {
  Recipe,
  Ingredient,
  IngredientCategory,
  RecipeStructure,
  IngredientRegistry,
  TagFilterValue,
} from '../types';

/**
 * Merges structural recipe data (which includes inline translations) and the
 * ingredient registry into the runtime `Recipe[]` format that components expect.
 * Falls back to English, then the first available translation, for each recipe.
 */
export function mergeRecipeData(
  structures: RecipeStructure[],
  registry: IngredientRegistry,
  language: string,
): Recipe[] {
  return structures
    .map((structure): Recipe | null => {
      const translation =
        structure.translations[language] ||
        structure.translations['en'] ||
        Object.values(structure.translations)[0];

      if (!translation) {
        console.warn(`Missing translation for recipe: ${structure.id}`);
        return null;
      }

      const ingredients: Ingredient[] = structure.ingredientKeys.map((key, index) => {
        const translatedIng = translation.ingredients[index];
        return {
          key,
          name: translatedIng?.name ?? key,
          amount: translatedIng?.amount,
          category: registry[key] ?? 'pantry',
        };
      });

      return {
        id: structure.id,
        title: translation.title || structure.id,
        tags: structure.tags,
        difficulty: structure.difficulty,
        videoLink: structure.videoLink,
        ingredients,
        steps: translation.steps || [],
        notes: translation.notes || [],
      };
    })
    .filter((r): r is Recipe => r !== null);
}

/**
 * Collects each ingredient once (by key) across all recipes, using the
 * canonical standard name for display/filtering when available.
 */
export function getUniqueIngredients(
  recipes: Recipe[],
  standardNames: Record<string, string>,
): Ingredient[] {
  const byKey = new Map<string, Ingredient>();
  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ing => {
      if (!byKey.has(ing.key)) {
        byKey.set(ing.key, { ...ing, name: standardNames[ing.key] || ing.name });
      }
    });
  });
  return Array.from(byKey.values());
}

/** Groups ingredients by category, sorting each group by locale-aware name. */
export function groupIngredientsByCategory(
  ingredients: Ingredient[],
  locale: string,
): Record<IngredientCategory, Ingredient[]> {
  const groups = ingredients.reduce((acc, ingredient) => {
    (acc[ingredient.category] ??= []).push(ingredient);
    return acc;
  }, {} as Record<IngredientCategory, Ingredient[]>);

  for (const category in groups) {
    groups[category as IngredientCategory].sort((a, b) =>
      a.name.localeCompare(b.name, locale),
    );
  }

  return groups;
}

/**
 * Filters recipes by the selected category tag and the set of selected
 * ingredient keys (a recipe must contain every selected ingredient).
 */
export function filterRecipes(
  recipes: Recipe[],
  selectedTag: TagFilterValue,
  selectedIngredients: Set<string>,
): Recipe[] {
  const tagFiltered =
    selectedTag === 'all'
      ? recipes
      : recipes.filter(recipe => recipe.tags.includes(selectedTag));

  if (selectedIngredients.size === 0) {
    return tagFiltered;
  }

  return tagFiltered.filter(recipe => {
    const keys = new Set(recipe.ingredients.map(ing => ing.key));
    return Array.from(selectedIngredients).every(key => keys.has(key));
  });
}
