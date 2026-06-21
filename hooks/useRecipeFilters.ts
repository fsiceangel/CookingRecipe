import { useState, useMemo, useCallback } from 'react';
import { Recipe, Ingredient, IngredientCategory, Language, TagFilterValue } from '../types';
import { ingredientNames } from '../i18n/ingredientNames';
import { LOCALE_MAP } from '../constants';
import {
  getUniqueIngredients,
  groupIngredientsByCategory,
  filterRecipes,
} from '../utils/recipes';

interface UseRecipeFiltersResult {
  selectedTag: TagFilterValue;
  setSelectedTag: (tag: TagFilterValue) => void;
  selectedIngredients: Set<string>;
  toggleIngredient: (key: string) => void;
  groupedIngredients: Record<IngredientCategory, Ingredient[]>;
  filteredRecipes: Recipe[];
}

/** Owns the tag/ingredient filter selection and derives the filtered views. */
export function useRecipeFilters(recipes: Recipe[], language: Language): UseRecipeFiltersResult {
  const [selectedTag, setSelectedTag] = useState<TagFilterValue>('all');
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());

  const groupedIngredients = useMemo(() => {
    const unique = getUniqueIngredients(recipes, ingredientNames[language]);
    return groupIngredientsByCategory(unique, LOCALE_MAP[language]);
  }, [recipes, language]);

  const filteredRecipes = useMemo(
    () => filterRecipes(recipes, selectedTag, selectedIngredients),
    [recipes, selectedTag, selectedIngredients],
  );

  const toggleIngredient = useCallback((key: string) => {
    setSelectedIngredients(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  return {
    selectedTag,
    setSelectedTag,
    selectedIngredients,
    toggleIngredient,
    groupedIngredients,
    filteredRecipes,
  };
}
