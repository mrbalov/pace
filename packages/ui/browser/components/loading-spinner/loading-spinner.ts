/**
 * Loading spinner web component.
 * Provides accessible loading indicator.
 */
class LoadingSpinner extends HTMLElement {
  /**
   * Renders the loading spinner component.
   *
   * @returns {void}
   */
  render = (): void => {
    const size = this.getAttribute('size') || 'medium';
    const text = this.getAttribute('text') || 'Loading...';

    const sizeClass = size === 'small' ? 'small' : size === 'large' ? 'large' : '';

    this.innerHTML = `
      <div role="status" aria-live="polite" class="loading-spinner ${sizeClass}">
        <span aria-hidden="true" class="spinner">⏳</span>
        <span class="sr-only">${text}</span>
      </div>
      <style>
        .loading-spinner {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .loading-spinner .spinner {
          animation: spin 1s linear infinite;
          display: inline-block;
        }
        .loading-spinner.small .spinner {
          font-size: 0.875rem;
        }
        .loading-spinner.large .spinner {
          font-size: 1.5rem;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      </style>
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
    return ['size', 'text'];
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

customElements.define('loading-spinner', LoadingSpinner);

export default LoadingSpinner;
