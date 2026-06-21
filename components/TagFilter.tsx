import React from 'react';
import { TagFilterValue, UiText } from '../types';
import { TAG_CATEGORIES } from '../constants';
import { CategoryIcon } from './Icons';
import { pillButtonClasses } from '../utils/styles';

interface TagFilterProps {
  selectedTag: TagFilterValue;
  onSelectTag: (tag: TagFilterValue) => void;
  uiText: UiText;
}

const TagFilter: React.FC<TagFilterProps> = ({ selectedTag, onSelectTag, uiText }) => (
  <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mb-6">
    <h2 className="text-2xl font-bold text-primary-400 dark:text-primary-300 mb-4 flex items-center gap-2">
      <CategoryIcon />
      {uiText.tagFilterTitle}
    </h2>
    <div className="flex flex-wrap gap-3">
      {TAG_CATEGORIES.map(tag => (
        <button
          key={tag}
          onClick={() => onSelectTag(tag)}
          className={pillButtonClasses(selectedTag === tag)}
        >
          {uiText[tag]}
        </button>
      ))}
    </div>
  </div>
);

export default TagFilter;
