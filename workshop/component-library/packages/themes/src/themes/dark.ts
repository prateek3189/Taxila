// Dark theme tokens

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

// Generate CSS variables from theme tokens
function generateCSSVariables(tokens: any, prefix = 'fk'): string {
  const cssVars: string[] = [];
  
  function processTokens(obj: any, path = ''): void {
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

export const darkThemeCSS = generateCSSVariables(darkTheme, 'fk');
export default darkTheme;
