import React from 'react';
import { SunIcon, MoonIcon } from './Icons';

type Theme = 'light' | 'dark';

interface ThemeSwitcherProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-button-secondary-text hover:text-primary-500 bg-card-header hover:bg-button-secondary-hover/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary-500 transition-colors duration-200 backdrop-blur-sm border border-white/20 dark:border-border"
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