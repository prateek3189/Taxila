import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Simple CSS generation function
function generateCSSVariables(tokens, prefix = 'fk') {
  const cssVars = [];
  
  function processTokens(obj, path = '') {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'object' && '$value' in value) {
        const cssVar = `--${prefix}-${currentPath.replace(/\./g, '-')}`;
        cssVars.push(`  ${cssVar}: ${value.$value};`);
      } else if (typeof value === 'object') {
        processTokens(value, currentPath);
      } else if (typeof value === 'string') {
        const cssVar = `--${prefix}-${currentPath.replace(/\./g, '-')}`;
        cssVars.push(`  ${cssVar}: ${value};`);
      }
    }
  }
  
  processTokens(tokens);
  
  return `:root {\n${cssVars.join('\n')}\n}`;
}

// Light theme tokens
const lightTheme = {
  color: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
    neutral: {
      white: '#ffffff',
      black: '#000000',
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
  },
  surface: {
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f8fafc',
    'muted-foreground': '#64748b',
    popover: '#ffffff',
    'popover-foreground': '#0f172a',
    card: '#ffffff',
    'card-foreground': '#0f172a',
    border: '#e2e8f0',
    input: '#e2e8f0',
    ring: '#0ea5e9',
  },
  content: {
    primary: '#0284c7',
    'primary-foreground': '#ffffff',
    secondary: '#f1f5f9',
    'secondary-foreground': '#0f172a',
    destructive: '#ef4444',
    'destructive-foreground': '#ffffff',
    muted: '#f1f5f9',
    'muted-foreground': '#64748b',
    accent: '#f1f5f9',
    'accent-foreground': '#0f172a',
  },
};

// Dark theme tokens
const darkTheme = {
  color: {
    primary: {
      50: '#082f49',
      100: '#0c4a6e',
      200: '#075985',
      300: '#0369a1',
      400: '#0284c7',
      500: '#0ea5e9',
      600: '#38bdf8',
      700: '#7dd3fc',
      800: '#bae6fd',
      900: '#e0f2fe',
      950: '#f0f9ff',
    },
    secondary: {
      50: '#020617',
      100: '#0f172a',
      200: '#1e293b',
      300: '#334155',
      400: '#475569',
      500: '#64748b',
      600: '#94a3b8',
      700: '#cbd5e1',
      800: '#e2e8f0',
      900: '#f1f5f9',
      950: '#f8fafc',
    },
    success: {
      50: '#052e16',
      100: '#14532d',
      200: '#166534',
      300: '#15803d',
      400: '#16a34a',
      500: '#22c55e',
      600: '#4ade80',
      700: '#86efac',
      800: '#bbf7d0',
      900: '#dcfce7',
      950: '#f0fdf4',
    },
    warning: {
      50: '#451a03',
      100: '#78350f',
      200: '#92400e',
      300: '#b45309',
      400: '#d97706',
      500: '#f59e0b',
      600: '#fbbf24',
      700: '#fcd34d',
      800: '#fde68a',
      900: '#fef3c7',
      950: '#fffbeb',
    },
    error: {
      50: '#450a0a',
      100: '#7f1d1d',
      200: '#991b1b',
      300: '#b91c1c',
      400: '#dc2626',
      500: '#ef4444',
      600: '#f87171',
      700: '#fca5a5',
      800: '#fecaca',
      900: '#fee2e2',
      950: '#fef2f2',
    },
    neutral: {
      white: '#000000',
      black: '#ffffff',
      50: '#0a0a0a',
      100: '#171717',
      200: '#262626',
      300: '#404040',
      400: '#525252',
      500: '#737373',
      600: '#a3a3a3',
      700: '#d4d4d4',
      800: '#e5e5e5',
      900: '#f5f5f5',
      950: '#fafafa',
    },
  },
  surface: {
    background: '#0f172a',
    foreground: '#f8fafc',
    muted: '#1e293b',
    'muted-foreground': '#94a3b8',
    popover: '#1e293b',
    'popover-foreground': '#f8fafc',
    card: '#1e293b',
    'card-foreground': '#f8fafc',
    border: '#334155',
    input: '#334155',
    ring: '#38bdf8',
  },
  content: {
    primary: '#38bdf8',
    'primary-foreground': '#0f172a',
    secondary: '#334155',
    'secondary-foreground': '#f8fafc',
    destructive: '#f87171',
    'destructive-foreground': '#0f172a',
    muted: '#334155',
    'muted-foreground': '#94a3b8',
    accent: '#334155',
    'accent-foreground': '#f8fafc',
  },
};

