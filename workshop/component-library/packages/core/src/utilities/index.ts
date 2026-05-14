/**
 * Utility classes for common patterns
 */

export const utilityClasses = `
/* Visually hidden - for screen readers only */
.fk-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus ring utility */
.fk-focus-ring {
  outline: 2px solid var(--fk-color-primary-500, #0ea5e9);
  outline-offset: 2px;
}

/* Container queries support */
.fk-container {
  container-type: inline-size;
}

/* Stack layout utility */
.fk-stack {
  display: flex;
  flex-direction: column;
  gap: var(--fk-spacing-4, 1rem);
}

.fk-stack--sm {
  gap: var(--fk-spacing-2, 0.5rem);
}

.fk-stack--lg {
  gap: var(--fk-spacing-6, 1.5rem);
}

.fk-stack--xl {
  gap: var(--fk-spacing-8, 2rem);
}

/* Inline layout utility */
.fk-inline {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--fk-spacing-4, 1rem);
}

.fk-inline--sm {
  gap: var(--fk-spacing-2, 0.5rem);
}

.fk-inline--lg {
  gap: var(--fk-spacing-6, 1.5rem);
}

.fk-inline--xl {
  gap: var(--fk-spacing-8, 2rem);
}

/* Grid layout utility */
.fk-grid {
  display: grid;
  gap: var(--fk-spacing-4, 1rem);
}

.fk-grid--sm {
  gap: var(--fk-spacing-2, 0.5rem);
}

.fk-grid--lg {
  gap: var(--fk-spacing-6, 1.5rem);
}

.fk-grid--xl {
  gap: var(--fk-spacing-8, 2rem);
}

/* Text utilities */
.fk-text-center {
  text-align: center;
}

.fk-text-left {
  text-align: left;
}

.fk-text-right {
  text-align: right;
}

.fk-text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Spacing utilities */
.fk-p-0 { padding: var(--fk-spacing-0, 0); }
.fk-p-1 { padding: var(--fk-spacing-1, 0.25rem); }
.fk-p-2 { padding: var(--fk-spacing-2, 0.5rem); }
.fk-p-3 { padding: var(--fk-spacing-3, 0.75rem); }
.fk-p-4 { padding: var(--fk-spacing-4, 1rem); }
.fk-p-6 { padding: var(--fk-spacing-6, 1.5rem); }
.fk-p-8 { padding: var(--fk-spacing-8, 2rem); }

.fk-m-0 { margin: var(--fk-spacing-0, 0); }
.fk-m-1 { margin: var(--fk-spacing-1, 0.25rem); }
.fk-m-2 { margin: var(--fk-spacing-2, 0.5rem); }
.fk-m-3 { margin: var(--fk-spacing-3, 0.75rem); }
.fk-m-4 { margin: var(--fk-spacing-4, 1rem); }
.fk-m-6 { margin: var(--fk-spacing-6, 1.5rem); }
.fk-m-8 { margin: var(--fk-spacing-8, 2rem); }

/* Border radius utilities */
.fk-rounded-none { border-radius: var(--fk-radius-none, 0); }
.fk-rounded-sm { border-radius: var(--fk-radius-sm, 0.125rem); }
.fk-rounded { border-radius: var(--fk-radius-base, 0.25rem); }
.fk-rounded-md { border-radius: var(--fk-radius-md, 0.375rem); }
.fk-rounded-lg { border-radius: var(--fk-radius-lg, 0.5rem); }
.fk-rounded-xl { border-radius: var(--fk-radius-xl, 0.75rem); }
.fk-rounded-full { border-radius: var(--fk-radius-full, 9999px); }
`;

export default utilityClasses;
