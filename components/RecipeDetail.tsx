
import React from 'react';
import { Recipe } from '../types';
import { translations } from '../i18n/translations';
import { ArrowLeftIcon, VideoCameraIcon, ClipboardListIcon, BeakerIcon, LightBulbIcon } from './Icons';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  uiText: typeof translations['en'];
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onBack, uiText }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/60 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200 font-medium"
      >
        <ArrowLeftIcon />
        <span>{uiText.backButton}</span>
      </button>
      
      <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-700 dark:text-primary-400 mb-4">{recipe.title}</h2>

      {recipe.videoLink && (
        <a
          href={recipe.videoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 hover:scale-105 mb-8"
        >
          <VideoCameraIcon />
          {uiText.videoLink}
        </a>
      )}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2"><BeakerIcon /> {uiText.ingredients}</h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex justify-between items-center bg-slate-100 dark:bg-slate-700/50 p-3 rounded-md text-slate-700 dark:text-slate-200">
                <span>{ingredient.name}</span>
                {ingredient.amount && <span className="text-slate-500 dark:text-slate-400 font-medium">{ingredient.amount}</span>}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2"><ClipboardListIcon /> {uiText.steps}</h3>
            <ol className="space-y-4">
                {recipe.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 bg-primary-600 dark:bg-primary-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mt-1">{index + 1}</span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed pt-1">{step}</p>
                </li>
                ))}
            </ol>

            {recipe.notes && recipe.notes.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2"><LightBulbIcon /> {uiText.notes}</h3>
                    <div className="space-y-3 bg-slate-100/50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    {recipe.notes.map((note, index) => (
                        <p key={index} className="text-slate-600 dark:text-slate-400">{note}</p>
                    ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;