// High contrast theme tokens
const highContrastTheme = {
  color: {
    primary: {
      50: '#000000',
      100: '#000000',
      200: '#000000',
      300: '#000000',
      400: '#000000',
      500: '#0000ff',
      600: '#0000ff',
      700: '#0000ff',
      800: '#0000ff',
      900: '#0000ff',
      950: '#ffffff',
    },
    secondary: {
      50: '#000000',
      100: '#000000',
      200: '#000000',
      300: '#000000',
      400: '#000000',
      500: '#808080',
      600: '#808080',
      700: '#808080',
      800: '#808080',
      900: '#808080',
      950: '#ffffff',
    },
    success: {
      50: '#000000',
      100: '#000000',
      200: '#000000',
      300: '#000000',
      400: '#000000',
      500: '#00ff00',
      600: '#00ff00',
      700: '#00ff00',
      800: '#00ff00',
      900: '#00ff00',
      950: '#ffffff',
    },
    warning: {
      50: '#000000',
      100: '#000000',
      200: '#000000',
      300: '#000000',
      400: '#000000',
      500: '#ffff00',
      600: '#ffff00',
      700: '#ffff00',
      800: '#ffff00',
      900: '#ffff00',
      950: '#ffffff',
    },
    error: {
      50: '#000000',
      100: '#000000',
      200: '#000000',
      300: '#000000',
      400: '#000000',
      500: '#ff0000',
      600: '#ff0000',
      700: '#ff0000',
      800: '#ff0000',
      900: '#ff0000',
      950: '#ffffff',
    },
    neutral: {
      white: '#ffffff',
      black: '#000000',
      50: '#000000',
      100: '#000000',
      200: '#000000',
      300: '#000000',
      400: '#000000',
      500: '#808080',
      600: '#808080',
      700: '#808080',
      800: '#808080',
      900: '#808080',
      950: '#ffffff',
    },
  },
  surface: {
    background: '#ffffff',
    foreground: '#000000',
    muted: '#ffffff',
    'muted-foreground': '#000000',
    popover: '#ffffff',
    'popover-foreground': '#000000',
    card: '#ffffff',
    'card-foreground': '#000000',
    border: '#000000',
    input: '#000000',
    ring: '#0000ff',
  },
  content: {
    primary: '#0000ff',
    'primary-foreground': '#ffffff',
    secondary: '#000000',
    'secondary-foreground': '#ffffff',
    destructive: '#ff0000',
    'destructive-foreground': '#ffffff',
    muted: '#000000',
    'muted-foreground': '#ffffff',
    accent: '#000000',
    'accent-foreground': '#ffffff',
  },
};

// Ensure dist directory exists
mkdirSync('dist', { recursive: true });

// Generate CSS files
const lightThemeCSS = generateCSSVariables(lightTheme, 'fk');
const darkThemeCSS = generateCSSVariables(darkTheme, 'fk');
const highContrastThemeCSS = generateCSSVariables(highContrastTheme, 'fk');

// Write CSS files
writeFileSync('dist/light.css', lightThemeCSS);
writeFileSync('dist/dark.css', darkThemeCSS);
writeFileSync('dist/high-contrast.css', highContrastThemeCSS);

console.log('✅ Theme CSS files generated successfully!');
