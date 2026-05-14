import { css, unsafeCSS } from 'lit';

/**
 * CSS template literal helper for FeatherKit components
 */
export const fkCSS = (strings: TemplateStringsArray, ...values: any[]) => {
  return css(strings, ...values.map(value => 
    typeof value === 'string' ? unsafeCSS(value) : value
  ));
};

/**
 * Common CSS patterns for FeatherKit components
 */
export const commonStyles = fkCSS`
  :host {
    display: inline-block;
    box-sizing: border-box;
  }

  :host([hidden]) {
    display: none !important;
  }

  .fk-component {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    font-family: var(--fk-typography-font-family-sans, ui-sans-serif, system-ui, sans-serif);
    font-size: var(--fk-typography-font-size-base, 1rem);
    line-height: var(--fk-typography-line-height-normal, 1.5);
    transition: all var(--fk-motion-transition-base, 200ms cubic-bezier(0, 0, 0.2, 1));
  }

  .fk-component:focus-visible {
    outline: 2px solid var(--fk-color-primary-500, #0ea5e9);
    outline-offset: 2px;
  }

  .fk-disabled {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed;
  }

  .fk-loading {
    pointer-events: none;
  }

  /* Size variants */
  .fk-sm {
    font-size: var(--fk-typography-font-size-sm, 0.875rem);
    padding: var(--fk-spacing-2, 0.5rem) var(--fk-spacing-3, 0.75rem);
  }

  .fk-md {
    font-size: var(--fk-typography-font-size-base, 1rem);
    padding: var(--fk-spacing-3, 0.75rem) var(--fk-spacing-4, 1rem);
  }

  .fk-lg {
    font-size: var(--fk-typography-font-size-lg, 1.125rem);
    padding: var(--fk-spacing-4, 1rem) var(--fk-spacing-6, 1.5rem);
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .fk-component {
      transition: none;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .fk-component:focus-visible {
      outline-width: 3px;
    }
  }
`;

/**
 * Button-specific styles
 */
export const buttonStyles = fkCSS`
  .fk-button {
    border: var(--fk-border-width-1, 1px) solid transparent;
    border-radius: var(--fk-radius-md, 0.375rem);
    font-weight: var(--fk-typography-font-weight-medium, 500);
    cursor: pointer;
    user-select: none;
    text-decoration: none;
    white-space: nowrap;
  }

  .fk-button:hover:not(.fk-disabled):not(.fk-loading) {
    transform: translateY(-1px);
    box-shadow: var(--fk-shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
  }

  .fk-button:active:not(.fk-disabled):not(.fk-loading) {
    transform: translateY(0);
    box-shadow: var(--fk-shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05));
  }

  /* Button variants */
  .fk-primary {
    background-color: var(--fk-color-primary-500, #0ea5e9);
    color: var(--fk-color-primary-foreground, #ffffff);
  }

  .fk-primary:hover:not(.fk-disabled):not(.fk-loading) {
    background-color: var(--fk-color-primary-600, #0284c7);
  }

  .fk-secondary {
    background-color: var(--fk-color-secondary-100, #f1f5f9);
    color: var(--fk-color-secondary-900, #0f172a);
    border-color: var(--fk-color-secondary-200, #e2e8f0);
  }

  .fk-secondary:hover:not(.fk-disabled):not(.fk-loading) {
    background-color: var(--fk-color-secondary-200, #e2e8f0);
  }

  .fk-ghost {
    background-color: transparent;
    color: var(--fk-color-primary-500, #0ea5e9);
  }

  .fk-ghost:hover:not(.fk-disabled):not(.fk-loading) {
    background-color: var(--fk-color-primary-50, #f0f9ff);
  }

  .fk-destructive {
    background-color: var(--fk-color-error-500, #ef4444);
    color: var(--fk-color-error-foreground, #ffffff);
  }

  .fk-destructive:hover:not(.fk-disabled):not(.fk-loading) {
    background-color: var(--fk-color-error-600, #dc2626);
  }
`;

/**
 * Form element styles
 */
export const formStyles = fkCSS`
  .fk-form-element {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--fk-spacing-1, 0.25rem);
  }

  .fk-label {
    font-size: var(--fk-typography-font-size-sm, 0.875rem);
    font-weight: var(--fk-typography-font-weight-medium, 500);
    color: var(--fk-color-foreground, #0f172a);
  }

  .fk-input {
    border: var(--fk-border-width-1, 1px) solid var(--fk-color-border, #e2e8f0);
    border-radius: var(--fk-radius-md, 0.375rem);
    padding: var(--fk-spacing-3, 0.75rem);
    font-size: var(--fk-typography-font-size-base, 1rem);
    background-color: var(--fk-color-background, #ffffff);
    color: var(--fk-color-foreground, #0f172a);
    transition: border-color var(--fk-motion-transition-base, 200ms cubic-bezier(0, 0, 0.2, 1));
  }

  .fk-input:focus {
    outline: none;
    border-color: var(--fk-color-primary-500, #0ea5e9);
    box-shadow: 0 0 0 3px var(--fk-color-primary-100, #e0f2fe);
  }

  .fk-input:invalid {
    border-color: var(--fk-color-error-500, #ef4444);
  }

  .fk-help-text {
    font-size: var(--fk-typography-font-size-sm, 0.875rem);
    color: var(--fk-color-muted-foreground, #64748b);
  }

  .fk-error-text {
    font-size: var(--fk-typography-font-size-sm, 0.875rem);
    color: var(--fk-color-error-500, #ef4444);
  }
`;

/**
 * Loading spinner styles
 */
export const spinnerStyles = fkCSS`
  .fk-spinner {
    display: inline-block;
    width: 1em;
    height: 1em;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: fk-spin 1s linear infinite;
  }

  @keyframes fk-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    .fk-spinner {
      animation: none;
    }
  }
`;
