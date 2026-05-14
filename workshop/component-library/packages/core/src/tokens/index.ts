import colors from './colors.json';
import spacing from './spacing.json';
import typography from './typography.json';
import motion from './motion.json';

export interface DesignToken {
  $value: string | number;
  $type?: string;
  $description?: string;
}

export interface TokenGroup {
  [key: string]: DesignToken | TokenGroup | string;
}

export interface DesignTokens {
  color: TokenGroup;
  surface: TokenGroup;
  content: TokenGroup;
  spacing: TokenGroup;
  radius: TokenGroup;
  border: TokenGroup;
  shadow: TokenGroup;
  z: TokenGroup;
  typography: TokenGroup;
  motion: TokenGroup;
}

export const tokens: DesignTokens = {
  color: colors.color,
  surface: colors.surface,
  content: colors.content,
  spacing: spacing.spacing,
  radius: spacing.radius,
  border: spacing.border,
  shadow: spacing.shadow,
  z: spacing.z,
  typography: typography.typography,
  motion: motion.motion,
};

/**
 * Converts a token path to a CSS custom property name
 * @param path - The token path (e.g., 'color.primary.500')
 * @param prefix - Optional prefix for the CSS custom property
 * @returns CSS custom property name (e.g., '--fk-color-primary-500')
 */
export function tokenToCSSVar(path: string, prefix = 'fk'): string {
  return `--${prefix}-${path.replace(/\./g, '-')}`;
}

/**
 * Gets a token value by path
 * @param tokens - The tokens object
 * @param path - The token path (e.g., 'color.primary.500')
 * @returns The token value or undefined if not found
 */
export function getTokenValue(tokens: TokenGroup, path: string): string | undefined {
  const keys = path.split('.');
  let current: any = tokens;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return typeof current === 'object' && '$value' in current
    ? (current.$value as string)
    : undefined;
}

/**
 * Generates CSS custom properties from design tokens
 * @param tokens - The tokens object
 * @param prefix - Optional prefix for CSS custom properties
 * @returns CSS string with custom properties
 */
export function generateCSSVariables(tokens: TokenGroup, prefix = 'fk'): string {
  const cssVars: string[] = [];

  function processTokens(obj: TokenGroup, path = ''): void {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof value === 'object' && '$value' in value) {
        const cssVar = tokenToCSSVar(currentPath, prefix);
        cssVars.push(`  ${cssVar}: ${value.$value};`);
      } else if (typeof value === 'object') {
        processTokens(value as TokenGroup, currentPath);
      }
    }
  }

  processTokens(tokens);

  return `:root {\n${cssVars.join('\n')}\n}`;
}

export default tokens;
