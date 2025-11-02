
import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(recipe)}
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-primary-500/20 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-700 hover:border-primary-500"
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-primary-300 mb-3">{recipe.title}</h3>
        <div className="h-20 overflow-y-auto pr-2">
            <div className="flex flex-wrap gap-2">
            {recipe.ingredients.map((ing, index) => (
                <span key={index} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
                {ing.name}
                </span>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
