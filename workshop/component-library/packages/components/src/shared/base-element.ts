import { LitElement, PropertyValues } from 'lit';

/**
 * Base component class with common functionality for FeatherKit components
 */
export abstract class FeatherKitElement extends LitElement {
  /**
   * Whether the component is disabled
   */
  abstract disabled: boolean;

  /**
   * Whether the component is in a loading state
   */
  abstract loading?: boolean;

  /**
   * Component variant
   */
  abstract variant?: string;

  /**
   * Component size
   */
  abstract size?: 'sm' | 'md' | 'lg';

  /**
   * Get the component's tag name
   */
  static get tagName(): string {
    return this.name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, 'fk-');
  }

  /**
   * Generate a unique ID for the component
   */
  protected generateId(): string {
    return `${this.constructor.name.toLowerCase()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if the component should be interactive
   */
  protected get isInteractive(): boolean {
    return !this.disabled && !this.loading;
  }

  /**
   * Get CSS classes for the component
   */
  protected getComponentClasses(): string[] {
    const classes = ['fk-component'];
    
    if (this.disabled) classes.push('fk-disabled');
    if (this.loading) classes.push('fk-loading');
    if (this.variant) classes.push(`fk-${this.variant}`);
    if (this.size) classes.push(`fk-${this.size}`);
    
    return classes;
  }

  /**
   * Handle keyboard events consistently across components
   */
  protected handleKeydown(event: KeyboardEvent): void {
    if (!this.isInteractive) return;
    
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.handleActivation();
        break;
      case 'Escape':
        this.handleEscape();
        break;
    }
  }

  /**
   * Handle component activation (click, enter, space)
   */
  protected handleActivation(): void {
    // Override in subclasses
  }

  /**
   * Handle escape key
   */
  protected handleEscape(): void {
    // Override in subclasses
  }

  /**
   * Dispatch a custom event with proper detail
   */
  protected dispatchCustomEvent<T = any>(eventName: string, detail?: T): boolean {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true,
    });
    return this.dispatchEvent(event);
  }

  /**
   * Get ARIA attributes for the component
   */
  protected getAriaAttributes(): Record<string, string> {
    const attrs: Record<string, string> = {};
    
    if (this.disabled) {
      attrs['aria-disabled'] = 'true';
    }
    
    return attrs;
  }

  /**
   * Update ARIA attributes when properties change
   */
  protected updateAriaAttributes(): void {
    const attrs = this.getAriaAttributes();
    Object.entries(attrs).forEach(([key, value]) => {
      this.setAttribute(key, value);
    });
  }

  /**
   * Override to update ARIA attributes when properties change
   */
  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    this.updateAriaAttributes();
  }

  /**
   * Get CSS custom properties for theming
   */
  protected getThemeProperties(): Record<string, string> {
    return {};
  }

  /**
   * Apply theme properties to the component
   */
  protected applyThemeProperties(): void {
    const properties = this.getThemeProperties();
    Object.entries(properties).forEach(([key, value]) => {
      this.style.setProperty(key, value);
    });
  }
}
