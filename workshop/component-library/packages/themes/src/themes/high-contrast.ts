// High contrast theme tokens

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

export const highContrastThemeCSS = generateCSSVariables(highContrastTheme, 'fk');
export default highContrastTheme;
