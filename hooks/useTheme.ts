import { useState, useEffect, useCallback } from 'react';
import { Theme, getInitialTheme, applyTheme } from '../utils/theme';

interface UseThemeResult {
  theme: Theme;
  toggleTheme: () => void;
}

/** Owns the light/dark theme state and keeps the document/localStorage in sync. */
export function useTheme(): UseThemeResult {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme };
}
