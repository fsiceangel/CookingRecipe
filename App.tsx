import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Recipe, Ingredient, IngredientCategory, Tag } from './types';
import { translations } from './i18n/translations';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import IngredientChip from './components/IngredientChip';
import LanguageSwitcher from './components/LanguageSwitcher';
import ThemeSwitcher from './components/ThemeSwitcher';
import { LoadingIcon, SearchIcon, ChefHatIcon, CategoryIcon } from './components/Icons';

type Language = 'en' | 'cn' | 'fr';
type Theme = 'light' | 'dark';

const TAG_CATEGORIES: (Tag | 'all')[] = ['all', 'dish', 'bakery', 'dessert'];

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('cn');
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (localStorage.theme === 'light') {
        return 'light';
      }
    }
    return 'dark'; // Default to dark mode
  });
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<Tag | 'all'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const uiText = translations[language];

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';
    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }, []);

  const validateIngredientCategories = (recipesToValidate: Recipe[]) => {
    const categoryMap = new Map<string, IngredientCategory>();
    for (const recipe of recipesToValidate) {
      for (const ingredient of recipe.ingredients) {
        if (categoryMap.has(ingredient.key)) {
          const existingCategory = categoryMap.get(ingredient.key);
          if (existingCategory !== ingredient.category) {
            throw new Error(
              `Data integrity error: Inconsistent categories for ingredient key '${ingredient.key}'. ` +
              `Found '${existingCategory}' in one recipe and '${ingredient.category}' in '${recipe.title}'. ` +
              `Please correct the data in the JSON file.`
            );
          }
        } else {
          categoryMap.set(ingredient.key, ingredient.category);
        }
      }
    }
  };


  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`data/${language}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Recipe[] = await response.json();

        // Validate data integrity before setting state
        validateIngredientCategories(data);

        setRecipes(data);
      } catch (e: any) {
        console.error("Failed to fetch or validate recipes:", e);
        setError(e.message || uiText.error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [language, uiText.error]);
  
  const selectedRecipe = useMemo(() => {
    if (!selectedRecipeId) return null;
    return recipes.find(recipe => recipe.id === selectedRecipeId) || null;
  }, [recipes, selectedRecipeId]);

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
    const groups = uniqueIngredients.reduce((acc, ingredient) => {
      const { category } = ingredient;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(ingredient);
      return acc;
    }, {} as Record<IngredientCategory, Ingredient[]>);
    
    const localeMap: Record<Language, string> = {
      en: 'en-US',
      cn: 'zh-CN',
      fr: 'fr-FR',
    };

    for (const category in groups) {
      groups[category as IngredientCategory].sort((a, b) => a.name.localeCompare(b.name, localeMap[language]));
    }

    return groups;
  }, [uniqueIngredients, language]);

  const filteredRecipes = useMemo(() => {
    const tagFiltered = selectedTag === 'all'
      ? recipes
      : recipes.filter(recipe => recipe.tags.includes(selectedTag));

    if (selectedIngredients.size === 0) {
      return tagFiltered;
    }

    return tagFiltered.filter(recipe => {
      const recipeIngredientKeys = new Set(recipe.ingredients.map(ing => ing.key));
      return Array.from(selectedIngredients).every(selectedKey => recipeIngredientKeys.has(selectedKey));
    });
  }, [recipes, selectedIngredients, selectedTag]);

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
    setSelectedRecipeId(recipe.id);
  };

  const handleBackToList = () => {
    setSelectedRecipeId(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <LoadingIcon />
          <p className="mt-4 text-lg text-text-secondary">{uiText.loading}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center col-span-full py-12 bg-red-100 dark:bg-red-900/40 rounded-lg">
            <p className="text-red-700 dark:text-red-400 font-semibold">{error}</p>
        </div>
      );
    }
    
    if (selectedRecipe) {
      return <RecipeDetail recipe={selectedRecipe} onBack={handleBackToList} uiText={uiText} />;
    }

    const tagButtonBaseClasses = "px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-background focus:ring-primary-500";
    const tagButtonSelectedClasses = "bg-accent text-white shadow-lg hover:bg-accent-hover scale-105";
    const tagButtonUnselectedClasses = "bg-button-secondary text-button-secondary-text hover:bg-button-secondary-hover border border-button-secondary-border";

    return (
      <>
        <div className="bg-card-translucent backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-border mb-6">
          <h2 className="text-2xl font-bold text-accent-heading mb-4 flex items-center gap-2">
            <CategoryIcon />
            {uiText.tagFilterTitle}
          </h2>
          <div className="flex flex-wrap gap-3">
            {TAG_CATEGORIES.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`${tagButtonBaseClasses} ${selectedTag === tag ? tagButtonSelectedClasses : tagButtonUnselectedClasses}`}
              >
                {uiText[tag]}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card-translucent backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-border mb-8">
          <h2 className="text-2xl font-bold text-accent-heading mb-4 flex items-center gap-2">
            <SearchIcon />
            {uiText.filterTitle}
          </h2>
          <div className="space-y-6">
            {(Object.keys(groupedIngredients) as IngredientCategory[])
              .filter(category => category !== 'seasoning')
              .map(category =>
              groupedIngredients[category] && groupedIngredients[category].length > 0 && (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-accent-heading mb-3 border-b border-border pb-2 capitalize">
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
          <div className="text-center col-span-full py-12 bg-card-solid/60 rounded-lg">
            <p className="text-text-secondary">{uiText.noResults}</p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-border-header">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gradient-from to-gradient-to flex items-center gap-3">
            <ChefHatIcon />
            {uiText.title}
          </h1>
          <div className="flex items-center gap-2">
            <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
            <LanguageSwitcher currentLanguage={language} setLanguage={setLanguage} />
          </div>
        </header>

        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;