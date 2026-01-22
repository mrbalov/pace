/**
 * Checks if a node should be included in card body content.
 *
 * @param {Node} node - DOM node to check
 * @returns {boolean} True if node should be included in body
 * @internal
 */
const isBodyNode = (node: Node): boolean => {
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;
    return element.getAttribute('slot') !== 'header' && element.getAttribute('slot') !== 'footer';
  }
  return node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE;
};

/**
 * Converts a node to HTML string.
 *
 * @param {Node} node - DOM node to convert
 * @returns {string} HTML string representation
 * @internal
 */
const nodeToHtml = (node: Node): string => {
  if (node.nodeType === Node.ELEMENT_NODE) {
    return (node as Element).outerHTML;
  }
  return node.textContent || '';
};

/**
 * App card web component.
 * Provides card container with header, body, and footer slots.
 */
class AppCard extends HTMLElement {
  /**
   * Renders the card component.
   *
   * @returns {void}
   */
  render = (): void => {
    const header = this.querySelector('[slot="header"]')?.outerHTML || '';
    const footer = this.querySelector('[slot="footer"]')?.outerHTML || '';
    const bodyContent = Array.from(this.childNodes)
      .filter(isBodyNode)
      .map(nodeToHtml)
      .join('');

    this.innerHTML = `
      <article class="pico-card">
        ${header ? `<header>${header.replace(/slot="header"/g, '')}</header>` : ''}
        ${bodyContent ? `<div>${bodyContent}</div>` : ''}
        ${footer ? `<footer>${footer.replace(/slot="footer"/g, '')}</footer>` : ''}
      </article>
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
}

customElements.define('app-card', AppCard);

export default AppCard;
