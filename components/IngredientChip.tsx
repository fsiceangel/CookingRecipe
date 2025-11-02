
import React from 'react';

interface IngredientChipProps {
  ingredient: string;
  isSelected: boolean;
  onClick: () => void;
}

const IngredientChip: React.FC<IngredientChipProps> = ({ ingredient, isSelected, onClick }) => {
  const baseClasses = "px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  const selectedClasses = "bg-primary-600 text-white shadow-lg hover:bg-primary-500 scale-105";
  const unselectedClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
    >
      {ingredient}
    </button>
  );
};

export default IngredientChip;
