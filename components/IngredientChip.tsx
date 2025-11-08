
import React from 'react';

interface IngredientChipProps {
  ingredient: string;
  isSelected: boolean;
  onClick: () => void;
}

const IngredientChip: React.FC<IngredientChipProps> = ({ ingredient, isSelected, onClick }) => {
  const baseClasses = "px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-background focus:ring-primary-500";
  const selectedClasses = "bg-accent text-white shadow-lg hover:bg-accent-hover scale-105";
  const unselectedClasses = "bg-button-secondary text-button-secondary-text hover:bg-button-secondary-hover border border-button-secondary-border";

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