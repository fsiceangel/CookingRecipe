import React from 'react';
import { Ingredient, IngredientCategory, UiText } from '../types';
import { HIDDEN_FILTER_CATEGORIES } from '../constants';
import { SearchIcon } from './Icons';
import IngredientChip from './IngredientChip';

interface IngredientFilterProps {
  groupedIngredients: Record<IngredientCategory, Ingredient[]>;
  selectedIngredients: Set<string>;
  onToggleIngredient: (key: string) => void;
  uiText: UiText;
}

const IngredientFilter: React.FC<IngredientFilterProps> = ({
  groupedIngredients,
  selectedIngredients,
  onToggleIngredient,
  uiText,
}) => {
  const visibleCategories = (Object.keys(groupedIngredients) as IngredientCategory[]).filter(
    category => !HIDDEN_FILTER_CATEGORIES.includes(category) && groupedIngredients[category]?.length,
  );

  return (
    <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mb-8">
      <h2 className="text-2xl font-bold text-primary-400 dark:text-primary-300 mb-4 flex items-center gap-2">
        <SearchIcon />
        {uiText.filterTitle}
      </h2>
      <div className="space-y-6">
        {visibleCategories.map(category => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-primary-500 dark:text-primary-400 mb-3 border-b border-sky-200 dark:border-slate-700 pb-2 capitalize">
              {uiText[category]}
            </h3>
            <div className="flex flex-wrap gap-2">
              {groupedIngredients[category].map(ingredient => (
                <IngredientChip
                  key={ingredient.key}
                  ingredient={ingredient.name}
                  isSelected={selectedIngredients.has(ingredient.key)}
                  onClick={() => onToggleIngredient(ingredient.key)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientFilter;
