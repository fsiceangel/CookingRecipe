import React from 'react';
import { Recipe, UiText } from '../types';
import RecipeCard from './RecipeCard';

interface RecipeGridProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  uiText: UiText;
}

const RecipeGrid: React.FC<RecipeGridProps> = ({ recipes, onSelectRecipe, uiText }) => {
  if (recipes.length === 0) {
    return (
      <div className="text-center col-span-full py-12 bg-white/60 dark:bg-slate-800/50 rounded-lg">
        <p className="text-slate-500 dark:text-slate-400">{uiText.noResults}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} onSelect={onSelectRecipe} />
      ))}
    </div>
  );
};

export default RecipeGrid;
