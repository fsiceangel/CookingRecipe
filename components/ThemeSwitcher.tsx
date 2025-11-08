import React from 'react';
import { SunIcon, MoonIcon } from './Icons';
import { Theme } from '../utils/theme';

interface ThemeSwitcherProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-sky-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-white bg-white/60 dark:bg-slate-700/50 hover:bg-sky-200/60 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-100 dark:focus:ring-offset-slate-900 focus:ring-primary-500 transition-colors duration-200 backdrop-blur-sm border border-white/20 dark:border-slate-700"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeSwitcher;