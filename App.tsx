import React, { useState, useMemo } from 'react';
import { Language, Recipe } from './types';
import { translations } from './i18n/translations';
import { useTheme } from './hooks/useTheme';
import { useRecipeData } from './hooks/useRecipeData';
import { useRecipeFilters } from './hooks/useRecipeFilters';
import RecipeDetail from './components/RecipeDetail';
import TagFilter from './components/TagFilter';
import IngredientFilter from './components/IngredientFilter';
import RecipeGrid from './components/RecipeGrid';
import LanguageSwitcher from './components/LanguageSwitcher';
import ThemeSwitcher from './components/ThemeSwitcher';
import { LoadingState, ErrorState } from './components/StatusViews';
import { ChefHatIcon } from './components/Icons';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('cn');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const uiText = translations[language];
  const { theme, toggleTheme } = useTheme();
  const { recipes, isLoading, error } = useRecipeData(language, uiText.error);
  const {
    selectedTag,
    setSelectedTag,
    selectedIngredients,
    toggleIngredient,
    groupedIngredients,
    filteredRecipes,
  } = useRecipeFilters(recipes, language);

  const selectedRecipe = useMemo(
    () => recipes.find(recipe => recipe.id === selectedRecipeId) ?? null,
    [recipes, selectedRecipeId],
  );

  const renderContent = () => {
    if (isLoading) return <LoadingState text={uiText.loading} />;
    if (error) return <ErrorState message={error} />;
    if (selectedRecipe) {
      return (
        <RecipeDetail
          recipe={selectedRecipe}
          onBack={() => setSelectedRecipeId(null)}
          uiText={uiText}
        />
      );
    }

    return (
      <>
        <TagFilter selectedTag={selectedTag} onSelectTag={setSelectedTag} uiText={uiText} />
        <IngredientFilter
          groupedIngredients={groupedIngredients}
          selectedIngredients={selectedIngredients}
          onToggleIngredient={toggleIngredient}
          uiText={uiText}
        />
        <RecipeGrid
          recipes={filteredRecipes}
          onSelectRecipe={(recipe: Recipe) => setSelectedRecipeId(recipe.id)}
          uiText={uiText}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-sky-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-sky-300 dark:border-slate-700">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600 flex items-center gap-3">
            <ChefHatIcon />
            {uiText.title}
          </h1>
          <div className="flex items-center gap-2">
            <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
            <LanguageSwitcher currentLanguage={language} setLanguage={setLanguage} />
          </div>
        </header>

        <main>{renderContent()}</main>
      </div>
    </div>
  );
};

export default App;
