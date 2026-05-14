export { lightThemeCSS } from './themes/light.js';
export { darkThemeCSS } from './themes/dark.js';
export { highContrastThemeCSS } from './themes/high-contrast.js';

export type Theme = 'light' | 'dark' | 'high-contrast';

/**
 * Apply a theme to the document
 * @param theme - The theme to apply
 */
export function applyTheme(theme: Theme): void {
  // Remove existing theme classes
  document.documentElement.classList.remove(
    'fk-theme-light',
    'fk-theme-dark',
    'fk-theme-high-contrast'
  );

  // Add new theme class
  document.documentElement.classList.add(`fk-theme-${theme}`);

  // Set data attribute for CSS targeting
  document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Get the current theme from the document
 * @returns The current theme or 'light' as default
 */
export function getCurrentTheme(): Theme {
  const theme = document.documentElement.getAttribute('data-theme') as Theme;
  return theme || 'light';
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme(): void {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
}
