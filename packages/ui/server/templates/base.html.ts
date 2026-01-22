import type { TemplateOptions } from './types';

/**
 * Generates base HTML template with Pico CSS.
 *
 * @param {TemplateOptions} options - Template options
 * @returns {string} Complete HTML document string
 */
const baseTemplate = (options: TemplateOptions): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.title}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">
  ${options.head || ''}
</head>
<body>
  ${options.content}
  <script src="/js/components.js"></script>
  <script type="module" src="/js/app.js"></script>
</body>
</html>`;
};

export default baseTemplate;
