import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Recipe, Ingredient } from './types';
import { translations } from './i18n/translations';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import IngredientChip from './components/IngredientChip';
import LanguageSwitcher from './components/LanguageSwitcher';
import { LoadingIcon, SearchIcon, ChefHatIcon, ArrowLeftIcon } from './components/Icons';

type Language = 'en' | 'cn';
type IngredientCategory = 'meat' | 'veggie' | 'seasoning';

const ingredientCategoryMap: Record<string, IngredientCategory> = {
  // Meats
  'beef-hind-leg': 'meat',
  'beef-tallow': 'meat',
  'beef-tendon': 'meat',
  'chicken-breast': 'meat',
  'pork-belly': 'meat',
  
  // Veggies
  'garlic': 'veggie',
  'peanuts': 'veggie',
  'chili-pepper': 'veggie',
  'scallion': 'veggie',
  'ginger': 'veggie',
  'water-chestnut': 'veggie',
  'choy-sum': 'veggie',

  // Seasonings
  'baking-soda': 'seasoning',
  'salt': 'seasoning',
  'sugar': 'seasoning',
  'msg': 'seasoning',
  'cornstarch': 'seasoning',
  'ice-cubes': 'seasoning',
  'fried-garlic-crisps': 'seasoning',
  'shacha-sauce': 'seasoning',
  'vegetable-oil': 'seasoning',
  'sichuan-peppercorn': 'seasoning',
  'soy-sauce': 'seasoning',
  'vinegar': 'seasoning',
  'cooking-wine': 'seasoning',
  'pepper-powder': 'seasoning',
  'scallion-ginger-water': 'seasoning',
  'star-anise': 'seasoning',
  'cinnamon-bark': 'seasoning',
  'dark-soy-sauce': 'seasoning',
  'cornstarch-slurry': 'seasoning',
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('cn');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const uiText = translations[language];

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fix: Use a relative path to fetch recipe data. This resolves the TypeScript error
        // 'Property 'env' does not exist on type 'ImportMeta'' because it avoids using
        // Vite-specific environment variables that require special type declarations.
        // The relative path works correctly for assets in the public directory.
        const response = await fetch(`data/${language}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRecipes(data);
      } catch (e: any) {
        console.error("Failed to fetch recipes:", e);
        setError(uiText.error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [language, uiText.error]);

  const uniqueIngredients = useMemo(() => {
    const ingredientsMap = new Map<string, Ingredient>();
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        if (!ingredientsMap.has(ing.key)) {
          ingredientsMap.set(ing.key, ing);
        }
      });
    });
    return Array.from(ingredientsMap.values());
  }, [recipes]);

  const groupedIngredients = useMemo(() => {
    const groups: { [key in IngredientCategory]: Ingredient[] } = {
      meat: [],
      veggie: [],
      seasoning: [],
    };

    uniqueIngredients.forEach(ing => {
      const category = ingredientCategoryMap[ing.key];
      if (category) {
        groups[category].push(ing);
      }
    });
    
    for (const category in groups) {
      groups[category as IngredientCategory].sort((a, b) => a.name.localeCompare(b.name, language === 'cn' ? 'zh-CN' : 'en-US'));
    }

    return groups;
  }, [uniqueIngredients, language]);

  const filteredRecipes = useMemo(() => {
    if (selectedIngredients.size === 0) {
      return recipes;
    }
    return recipes.filter(recipe => {
      const recipeIngredientKeys = new Set(recipe.ingredients.map(ing => ing.key));
      return Array.from(selectedIngredients).every(selectedKey => recipeIngredientKeys.has(selectedKey));
    });
  }, [recipes, selectedIngredients]);

  const toggleIngredient = useCallback((ingredientKey: string) => {
    setSelectedIngredients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ingredientKey)) {
        newSet.delete(ingredientKey);
      } else {
        newSet.add(ingredientKey);
      }
      return newSet;
    });
  }, []);

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBackToList = () => {
    setSelectedRecipe(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <LoadingIcon />
          <p className="mt-4 text-lg text-gray-400">{uiText.loading}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center col-span-full py-12 bg-red-800/30 rounded-lg">
            <p className="text-red-400 font-semibold">{error}</p>
            <p className="text-gray-400 mt-2">Please ensure the `data` folder is inside a `public` folder in the project root.</p>
        </div>
      );
    }
    
    if (selectedRecipe) {
      return <RecipeDetail recipe={selectedRecipe} onBack={handleBackToList} uiText={uiText} />;
    }

    return (
      <>
        <div className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-primary-300 mb-4 flex items-center gap-2">
            <SearchIcon />
            {uiText.filterTitle}
          </h2>
          <div className="space-y-6">
            {(Object.keys(groupedIngredients) as IngredientCategory[]).map(category =>
              groupedIngredients[category].length > 0 && (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-primary-400 mb-3 border-b border-gray-700 pb-2 capitalize">
                    {uiText[category]}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {groupedIngredients[category].map(ingredient => (
                      <IngredientChip
                        key={ingredient.key}
                        ingredient={ingredient.name}
                        isSelected={selectedIngredients.has(ingredient.key)}
                        onClick={() => toggleIngredient(ingredient.key)}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} onSelect={handleSelectRecipe} />
          ))}
        </div>
        {filteredRecipes.length === 0 && !isLoading && !error && (
          <div className="text-center col-span-full py-12 bg-gray-800/30 rounded-lg">
            <p className="text-gray-400">{uiText.noResults}</p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 flex items-center gap-3">
            <ChefHatIcon />
            {uiText.title}
          </h1>
          <LanguageSwitcher currentLanguage={language} setLanguage={setLanguage} />
        </header>

        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;