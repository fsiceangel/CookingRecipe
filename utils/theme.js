export type Theme = 'light' | 'dark';

/**
 * Gets the initial theme from localStorage or returns 'dark' as a default.
 * This logic should match the inline script in index.html to avoid hydration issues.
 */
export const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.localStorage) {
    if (window.localStorage.getItem('theme') === 'light') {
      return 'light';
    }
  }
  return 'dark';
};

/**
 * Applies the given theme to the document and stores it in localStorage.
 * @param theme - The theme to apply ('light' or 'dark').
 */
export const applyTheme = (theme: Theme): void => {
  const root = window.document.documentElement;
  const isDark = theme === 'dark';

  root.classList.remove(isDark ? 'light' : 'dark');
  root.classList.add(theme);

  try {
    window.localStorage.setItem('theme', theme);
  } catch (error) {
    console.error('Failed to set theme in localStorage', error);
  }
};
