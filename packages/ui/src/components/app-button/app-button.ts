import type { ButtonVariant } from '../types';

/**
 * App button web component.
 * Provides styled button with variants and states.
 */
class AppButton extends HTMLElement {
  /**
   * Renders the button component.
   *
   * @returns {void}
   */
  render = (): void => {
    const variant = (this.getAttribute('variant') || 'primary') as ButtonVariant;
    const disabled = this.hasAttribute('disabled');
    const loading = this.hasAttribute('loading');
    const text = this.textContent || '';
    const type = this.getAttribute('type') || 'button';

    const buttonClass = variant === 'secondary'
      ? 'pico-btn pico-btn-secondary'
      : variant === 'outline'
      ? 'pico-btn pico-btn-outline'
      : 'pico-btn';

    const loadingText = loading ? '<span aria-hidden="true">⏳ </span>' : '';

    this.innerHTML = `
      <button 
        class="${buttonClass}"
        type="${type}"
        ${disabled ? 'disabled' : ''}
        ${loading ? 'aria-busy="true"' : ''}
      >
        ${loadingText}${text}
      </button>
    `;
  };

  /**
   * Called when element is inserted into DOM.
   *
   * @returns {void}
   */
  connectedCallback = (): void => {
    this.render();
  };

  /**
   * Called when observed attributes change.
   */
  static get observedAttributes(): string[] {
    return ['variant', 'disabled', 'loading', 'type'];
  }

  /**
   * Called when an observed attribute changes.
   *
   * @returns {void}
   */
  attributeChangedCallback = (): void => {
    this.render();
  };
}

customElements.define('app-button', AppButton);

export default AppButton;
