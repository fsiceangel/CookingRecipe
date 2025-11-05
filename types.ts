export type IngredientCategory = 'meat' | 'veggie' | 'seasoning' | 'dairy' | 'pantry';

export type Tag = 'dish' | 'bakery' | 'dessert';

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
    dairy: string;
    pantry: string;
    tagFilterTitle: string;
    all: string;
    dish: string;
    bakery: string;
    dessert: string;
  };
}