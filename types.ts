export type IngredientCategory = 'meat' | 'veggie' | 'seasoning' | 'dairy' | 'pantry';

export type Tag = 'dish' | 'bakery' | 'dessert';

/** Supported UI languages. Single source of truth shared across the app. */
export type Language = 'en' | 'cn' | 'fr';

/** A tag value usable as a filter, including the "all" pseudo-tag. */
export type TagFilterValue = Tag | 'all';

// --- Raw data types (loaded from JSON files) ---

/** Raw translation entry */
export interface RecipeTranslation {
  title: string;
  ingredients: { name: string; amount?: string }[];
  steps: string[];
  notes?: string[];
}

/** Raw structure from recipes/[id].json */
export interface RecipeStructure {
  id: string;
  tags: Tag[];
  difficulty: number;
  videoLink?: string;
  ingredientKeys: string[];
  translations: Record<string, RecipeTranslation>;
}

/** Raw ingredient registry from ingredients.json */
export type IngredientRegistry = Record<string, IngredientCategory>;

// --- Runtime types (merged from raw data) ---

export interface Ingredient {
  key: string;
  name: string;
  amount?: string;
  category: IngredientCategory;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: Ingredient[];
  steps: string[];
  notes?: string[];
  videoLink?: string;
  tags: Tag[];
  difficulty: number;
}

/** The set of strings for a single language. */
export interface UiText {
  title: string;
  filterTitle: string;
  backButton: string;
  videoLink: string;
  ingredients: string;
  steps: string;
  notes: string;
  loading: string;
  error: string;
  noResults: string;
  meat: string;
  veggie: string;
  seasoning: string;
  dairy: string;
  pantry: string;
  tagFilterTitle: string;
  all: string;
  dish: string;
  bakery: string;
  dessert: string;
}

export type Translations = Record<Language, UiText>;