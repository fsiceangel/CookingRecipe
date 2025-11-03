
import React from 'react';

interface IngredientChipProps {
  ingredient: string;
  isSelected: boolean;
  onClick: () => void;
}

const IngredientChip: React.FC<IngredientChipProps> = ({ ingredient, isSelected, onClick }) => {
  const baseClasses = "px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-primary-500";
  const selectedClasses = "bg-primary-600 text-white shadow-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 scale-105";
  const unselectedClasses = "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600";

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