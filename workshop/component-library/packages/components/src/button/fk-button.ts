import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { PropertyValues } from 'lit';
import { FeatherKitElement } from '../shared/base-element.js';
import { commonStyles, buttonStyles } from '../shared/styles.js';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button component for FeatherKit
 * 
 * @tag fk-button
 * @slot - Button content
 * @slot leading-icon - Icon before the content
 * @slot trailing-icon - Icon after the content
 * @event fk-click - Fired when button is clicked
 * @event fk-focus - Fired when button receives focus
 * @event fk-blur - Fired when button loses focus
 */
@customElement('fk-button')
export class FkButton extends FeatherKitElement {
  static override styles = [
    commonStyles,
    buttonStyles,
    css`
      :host {
        --fk-button-height-sm: 2rem;
        --fk-button-height-md: 2.5rem;
        --fk-button-height-lg: 3rem;
      }

      .fk-button {
        height: var(--fk-button-height-md);
        min-width: var(--fk-button-height-md);
        gap: var(--fk-spacing-2, 0.5rem);
      }

      .fk-sm {
        height: var(--fk-button-height-sm);
        min-width: var(--fk-button-height-sm);
      }

      .fk-lg {
        height: var(--fk-button-height-lg);
        min-width: var(--fk-button-height-lg);
      }

      .fk-loading .fk-content {
        opacity: 0.7;
      }

      .fk-spinner {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    `
  ];

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  loading = false;

  @property({ type: String, reflect: true })
  variant: ButtonVariant = 'primary';

  @property({ type: String, reflect: true })
  size: ButtonSize = 'md';

  @property({ type: String, reflect: true })
  type: 'button' | 'submit' | 'reset' = 'button';

  @state()
  private _pressed = false;

  override render() {
    const classes = this.getComponentClasses();
    
    return html`
      <button
        class="fk-button ${classes.join(' ')}"
        type=${this.type}
        ?disabled=${this.disabled || this.loading}
        @click=${this.handleClick}
        @focus=${this.handleFocus}
        @blur=${this.handleBlur}
        @keydown=${this.handleKeydown}
        @mousedown=${this.handleMouseDown}
        @mouseup=${this.handleMouseUp}
        @mouseleave=${this.handleMouseLeave}
        aria-pressed=${this._pressed}
        part="button"
      >
        <div class="fk-content">
          <slot name="leading-icon" part="leading-icon"></slot>
          <slot part="content"></slot>
          <slot name="trailing-icon" part="trailing-icon"></slot>
        </div>
        ${this.loading ? html`<div class="fk-spinner" part="spinner"></div>` : ''}
      </button>
    `;
  }

  private handleClick(event: MouseEvent): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      return;
    }

    this.dispatchCustomEvent('fk-click', {
      originalEvent: event,
      button: this,
    });
  }

  private handleFocus(event: FocusEvent): void {
    this.dispatchCustomEvent('fk-focus', {
      originalEvent: event,
      button: this,
    });
  }

  private handleBlur(event: FocusEvent): void {
    this.dispatchCustomEvent('fk-blur', {
      originalEvent: event,
      button: this,
    });
  }

  private handleMouseDown(event: MouseEvent): void {
    if (this.disabled || this.loading) return;
    this._pressed = true;
  }

  private handleMouseUp(event: MouseEvent): void {
    this._pressed = false;
  }

  private handleMouseLeave(event: MouseEvent): void {
    this._pressed = false;
  }

  protected override handleActivation(): void {
    if (this.disabled || this.loading) return;
    
    // Simulate click for keyboard activation
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(clickEvent);
  }

  protected override getAriaAttributes(): Record<string, string> {
    const attrs = super.getAriaAttributes();
    
    if (this.loading) {
      attrs['aria-busy'] = 'true';
    }
    
    return attrs;
  }

  protected override getThemeProperties(): Record<string, string> {
    return {
      '--fk-button-height-sm': '2rem',
      '--fk-button-height-md': '2.5rem',
      '--fk-button-height-lg': '3rem',
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'fk-button': FkButton;
  }
}
