export type IngredientCategory = 'meat' | 'veggie' | 'seasoning';

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
}

export interface Translations {
  [key: string]: {
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
  };
}