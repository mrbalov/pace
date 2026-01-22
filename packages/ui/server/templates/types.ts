/**
 * Template options for generating HTML pages.
 */
export type TemplateOptions = {
  /**
   * Page title.
   */
  title: string;
  /**
   * Main content HTML.
   */
  content: string;
  /**
   * Additional head elements (CSS, meta tags, etc.).
   */
  head?: string;
};
