/**
 * Web Components Registration
 * This file registers all web components for client-side use.
 */

// App Button Component
class AppButton extends HTMLElement {
  render() {
    const variant = this.getAttribute('variant') || 'primary';
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
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['variant', 'disabled', 'loading', 'type'];
  }

  attributeChangedCallback() {
    this.render();
  }
}

customElements.define('app-button', AppButton);

// App Card Component
class AppCard extends HTMLElement {
  render() {
    const header = this.querySelector('[slot="header"]')?.outerHTML || '';
    const footer = this.querySelector('[slot="footer"]')?.outerHTML || '';
    const bodyContent = Array.from(this.childNodes)
      .filter((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node;
          return element.getAttribute('slot') !== 'header' && element.getAttribute('slot') !== 'footer';
        }
        return node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE;
      })
      .map((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          return node.outerHTML;
        }
        return node.textContent || '';
      })
      .join('');

    this.innerHTML = `
      <article class="pico-card">
        ${header ? `<header>${header.replace(/slot="header"/g, '')}</header>` : ''}
        ${bodyContent ? `<div>${bodyContent}</div>` : ''}
        ${footer ? `<footer>${footer.replace(/slot="footer"/g, '')}</footer>` : ''}
      </article>
    `;
  }

  connectedCallback() {
    this.render();
  }
}

customElements.define('app-card', AppCard);

// Loading Spinner Component
class LoadingSpinner extends HTMLElement {
  render() {
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
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['size', 'text'];
  }

  attributeChangedCallback() {
    this.render();
  }
}

customElements.define('loading-spinner', LoadingSpinner);
