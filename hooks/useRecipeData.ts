import { useState, useEffect, useRef } from 'react';
import { Recipe, RecipeStructure, IngredientRegistry, Language } from '../types';
import { mergeRecipeData } from '../utils/recipes';

interface UseRecipeDataResult {
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Loads recipe structures + the ingredient registry once (cached across language
 * switches) and re-merges them into the runtime `Recipe[]` for the active language.
 */
export function useRecipeData(language: Language, errorFallback: string): UseRecipeDataResult {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Raw data contains every language, so it only needs to be fetched once.
  const structuresRef = useRef<RecipeStructure[] | null>(null);
  const registryRef = useRef<IngredientRegistry | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!structuresRef.current || !registryRef.current) {
          const [indexRes, regRes] = await Promise.all([
            fetch('data/index.json'),
            fetch('data/ingredients.json'),
          ]);
          if (!indexRes.ok) throw new Error(`Failed to load index.json: ${indexRes.status}`);
          if (!regRes.ok) throw new Error(`Failed to load ingredients.json: ${regRes.status}`);

          const indexIds: string[] = await indexRes.json();
          registryRef.current = await regRes.json();
          structuresRef.current = await Promise.all(
            indexIds.map(id =>
              fetch(`data/recipes/${id}.json`).then(res => {
                if (!res.ok) throw new Error(`Failed to load recipe ${id}.json`);
                return res.json();
              }),
            ),
          );
        }

        const merged = mergeRecipeData(structuresRef.current!, registryRef.current!, language);
        if (!cancelled) setRecipes(merged);
      } catch (e) {
        console.error('Failed to fetch or merge recipes:', e);
        if (!cancelled) setError(e instanceof Error ? e.message : errorFallback);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [language, errorFallback]);

  return { recipes, isLoading, error };
}
