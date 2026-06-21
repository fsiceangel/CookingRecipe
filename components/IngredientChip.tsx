import React from 'react';
import { pillButtonClasses } from '../utils/styles';

interface IngredientChipProps {
  ingredient: string;
  isSelected: boolean;
  onClick: () => void;
}

const IngredientChip: React.FC<IngredientChipProps> = ({ ingredient, isSelected, onClick }) => (
  <button onClick={onClick} className={pillButtonClasses(isSelected)}>
    {ingredient}
  </button>
);

export default IngredientChip;